import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Lead } from "../models/Lead.js";
import { Remark } from "../models/Remarks.js";
import { User } from "../models/User.js";
import ErrorHandler from "../utils/errorHandler.js";

export const createRemark = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const { title, remark } = req.body;
  if (!title || !remark) {
    return next(new ErrorHandler("Please enter all feilds", 401));
  }
  const user = await User.findById(req.user._id);
  const lead = await Lead.findById(id);

  if (!lead) {
    return next(new ErrorHandler("Invalid Lead Id", 401));
  }

  let r = await Remark.create({
    author: user._id,
    lead: lead._id,
    title: title,
    remark: remark,
  });

  lead.remarks.push(r._id);
  await lead.save();
  res.status(200).json({
    success: true,
    message: "Remark Created Successfully",
  });
});


