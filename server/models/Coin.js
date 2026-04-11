import mongoose from "mongoose";

// Coin catalog entries (e.g., TrusonCoin).
const CoinSchema = new mongoose.Schema(
  {
    symbol: { type: String, required: true, unique: true, uppercase: true },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    decimals: { type: Number, default: 2 },
    priceUsd: { type: Number, default: 0 },
    change24h: { type: Number, default: 0 },
    volume24h: { type: Number, default: 0 },
    totalSupply: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

CoinSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
  },
});

const Coin = mongoose.model("Coin", CoinSchema);

export default Coin;
