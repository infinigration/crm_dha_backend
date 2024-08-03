import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";

const schema = new mongoose.Schema({
  bioData: {
    name: {
      type: String,
      required: true,
    },
    fatherName: {
      type: String,
      required: true,
    },
    cnic: {
      type: String,
      required: true,
      maxlength: [13, "Invalid CNIC"],
    },
    mobile: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, "Invalid email"],
    },
    gender: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    maritalStatus: {
      type: String,
      required: true,
    },
    religion: {
      type: String,
      required: true,
    },
    nationality: {
      type: String,
      required: true,
    },
  },
  job: {
    title: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  attendance: {
    holidays: {
      type: Number,
    },
  },
  role: {
    type: String,
    required: true,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },

  forwardedLeads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
    },
  ],

  assignedLeads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
    },
  ],

  conversion: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
    },
  ],

  password: {
    type: String,
    required: true,
    minlength: [6, "Password must be at least 6 characters"],
  },

  payrolls: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payroll",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

schema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

schema.methods.getJWTToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
};

schema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

schema.methods.getResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

export const User = mongoose.model("User", schema);
