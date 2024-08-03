import mongoose from "mongoose";

const schema = new mongoose.Schema({
  doneBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  lead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lead",
  },

  task: {
    type: String,
    required: true,
    default: "",
  },

  createdAt: {
    type: Date,
    default: new Date(Date.now()),
  },
});

export const Task = mongoose.model("Task", schema);
