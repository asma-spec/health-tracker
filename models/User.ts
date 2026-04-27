import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;

  // 🔥 Données personnelles
  age?: number;
  sex?: string;
  height?: number;
  weight?: number;
  bmi?: number; // calculé automatiquement
  bmiMessage?: string;
  image?: string;

  // 🔥 Objectifs
  targetWeight?: number;
  sleep?: number;
  activity?: number;

  profileCompleted: boolean;
  createdAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },

    // 🔥 Données personnelles
    age: Number,
    sex: String,
    height: Number,
    weight: Number,
    bmi: Number,
    bmiMessage: String,
    image: String,

    // 🔥 Objectifs
    targetWeight: Number,
    sleep: Number,
    activity: Number,

    profileCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// 🔥 Middleware pour calculer BMI avant sauvegarde
UserSchema.pre("save", function (next) {
  const user = this as IUser;

  if (user.height && user.weight) {
    const heightInMeters = user.height / 100;
    user.bmi = parseFloat((user.weight / (heightInMeters ** 2)).toFixed(1));

    if (user.age) {
      if (user.bmi < 18.5) user.bmiMessage = "Votre BMI est faible pour votre âge. Vous êtes mince.";
      else if (user.bmi >= 18.5 && user.bmi < 25) user.bmiMessage = "Votre BMI est harmonique pour votre âge. Poids normal.";
      else if (user.bmi >= 25 && user.bmi < 30) user.bmiMessage = "Votre BMI est élevé pour votre âge. Surpoids.";
      else user.bmiMessage = "Votre BMI est très élevé pour votre âge. Obésité.";
    }
  }

  next();
});

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
