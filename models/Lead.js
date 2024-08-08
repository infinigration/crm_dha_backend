import mongoose, { Mongoose } from "mongoose";
import validator from "validator";

const schema = new mongoose.Schema({
  client: {
    name: {
      type: String,
      requried: true,
    },

    phone: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      default: "temp_email",
      required: true,
    },

    passport: {
      type: String,
    },

    city: {
      type: String,
      required: true,
    },

    campaign: {
      type: String,
      required: true,
    },
    cnic: {
      type: String,
      default: "",
    },

    dob: {
      type: Date,
      default: "",
    },

    avatar: {
      public_id: {
        type: String,
        required: true,
      },

      url: {
        type: String,
        required: true,
      },
    },

    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
    },
  },

  status: {
    type: String,
    required: true,
  },

  delayed: {
    type: Number,
    required: true,
    default: 0,
  },

  source: {
    type: String,
    required: true,
  },

  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  documents: [
    {
      title: { type: String, required: true },
      createdAt: { type: Date, default: new Date(Date.now()) },
      file: {
        public_id: {
          type: String,
          required: true,
          default: "temp_id",
        },

        url: {
          type: String,
          required: true,
          default: "temp_url",
        },
      },

      status: {
        type: String,
        required: true,
        default: "Under Review",
      },
    },
  ],

  taskSummary: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],

  remarks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Remark",
    },
  ],
  createdAt: {
    type: Date,
    default: new Date(Date.now()),
  },
});

export const Lead = mongoose.model("Lead", schema);
