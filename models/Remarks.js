import mongoose from "mongoose";

const schema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  lead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lead",
  },

  title: {
    type: String,
    required: true,
  },

  remark: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: new Date(Date.now()),
  },
});

export const Remark = mongoose.model("Remark", schema);
