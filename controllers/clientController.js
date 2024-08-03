import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Client } from "../models/Client.js";
import { Contract } from "../models/Contracts.js";
import { Lead } from "../models/Lead.js";
import ErrorHandler from "../utils/errorHandler.js";

export const getAllClients = catchAsyncError(async (req, res, next) => {
  const clients = await Client.find({}).populate("lead").populate("contract");

  res.status(200).json({
    success: true,
    clients,
  });
});
