import mongoose from "mongoose";

const schema = new mongoose.Schema({
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubAgent",
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

export const SubAgentPayment = mongoose.model("SubAgentPayment", schema);
