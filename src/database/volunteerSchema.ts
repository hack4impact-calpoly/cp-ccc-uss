import mongoose, { Schema } from "mongoose";

export type IVolunteer = {
  _id: string;
  name: string;
  email: string;
  languages?: string[];
  roles: string[];
  entries: string[];
};

const volunteerSchema = new Schema<IVolunteer>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  languages: { type: [String], required: false, default: [] },
  roles: [{ type: String, ref: "VolunteerRoles" }],
  entries: [{ type: String, ref: "VolunteerEntries" }],
});

const Volunteers =
  mongoose.models["Volunteers"] ||
  mongoose.model("Volunteers", volunteerSchema, "Volunteers");

export default Volunteers;
