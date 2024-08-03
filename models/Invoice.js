import mongoose from "mongoose";

const schema = new mongoose.Schema({
  contract: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contract",
  },

  lead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lead",
  },

  program: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Program",
  },

  title: {
    type: String,
    required: true,
  },

  salesPerson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  totalAmount: {
    type: Number,
    default: 0,
    required: true,
  },

  paid: {
    type: Number,
    default: 0,
    required: true,
  },

  outstanding: {
    type: Number,
    default: 0,
    required: true,
  },

  createdAt: {
    type: Date,
    default: new Date(Date.now()),
  },
});

export const Invoice = mongoose.model("Invoice", schema);
