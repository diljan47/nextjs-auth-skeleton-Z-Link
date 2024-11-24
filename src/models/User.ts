import mongoose from "mongoose";

export interface IUser {
  _id?: mongoose.Schema.Types.ObjectId;
  name: string;
  email: string;
  bio?: string;
  hashedPassword?: string;
  isGoogleUser: boolean;
  isAdmin?: boolean;
  isEmailVerified?: boolean;
  emailVerificationTOTP?: string;
  passwordResetToken?: string;
  passwordResetTokenExpiresAt?: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    bio: {
      type: String,
      default: "",
    },
    hashedPassword: {
      type: String,
      required: function () {
        return !this.isGoogleUser;
      },
    },
    isGoogleUser: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationTOTP: {
      type: String,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetTokenExpiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Add index for email queries
userSchema.index({ email: 1 });

// Add index for session queries


export const User =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
