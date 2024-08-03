import mongoose from "mongoose";

const schema = new mongoose.Schema({
  month: {
    type: String,
  },
  
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  basicSalary: {
    type: Number,
    default: 0,
  },

  clientsClosed: [
    {
      contractId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contract",
      },

      commisson: {
        type: Number,
        default: 0,
      },
    },
  ],

  deduction: [
    {
      reason: {
        type: String,
      },

      amount: {
        type: Number,
        required: true,
      },
    },
  ],

  createdAt: {
    type: Date,
    default: new Date(Date.now()),
  },
});

export const Payroll = mongoose.model("Payroll", schema);
