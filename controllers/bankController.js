import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Bank } from "../models/Bank.js";
import ErrorHandler from "../utils/errorHandler.js";

export const createBank = catchAsyncError(async (req, res, next) => {
  const { accTitle, accNo, country, address } = req.body;

  if (!accTitle || !accNo || !country || !address) {
    return next(new ErrorHandler("Please enter all feilds", 401));
  }

  await Bank.create({
    title: accTitle,
    accNo: accNo,
    country: country,
    address: address,
  });

  res.status(200).json({
    success: true,
    message: "Bank Account Created Successfully",
  });
});

export const getAllBanks = catchAsyncError(async (req, res, next) => {
  const banks = await Bank.find({});
  res.status(200).json({
    success: true,
    banks,
  });
});
