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
    bank,
    program,
    installements,
    subAgent,
    fees,
    currency,
    operationCommision = false,
    operationJunior,
    operationHead,
    commissonPercentage,
    discount,
  } = req.body;

  // const fileUri = getDataUri(file);
  // const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);

  let agent = subAgent != "" ? await SubAgent.findById(subAgent) : "";

  if (!lead || !program || !installements || !installements) {
    return next(new ErrorHandler("Please enter all fields", 400));
  }

  if (!Array.isArray(installements)) {
    return next(new ErrorHandler("Installements must be an array", 400));
  }

  for (let i of installements) {
    const { amount, stage, remarks } = i;
    if (!amount || !stage || !remarks) {
      return next(
        new ErrorHandler("Please enter all fields for each installement", 400)
      );
    }
  }
  let selectedProgram = await Program.findById(program);
  let totalCostProgram = parseInt(
    selectedProgram.generalInformation[0].totalCost
  );

  let totalCostInstallements = installements.reduce((a, b) => a + b.amount, 0);
  const selectedBank = await Bank.findById(bank);

  if (!selectedBank) {
    return next(new ErrorHandler("Invalid Bank Id", 401));
  }

  if (totalCostInstallements != totalCostProgram) {
    return next(
      new ErrorHandler(
        `Total Cost of program is ${totalCostProgram}PKR but the sum of installements in ${totalCostInstallements}PKR`
      )
    );
  }

  let vendor = await Vendor.findById(selectedProgram.vendor.id);

  const contract = await Contract.create({
    lead: lead,
    program: program,
    installements: installements,
    bank: selectedBank._id,
    discount: discount,

    file: {
      public_id: "temp_id",
      url: "temp_url",
    },

    vendor:
      vendor !== ""
        ? {
            id: vendor._id,
            fees: selectedProgram.vendor.fees,
            currency: selectedProgram.vendor.currency,
          }
        : null,
    subAgent:
      subAgent != null
        ? {
            id: agent._id,
            fees: fees,
            currency: currency,
          }
        : null,
  });

  if (vendor != null) {
    let vendorPayment = await VendorPayment.create({
      vendor: vendor._id,
      amount: selectedProgram.vendor.fees,
      currency: selectedProgram.vendor.currency,
      contract: contract._id,
    });

    vendor.payments.push(vendorPayment._id);
  }

  if (agent != null) {
    let subAgentPayment = await SubAgentPayment.create({
      agent: agent._id,
      amount: fees,
      currency: currency,
      contract: contract._id,
    });

    agent.payments.push(subAgentPayment._id);
  }

  await Client.create({
    lead: lead,
    contract: contract._id,
  });

  let incoming = {
    amount: totalCostProgram,
    reason: "Invoice Payment",
    contract: contract._id,
  };

  selectedBank.incomings.push(incoming);
  selectedBank.stats.incoming =
    parseInt(selectedBank.stats.incoming) + parseInt(totalCostProgram);

  const selectedLead = await Lead.findById(lead).populate("assignedTo");

  if (!selectedLead) {
    return next(new ErrorHandler("Invalid Lead Id", 401));
  }

  const currentMonth = new Date().toISOString().substring(0, 7);

  let employeePayroll = await Payroll.findOne({
    employeeId: selectedLead.assignedTo._id,
    month: currentMonth,
  });

  if (!employeePayroll) {
    return next(new ErrorHandler("Employee Payroll Not Found"));
  }

  let employeeCommisson = installements[0].amount * 0.05;

  employeePayroll.clientsClosed.push({
    contractId: contract._id,
    commisson: employeeCommisson,
  });

  if (operationCommision) {
    let junior = await User.findById(operationJunior);
    let hod = await User.findById(operationHead);

    if (!junior || !hod) {
      return next(new ErrorHandler("Junior or Hod Not Found", 401));
    }
  }

  await selectedBank.save();
  await employeePayroll.save();
  await vendor.save();

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
