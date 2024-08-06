import mongoose from "mongoose";

const schema = new mongoose.Schema({
  lead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lead",
  },

  program: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Program",
  },

  vendor: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
    },

    fees: {
      type: Number,
      default: 0,
    },

    currency: {
      type: String,
    },
  },

  discount: {
    type: Number,
    default: 0,
  },

  subAgent: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubAgent",
    },
    fees: {
      type: Number,
      default: 0,
    },

    currency: {
      type: String,
    },
  },

  bank: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bank",
  },

  installements: [
    {
      amount: {
        type: Number,
        required: true,
      },

      stage: {
        type: String,
        required: true,
      },

      remarks: {
        type: String,
        required: true,
      },

      status: {
        type: String,
        required: true,
        default: "Not Sent",
      },
    },
  ],

  file: {
    public_id: { type: String, required: true },
    url: { type: String, required: true },
  },

  createdAt: {
    type: Date,
    default: new Date(Date.now()),
  },
});

export const Contract = mongoose.model("Contract", schema);
