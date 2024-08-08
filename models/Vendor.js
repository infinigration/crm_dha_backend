import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  program: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Program",
  },

  amount: {
    type: Number,
    default: 0,
  },

  currency: {
    type: String,
    required: true,
  },

  payments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VendorPayments",
    },
  ],
});

export const Vendor = mongoose.model("Vendor", schema);
