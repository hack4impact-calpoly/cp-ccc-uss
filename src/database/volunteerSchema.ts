import mongoose, { Schema } from "mongoose";

export type IVolunteer = {
  _id: string;
  name: string;
  email: string;
  languages?: string[];
  roles: string[];
};

const volunteerSchema = new Schema<IVolunteer>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  languages: { type: [String], required: false, default: [] },
  roles: [ { type: String, ref: "VolunteerRoles" } ],
});

const Volunteers =
  mongoose.models["Volunteers"] ||
  mongoose.model("Volunteers", volunteerSchema, "Volunteers");

export default Volunteers;
