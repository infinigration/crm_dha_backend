import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Lead } from "../models/Lead.js";
import { User } from "../models/User.js";
import ErrorHandler from "../utils/errorHandler.js";

export const addFollowUpDate = catchAsyncError(async (req, res, next) => {
  const { leadId, taskId, date } = req.body;

  if (!leadId || !date || !taskId) {
    return next(new ErrorHandler("Please Enter All Feilds"));
  }

  const lead = await Lead.findById(leadId);

  if (!lead) {
    return next(new ErrorHandler("Invalid Lead Id"));
  }

  const task = lead.taskSummary.find(
    (t) => t._id.toString() === taskId.toString()
  );

  if (!task) {
    return next(new ErrorHandler("Task Not Found"));
  }

  task.followUpDate = date;
  await lead.save();

  res.status(200).json({
    sucess: true,
    message: "FollowUp Date added",
  });
});

export const closeTask = catchAsyncError(async (req, res, next) => {
  const { leadId, taskId } = req.body;
  const id = req.user._id;

  const user = await User.findById(id);

  if (!user) {
    return next(new ErrorHandler("User Not Found"));
  }
  if (!leadId || !taskId) {
    return next(new ErrorHandler("Please Enter all feilds", 404));
  }

  const lead = await Lead.findById(leadId);

  if (!leadId) {
    return next(new ErrorHandler("Invalid Lead Id", 404));
  }

  const task = lead.taskSummary.find(
    (t) => t._id.toString() === taskId.toString()
  );

  if (!task) {
    return next(new ErrorHandler("Task Not Found", 404));
  }

  task.taskCloseDate = new Date(Date.now());
  task.taskCloseBy = user.name;

  await lead.save();

  res.status(200).json({
    sucess: true,
    message: "Task Closed Successfully",
  });
});

export const getTasksSummary = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const lead = await Lead.findById(id);

  if (!lead) {
    return next(new ErrorHandler("Lead Not Found", 404));
  }

  res.status(200).json({
    sucess: true,
    tasks: lead.taskSummary,
  });
});
