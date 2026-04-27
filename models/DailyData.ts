import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDailyData extends Document {
  userId: Schema.Types.ObjectId;
  weight: number;
  bloodPressure: string;
  heartRate: number;
  sleep: number;
  activity: number;
  description: string;
  date: Date;
}

const DailyDataSchema: Schema<IDailyData> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    weight: Number,
    bloodPressure: String,
    heartRate: Number,
    sleep: Number,
    activity: Number,
    description: String,

    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const DailyData: Model<IDailyData> =
  mongoose.models.DailyData || mongoose.model<IDailyData>("DailyData", DailyDataSchema);
