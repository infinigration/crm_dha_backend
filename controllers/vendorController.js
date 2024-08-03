import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Vendor } from "../models/Vendor.js";
import { VendorPayment } from "../models/VendorPayment.js";
import ErrorHandler from "../utils/errorHandler.js";

export const createVendor = catchAsyncError(async (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    return next(new ErrorHandler("Please enter all feilds", 401));
  }

  await Vendor.create({
    name: name,
  });

  res.status(200).json({
    success: true,
    message: "Vendor Created Successfully",
  });
});

export const getAllVendors = catchAsyncError(async (req, res, next) => {
  const vendors = await Vendor.find({});

  res.status(200).json({
    sucess: true,
    vendors,
  });
});

export const getVendor = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const vendor = await Vendor.findById(id);

  if (!vendor) {
    return next(new ErrorHandler("Vendor Not Found", 401));
  }

  res.status(200).json({
    sucess: true,
    vendor,
  });
});

export const getAllVendorPayments = catchAsyncError(async (req, res, next) => {
  const vendorPayments = await VendorPayment.find().populate("vendor");

  res.status(200).json({
    sucess: true,
    vendorPayments,
  });
});
