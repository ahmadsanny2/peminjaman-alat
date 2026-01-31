import mongoose from "mongoose";

const loanSchema = new mongoose.Schema(
  {
    borrower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    officer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    tool: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tool",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "returned", "overdue"],
      default: "pending",
    },
    borrowDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    expectedReturnDate: {
      type: Date,
      required: true,
    },
    actualReturnDate: {
      type: Date,
      default: null,
    },

    returnCondition: {
      type: String,
      default: "good",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Loan", loanSchema);
