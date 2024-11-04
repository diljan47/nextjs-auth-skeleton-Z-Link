import mongoose from "mongoose";

export interface ISession {
    _id?: mongoose.Schema.Types.ObjectId;
    userId: mongoose.Schema.Types.ObjectId;
    sessionToken: string;
    expiresAt: Date;
}

const sessionSchema = new mongoose.Schema<ISession>({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    sessionToken:{
      type:String,
      required:true
    },
    expiresAt: {
      type: Date,
      required: true
    }
  });
sessionSchema.index({ userId: 1 });

export const Session = mongoose.models.Session || mongoose.model<ISession>('Session', sessionSchema);
export default Session;
