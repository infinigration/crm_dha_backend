import mongoose from "mongoose";

const scheama = new mongoose.Schema({
  lead_process: [
    {
      title: {
        type: String,
        required: true,
      },

      status: {
        type: String,
        required: true,
        default: "active",
      },
    },
  ],
});

export const Process = mongoose.model("Process", scheama);
