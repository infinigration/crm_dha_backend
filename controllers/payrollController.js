import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Payroll } from "../models/Payroll.js";
import { User } from "../models/User.js";
import ErrorHandler from "../utils/errorHandler.js";

export const createPayroll = catchAsyncError(async (req, res, next) => {
  const { id } = req.body;

  const employeeSelected = await User.findById(id);

  if (!employeeSelected) {
    return next(new ErrorHandler("Invalid Employee Id", 401));
  }

  const currentMonth = new Date().toISOString().substring(0, 7); // YYYY-MM format

  const existingPayroll = await Payroll.findOne({
    employeeId: employeeSelected._id,
    month: currentMonth,
  });

  if (existingPayroll) {
    return next(new ErrorHandler("Payroll for this month already exists", 401));
  }

  let payroll = await Payroll.create({
    month: currentMonth,
    employeeId: employeeSelected._id,
    basicSalary: employeeSelected.job.salary,
  });

  employeeSelected.payrolls.push(payroll._id);
  await employeeSelected.save();

  res.status(200).json({
    sucess: true,
    message: "Payroll Created Successfully",
    existingPayroll,
  });
});

export const getAllPayrolls = catchAsyncError(async (req, res, next) => {
  const payrolls = await Payroll.find();
  res.status(200).json({ sucess: true, payrolls });
});
