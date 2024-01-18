import mongoose, { Schema } from "mongoose";
import { IEvent } from "./eventSchema";
import { IVolunteer } from "./volunteerSchema";

export type VolunteerRoleTimeslot = {
  startTime: Date;
  endTime: Date;
};

export type IVolunteerRole = {
  _id: string;
  roleName: string;
  description: string;
  date: Date;
  timeSlot: VolunteerRoleTimeslot;
  event: IEvent;
  volunteer?: IVolunteer;
};

const volunteerRoleSchema = new Schema<IVolunteerRole>({
  roleName: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  timeSlot: {
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
  },
  event: { type: Schema.Types.ObjectId, ref: "Events", required: true },
  volunteer: {
    type: Schema.Types.ObjectId,
    ref: "Volunteers",
    required: false,
  },
});

const VolunteerRoles =
  mongoose.models["VolunteerRoles"] ||
  mongoose.model("VolunteerRoles", volunteerRoleSchema);

export default VolunteerRoles;
