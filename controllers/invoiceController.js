import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Contract } from "../models/Contracts.js";
import { Invoice } from "../models/Invoice.js";
import ErrorHandler from "../utils/errorHandler.js";

export const createInvoice = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const contract = await Contract.findById(id)
    .populate("lead")
    .populate("program");

    

  const invoices = await Invoice.find({});

  if (!contract) {
    return next(new ErrorHandler("Invalid Contract Id", 402));
  }

  const existing = invoices.filter(
    (i) => i.contract.toString() === contract._id.toString()
  );

  if (existing.length >= 1) {
    return next(
      new ErrorHandler("Invoice with Same Contract Already Exists", 402)
    );
  }

  let invoice = await Invoice.create({
    contract: contract._id,
    title: contract.lead.client.name,
    salesPerson: contract.lead.assignedTo,
    lead: contract.lead,
    program: contract.program,
    totalAmount: contract.program.generalInformation[0].totalCost * 100000,
    paid: 0,
    outstanding: contract.program.generalInformation[0].totalCost * 100000,
  });

  res.status(200).json({
    sucess: true,
    message: "Invoice Created Successfully",
    existing,
  });
});

export const getAllInvoices = catchAsyncError(async (req, res, next) => {
  const invoices = await Invoice.find({})
    .populate("contract")
    .populate("salesPerson")
    .populate("lead")
    .populate("program")
    

  res.status(200).json({
    success: true,
    invoices,
  });
});
