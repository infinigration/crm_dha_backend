import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: {
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
