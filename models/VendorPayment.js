import mongoose from "mongoose";

const schema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
  },

  amount: {
    type: Number,
    default: 0,
  },

  currency: {
    type: String,
  },

  contract: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contract",
  },

  createdAt: {
    type: Date,
    default: new Date(Date.now()),
  },
});

export const VendorPayment = mongoose.model("VendorPayment", schema);
