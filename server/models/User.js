import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 8 },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    emailVerified: { type: Boolean, default: false },
    refreshTokens: {
      type: [
        {
          tokenHash: String,
          createdAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    emailVerificationToken: String,
    emailVerificationExpires: Date,
  },
  { timestamps: true }
);

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.addRefreshToken = async function (tokenHash) {
  if (!Array.isArray(this.refreshTokens)) {
    this.refreshTokens = [];
  }
  this.refreshTokens.push({ tokenHash });
  if (this.refreshTokens.length > 10) {
    this.refreshTokens = this.refreshTokens.slice(-10);
  }
  await this.save();
};

UserSchema.methods.removeRefreshToken = async function (tokenHash) {
  if (!Array.isArray(this.refreshTokens)) {
    this.refreshTokens = [];
    return;
  }
  this.refreshTokens = this.refreshTokens.filter(
    (t) => t.tokenHash !== tokenHash
  );
  await this.save();
};

UserSchema.methods.clearRefreshTokens = async function () {
  this.refreshTokens = [];
  await this.save();
};

const User = mongoose.model("User", UserSchema);

export default User;
