import mongoose from "mongoose";

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  accNo: {
    type: Number,
    default: 0,
    required: true,
  },

  address: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },

  stats: {
    balance: {
      type: Number,
      default: 0,
    },

    incoming: {
      type: Number,
      default: 0,
    },

    expense: {
      type: Number,
      default: 0,
    },

    profit: {
      type: Number,
      default: 0,
    },
  },
  incomings: [
    {
      date: {
        type: Date,
        default: new Date(Date.now()),
      },
      reason: {
        type: String,
      },
      contract: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contract",
      },
      amount: {
        type: Number,
        default: 0,
      },
    },
  ],
  paymentsReceived: [{}],
  expenses: [{}],
  creditNotes: [{}],
  transactions: [{}],
  paymentsMade: [{}],
});

export const Bank = mongoose.model("Bank", schema);
