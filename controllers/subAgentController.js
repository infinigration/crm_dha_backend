import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { SubAgent } from "../models/SubAgent.js";
import ErrorHandler from "../utils/errorHandler.js";

export const getAllSubAgents = catchAsyncError(async (req, res, next) => {
  let agents = await SubAgent.find({});

  res.status(200).json({
    success: true,
    agents,
  });
});

export const createSubAgent = catchAsyncError(async (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    return next(new ErrorHandler("Please enter all feilds"));
  }

  await SubAgent.create({
    name: name,
  });

  res.status(200).json({
    success: true,
    message: "Sub Agent Created Successfully",
  });
});
