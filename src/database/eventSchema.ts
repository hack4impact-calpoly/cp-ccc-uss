import mongoose, { Schema } from "mongoose";
import { IVolunteer } from "./volunteerSchema";
import { IVolunteerRole } from "./volunteerRoleSchema";

export type IEvent = {
  _id: string;
  name: string;
  date: Date;
  roles: IVolunteerRole[];
  description: string;
  location: string;
};

const eventSchema = new Schema<IEvent>({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  roles: [
    {
      type: Schema.Types.ObjectId,
      ref: "VolunteerRoles",
    },
  ],
  description: { type: String, required: true },
  location: { type: String, required: true },
});

const Events =
  mongoose.models["Events"] || mongoose.model("Events", eventSchema);

export default Events;
