import mongoose from "mongoose";

// Deposit/withdrawal/transfer records.
const TransactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["deposit", "withdrawal", "transfer"],
      required: true,
    },
    asset: { type: String, required: true },
    amount: { type: Number, required: true },
    fee: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    note: { type: String, default: "" },
    reference: { type: String, default: "" },
    txHash: { type: String, default: "" },
    network: { type: String, default: "" },
    address: { type: String, default: "" },
  },
  { timestamps: true }
);

TransactionSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
  },
});

const Transaction = mongoose.model("Transaction", TransactionSchema);

export default Transaction; 

