import mongoose from "mongoose";

const schema = new mongoose.Schema({
  
  lead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lead",
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

export const Client = mongoose.model("Client", schema);
