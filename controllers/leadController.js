import { populate } from "dotenv";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Lead } from "../models/Lead.js";
import { Program } from "../models/Program.js";
import { Task } from "../models/Task.js";
import { User } from "../models/User.js";
import getDataUri from "../utils/dataUri.js";
import ErrorHandler from "../utils/errorHandler.js";
import cloudinary from "cloudinary";

export const getAllLeads = catchAsyncError(async (req, res, next) => {
  const leads = await Lead.find({})
    .populate("client.program")
    .populate("assignedTo")
    .populate({
      path: "taskSummary",
      populate: [{ path: "lead" }, { path: "doneBy" }],
    })
    .populate({
      path: "remarks",
      populate: [{ path: "author" }],
    });
  res.status(200).json({
    success: true,
    leads,
  });
});

export const createLead = catchAsyncError(async (req, res, next) => {
  const { leads } = req.body;

  if (!leads || leads.length === 0) {
    return next(new ErrorHandler("Please provide lead data"));
  }

  for (const lead of leads) {
    const { name, phone, city, source, status, campaign } = lead;
    if (!name || !phone || !source || !city || !status || !campaign) {
      return next(new ErrorHandler("Please provide all fields for each lead"));
    }

    const existingLead = await Lead.findOne({ "client.phone": phone });

    if (existingLead) {
      return next(
        new ErrorHandler("Lead with this Phone Number already exists")
      );
    }

    let l = await Lead.create({
      client: {
        name,
        phone,
        city: city,
        campaign: campaign,
        avatar: {
          public_id: "temp_id",
          url: "temp_url",
        },
      },
      source: source || "", // Assuming lead.source is the source field
      status: status || "", // Assuming lead.status is the status field
    });
  }

  res.status(200).json({
    success: true,
    message: "Leads Created Successfully",
  });
});

export const updateStatus = catchAsyncError(async (req, res, next) => {
  const { id, status } = req.body;
  const user = await User.findById(req.user._id);

  if (!id || !status) {
    return next(new ErrorHandler("Please enter all feild", 400));
  }
  const lead = await Lead.findById(id);

  if (!lead) {
    return next(new ErrorHandler("Lead Not Found", 402));
  }

  lead.status = status;

  let task = await Task.create({
    doneBy: user._id,
    lead: lead._id,
    task: "Status Updated to " + status,
  });

  lead.taskSummary.push(task._id);

  await lead.save();
  res.status(200).json({
    success: true,
    message: "Status updated Successfully",
  });
});

export const getLeadDetails = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const lead = await Lead.findById(id).populate("client.program");

  if (!lead) {
    return next(new ErrorHandler("Invalid Lead Id", 400));
  }
  res.status(200).json({
    success: true,
    lead,
  });
});

export const updateClientDetails = catchAsyncError(async (req, res, next) => {
  const { id, name, email, phone } = req.body;

  const lead = await Lead.findById(id);

  if (!lead) {
    return next(new ErrorHandler("Invalid Lead Id", 400));
  }

  if (name) lead.client.name = name;
  if (email) lead.client.email = email;
  if (phone) lead.client.phone = phone;

  await lead.save();

  res.status(200).json({
    success: true,
    message: "Client Details Updated Successfully",
  });
});

export const forwardLead = catchAsyncError(async (req, res, next) => {
  const { leadId, userId } = req.body;

  const lead = await Lead.findById(leadId);

  if (!lead) {
    return next(new ErrorHandler("Invalid Lead Id", 400));
  }

  const user = await User.findById(userId);

  if (!user) {
    return next(new ErrorHandler("Invalid User Id", 400));
  }

  const leads = user.forwardedLeads.filter(
    (f) => f.toString() === lead._id.toString()
  );

  if (leads.length > 0) {
    return next(new ErrorHandler("Forward Leads Already existed", 404));
  }
  user.forwardedLeads.push(lead._id);

  await user.save();
  const u = await User.findById(req.user._id);

  await Task.create({
    task: `Lead is forwarded to ${u.bioData.name}`,
    doneBy: u._id,
    lead: lead._id,
  });

  res.status(200).json({
    success: true,
    message: `Lead Forwarded to ${user.name} successfully`,
  });
});

export const assignLead = catchAsyncError(async (req, res, next) => {
  const { leadId, userId } = req.body;

  // Find the lead by leadId
  const lead = await Lead.findById(leadId);
  if (!lead) {
    return next(new ErrorHandler("Invalid Lead Id", 400));
  }

  // Check if the lead is already assigned
  if (lead.assignedTo) {
    return next(new ErrorHandler("Lead is already assigned", 400));
  }

  // Find the user by userId
  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorHandler("Invalid User Id", 400));
  }

  // Assign the lead to the user
  user.assignedLeads.push(lead._id);
  lead.assignedTo = user._id;

  // Create a task related to this assignment
  const task = await Task.create({
    doneBy: user._id,
    lead: lead._id,
    task: `Lead is assigned to ${user.bioData.name}`,
  });

  // Update lead's task summary with the newly created task
  lead.taskSummary.push(task._id);

  // Save the changes
  await user.save();
  await lead.save();

  // Respond with success message
  res.status(200).json({
    success: true,
    message: `Lead assigned to ${user.bioData.name} successfully`,
  });
});

export const uploadClientPorfile = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const file = req.file;

  if (!file) return next(new ErrorHandler("Please Enter all feilds", 404));

  const lead = await Lead.findById(id);
  if (!lead) return next(new ErrorHandler("Lead not found", 404));

  const fileUri = getDataUri(file);
  const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);

  lead.client.avatar.public_id = mycloud.public_id;
  lead.client.avatar.url = mycloud.secure_url;

  await lead.save();

  res.status(200).json({
    success: true,
    message: `Client Profile Image Uploaded Successfully`,
  });
});

export const updateClientProfile = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { cnic, dob, program, email, passport } = req.body;

  const lead = await Lead.findById(id);
  if (!lead) return next(new ErrorHandler("Lead not found", 404));

  if (cnic) lead.client.cnic = cnic;
  if (dob) lead.client.dob = dob;
  if (passport) lead.client.passport = passport;
  if (program) {
    const p = await Program.findById(program);

    if (!p) {
      return next(new ErrorHandler("Invalid Program Id", 404));
    }

    lead.client.program = p._id;

    lead.documents = p.documents;
  }
  if (email) lead.client.email = email;

  await lead.save();

  res.status(200).json({
    success: true,
    message: `Client Profile Updated Successfully`,
  });
});

export const uploadClientDocuments = catchAsyncError(async (req, res, next) => {
  const { lId, dId } = req.params;
  const file = req.file;
  const lead = await Lead.findById(lId).populate("client.program");

  if (!lead) return next(new ErrorHandler("Invalid Lead Id", 404));
  if (!file) return next(new ErrorHandler("Please enter all feilds", 404));

  let document = lead.documents.id(dId);

  if (!document) return next(new ErrorHandler("Invalid Document Id", 404));

  const fileUri = getDataUri(file);
  const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);

  document.file.public_id = mycloud.public_id;
  document.file.url = mycloud.secure_url;

  document.status = "uploaded";

  await lead.save();

  res.status(200).json({
    sucess: true,
    message: "Document Uploaded Successfully",
  });
});

export const getMyLeads = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id)
    .populate("assignedLeads")
    .populate("forwardedLeads")
    .populate({
      path: "assignedLeads",
      populate: [{ path: "remarks", populate: [{ path: "author" }] }],
    });

  res.status(200).json({
    sucess: true,
    assigned: user.assignedLeads,
    forwarded: user.forwardedLeads,
  });
});

export const updateLead = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { name, city, phone, campaign, source } = req.body;

  const lead = await Lead.findById(id);
  if (!lead) return next(new ErrorHandler("Lead not found", 404));

  if (name) lead.client.name = name;
  if (city) lead.client.city = city;
  if (phone) lead.client.phone = phone;
  if (campaign) lead.client.campaign = campaign;
  if (source) lead.client.source = source;

  await lead.save();

  res.status(200).json({
    success: true,
    message: `Lead Updated Successfully`,
  });
});

export const deleteLead = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const lead = await Lead.findById(id);

  await lead.deleteOne();

  res.status(200).json({
    success: true,
    message: `Lead Deleted Successfully`,
  });
});
