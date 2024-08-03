import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  payments: [
    {
      title: {
        type: String,
      },
      amount: {
        type: Number,
        default: 0,
      },

      date: {
        type: Date,
        default: new Date(Date.now()),
      },
    },
  ],

  
});

export const SubAgent = mongoose.model("Subagent", schema);
