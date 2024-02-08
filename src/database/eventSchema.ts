import mongoose, { Schema } from "mongoose";

export type IEvent = {
  _id: string;
  name: string;
  date: Date;
  roles: string[];
  description: string;
  location: string;
  form: string;
};

const eventSchema = new Schema<IEvent>({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  roles: [{ type: String, ref: "VolunteerRoles" }],
  description: { type: String, required: true },
  location: { type: String, required: true },
  form: { type: String, ref: "VolunteerForms" },
});
 
const Events =
  mongoose.models["Events"] || mongoose.model("Events", eventSchema, "Events");

export default Events;
