import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Bank } from "../models/Bank.js";
import { Client } from "../models/Client.js";
import { Contract } from "../models/Contracts.js";
import { Lead } from "../models/Lead.js";
import { Payroll } from "../models/Payroll.js";
import { Program } from "../models/Program.js";
import { SubAgent } from "../models/SubAgent.js";
import { SubAgentPayment } from "../models/subAgentPayment.js";
import { User } from "../models/User.js";
import { Vendor } from "../models/Vendor.js";
import { VendorPayment } from "../models/VendorPayment.js";
import ErrorHandler from "../utils/errorHandler.js";

export const createContract = catchAsyncError(async (req, res, next) => {
  const {
    lead,
    program,
    installements,
    discount,
    vendor,

    subAgent,
    fees,
    currency,
    operationCommision = false,
    operationJunior,
    operationHead,
    commissonPercentage,
  } = req.body;

  // Validate

  if (!Array.isArray(installements)) {
    return next(new ErrorHandler("Installments must be an array", 400));
  }

  for (let i of installements) {
    const { amount, stage, remarks } = i;
    if (!amount || !stage || !remarks) {
      return next(
        new ErrorHandler("Please enter all fields for each installment", 400)
      );
    }
  }

  // Fetch necessary data
  const selectedLead = await Lead.findById(lead).populate("assignedTo");
  const selectedProgram = await Program.findById(program);
  const selectedVendor = await Vendor.findById(vendor);
  const agent = subAgent ? await SubAgent.findById(subAgent) : null;

  // Validate fetched data
  if (!selectedLead) return next(new ErrorHandler("Please select lead", 401));
  if (!selectedProgram)
    return next(new ErrorHandler("Please select program", 401));
  if (!selectedVendor)
    return next(new ErrorHandler("Please select Vendor", 401));

  const totalCostProgram = parseInt(
    selectedProgram.generalInformation[0].totalCost
  );

  const totalCostInstallments = installements.reduce((a, b) => a + b.amount, 0);

  // Create the contract
  const contract = await Contract.create({
    lead: lead,
    program: program,
    installements: installements,
    discount: discount,
    file: {
      public_id: "temp_id",
      url: "temp_url",
    },
    vendor: vendor
      ? {
          id: vendor._id,
          fees: vendor.amount,
          currency: vendor.currency,
        }
      : null,
    subAgent: agent
      ? {
          id: agent._id,
          fees: fees,
          currency: currency,
        }
      : null,
  });

  // Handle vendor payment
  if (selectedVendor) {
    const vendorPayment = await VendorPayment.create({
      vendor: selectedVendor._id,
      amount: selectedVendor.amount,
      currency: selectedVendor.currency,
      contract: contract._id,
    });

    selectedVendor.payments.push(vendorPayment._id);
    await selectedVendor.save();
  }

  // Handle sub-agent payment
  if (agent) {
    const subAgentPayment = await SubAgentPayment.create({
      agent: agent._id,
      amount: fees,
      currency: currency,
      contract: contract._id,
    });

    // agent.payments.push(subAgentPayment._id);
    // await agent.save();
  }

  // Create client record
  await Client.create({
    lead: lead,
    contract: contract._id,
  });

  // Check if Lead is Assigned or Not
  if (!selectedLead.assignedTo || !selectedLead.assignedTo._id) {
    return next(
      new ErrorHandler("Lead is not assigned to any sales person yet")
    );
  }

  const employee = await User.findById(selectedLead.assignedTo._id);

  if (!employee) {
    return next(
      new ErrorHandler("Lead is not assigned to any sales person yet")
    );
  }

  // Handle payroll updates
  const currentMonth = new Date().toISOString().substring(0, 7);

  const employeePayroll = await Payroll.findOne({
    employeeId: selectedLead.assignedTo._id,
    month: currentMonth,
  });

  if (!employeePayroll) {
    return next(new ErrorHandler("Employee Payroll Not Found", 404));
  }

  const employeeCommission = installements[0].amount * 0.05;

  employeePayroll.clientsClosed.push({
    contractId: contract._id,
    commission: employeeCommission,
  });

  await employeePayroll.save();

  // Handle operation commission
  if (operationCommision) {
    const junior = await User.findById(operationJunior);
    const hod = await User.findById(operationHead);

    if (!junior || !hod) {
      return next(new ErrorHandler("Junior or HOD not found", 404));
    }

    // Additional logic for operation commission can be added here
  }

  res.status(201).json({
    success: true,
    message: "Contract Created Successfully",
  });
});

export const getAllContracts = catchAsyncError(async (req, res, next) => {
  const contracts = await Contract.find({})
    .populate("lead")
    .populate("program");

  res.status(201).json({
    success: true,
    contracts,
  });
});

export const getContract = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const contract = await Contract.findById(id)
    .populate("lead")
    .populate("program");

  res.status(201).json({
    success: true,
    contract,
  });
});
