import mongoose from "mongoose";

export interface IUser {
  _id?: mongoose.Schema.Types.ObjectId;
  name: string;
  email: string;
  hashedPassword?: string;
  isGoogleUser?: boolean;
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

// Export models directly instead of as default object
export default User;