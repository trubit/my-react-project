import mongoose from "mongoose";

// Core user profile and auth fields.
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: "" },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true, select: false },
    resetPasswordTokenHash: { type: String, default: "", select: false },
    resetPasswordExpires: { type: Date },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    phone: { type: String, default: "" },
    referralId: { type: String, default: "" },
    status: { type: String, enum: ["active", "suspended"], default: "active" },
    kycStatus: {
      type: String,
      enum: ["unverified", "pending", "approved", "rejected"],
      default: "unverified",
    },
  },
  { timestamps: true }
);

UserSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.passwordHash;
  },
});

const User = mongoose.model("User", UserSchema);

export default User; 

