import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Process } from "../models/Process.js";
import ErrorHandler from "../utils/errorHandler.js";


 export const createProcess = catchAsyncError(async (req, res, next) => {
  const { process } = req.body;

  if (!process || process.length < 1) {
    return next(new ErrorHandler("Please enter all fields", 402));
  }

  let processes = await Process.find({});

  if (processes.length < 1) {
    await Process.create({
      lead_process: process,
    });
  } else {
    processes[0].lead_process = process;
    await processes[0].save();
  }

  res.status(200).json({
    success: true,
    message: "Process created successfully",
  });
});

export const getProcess = catchAsyncError(async (req, res, next) => {
  const process = await Process.find();

  res.status(200).json({
    success: true,
    process,
  });
});
