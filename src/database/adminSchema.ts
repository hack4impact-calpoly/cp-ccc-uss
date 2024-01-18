import mongoose, { Schema } from "mongoose";

export type IAdmin = {
  _id: string;
  name: string;
  email: string;
  role: string;
};

const adminSchema = new Schema<IAdmin>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true },
});

const Admins =
  mongoose.models["Admins"] || mongoose.model("Admins", adminSchema);

export default Admins;
