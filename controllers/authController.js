import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { User } from "../models/User.js";
import ErrorHandler from "../utils/errorHandler.js";
import { sendToken } from "../utils/sendToken.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "cloudinary";

export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter All Feilds", 400));
  }

  let user = await User.findOne({ "bioData.email": email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Incorrect Email or Password", 409));
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return next(new ErrorHandler("Incorrect Email or Password", 400));
  }

  sendToken(res, user, `Welcome Back ${user.bioData.name}`, 200);
});

export const logout = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      httpOnly: true,
      sameSite: "none",
      secure: true,

      expires: new Date(Date.now()),
    })
    .json({
      sucess: true,
      message: "User Logged Out Sucessfully",
    });
});

export const getMyProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id)
    .populate("assignedLeads")
    .populate("forwardedLeads");

  res.status(200).json({
    sucess: true,
    user,
  });
});

// Admin Routes

export const createUser = catchAsyncError(async (req, res, next) => {
  const {
    name,
    fatherName,
    cnic,
    mobile,
    email,
    gender,
    dob,
    maritalStatus,
    religion,
    nationality,
    title,
    department,
    salary,
    joiningDate,
    role,
    password,
  } = req.body;
  // const file = req.file;

  if (
    !name ||
    !fatherName ||
    !cnic ||
    !mobile ||
    !email ||
    !gender ||
    !dob ||
    !maritalStatus ||
    !religion || // Corrected spelling
    !nationality ||
    !title ||
    !department ||
    !salary ||
    !joiningDate ||
    !role ||
    !password
  ) {
    return next(new ErrorHandler("Please Enter All Fields", 400));
  }

  let user = await User.findOne({ "bioData.email": email });

  if (user) {
    return next(new ErrorHandler("User already exists", 409));
  }

  // const fileUri = getDataUri(file);
  // const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);

  user = await User.create({
    bioData: {
      name,
      fatherName,
      cnic,
      mobile,
      email: email,
      gender,
      dob,
      maritalStatus,
      religion, // Corrected spelling
      nationality,
    },
    job: {
      title,
      department,
      salary,
      joiningDate,
    },
    avatar: {
      public_id: "temp_id",
      url: "temp_url",
    },
    role,
    password,
  });

  res.status(201).json({
    success: true,
    message: "Employee created successfully",
  });
});
export const getAllEmployees = catchAsyncError(async (req, res, next) => {
  const users = await User.find({});

  res.status(200).json({
    sucess: true,
    employees: users,
  });
});

export const changePassword = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(id).select("+password");

  if (!user) {
    return next(new ErrorHandler("User not found", 400));
  }

  if (!oldPassword || !newPassword) {
    return next(new ErrorHandler("Please Enter all feilds", 400));
  }

  const isMatch = await user.comparePassword(oldPassword);

  if (!isMatch) {
    return next(new ErrorHandler("Incorrect Old Password"));
  }

  user.password = newPassword;

  await user.save();
  res.status(200).json({
    sucess: true,
    message: "Password changed Successfully",
  });
});

export const updateProfile = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { name, email, role } = req.body;
  const user = await User.findById(id);

  if (!user) {
    return next(new ErrorHandler("User Not Found", 404));
  }
  if (name) user.name = name;
  if (email) user.email = email;
  if (role) user.role = role;

  await user.save();
  res.status(200).json({
    sucess: true,
    message: "Profile Updated Successfully",
  });
});

export const getEmployeeProfile = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    return next(new ErrorHandler("User Not Found", 404));
  }

  res.status(200).json({
    sucess: true,
    employee: user,
  });
});
