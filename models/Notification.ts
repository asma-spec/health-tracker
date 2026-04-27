import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  userId: string;
  type: "alerte" | "encouragement";
  message: string;
  createdAt: Date;
  read: boolean;
}

const NotificationSchema: Schema = new Schema({
  userId: { type: String, required: true },
  type: { type: String, enum: ["alerte", "encouragement"], required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

export default mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema);
