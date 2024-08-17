import mongoose from "mongoose";

const schema = new mongoose.Schema({
  generalInformation: [
    {
      country: {
        type: String,
        required: true,
      },

      title: {
        type: String,
        required: true,
      },

      duration: {
        type: String,
        default: 0,
        required: true,
      },

      totalCost: {
        type: String,
        default: 0,
        required: true,
      },

      advance: {
        type: String,
        default: 0,
        required: true,
      },

      workPermit: {
        type: String,
        default: 0,
        required: true,
      },

      passportRequest: {
        type: String,
        default: 0,
        required: true,
      },

      visaCost: {
        type: String,
        default: 0,
        required: true,
      },

      deduction: {
        type: String,
        default: 0,
        required: true,
      },

      province: {
        type: String,
        required: true,
      },
      processDuration: {
        type: String,
        default: 0,
        required: true,
      },
    },
  ],

  jobs: [
    {
      title: {
        type: String,
        required: true,
      },
      salary: {
        type: String,
        default: 0,
        required: true,
      },
    },
  ],

  documents: [
    {
      title: {
        type: String,
        required: true,
      },

      type: {
        type: String,
        default: "file",
        required: true,
      },

      status: {
        type: String,
        required: true,
        default: "not_uploaded",
      },

      file: {
        public_id: {
          type: String,
          default: "temp_id",
          required: true,
        },

        url: {
          type: String,
          required: true,
          default: "temp_url",
        },
      },
    },
  ],

  requirements: [
    {
      title: {
        type: String,
        required: true,
      },

      status: {
        type: String,
        required: true,
        default: "not_provided",
      },
    },
  ],

  benefits: [
    {
      title: {
        type: String,
        required: true,
      },
    },
  ],

  status: {
    type: String,
    required: true,
    default: "active",
  },

  vendors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
    },
  ],

  createdAt: {
    type: Date,
    default: new Date(Date.now()),
  },
});

export const Program = mongoose.model("Program", schema);
