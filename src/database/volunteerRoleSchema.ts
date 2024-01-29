import mongoose, { Schema } from "mongoose";

export type IVolunteerRoleTimeslot = {
  startTime: Date;
  endTime: Date;
  volunteers: string[];
};

export type IVolunteerRole = {
  _id: string;
  roleName: string;
  description: string;
  timeslots: IVolunteerRoleTimeslot[];
  event: string;
};

const volunteerRoleTimeslotSchema = new Schema<IVolunteerRoleTimeslot>({
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  volunteers: [{ type: String, ref: "Volunteers" }],
});

const volunteerRoleSchema = new Schema<IVolunteerRole>({
  roleName: { type: String, required: true },
  description: { type: String, required: true },
  timeslots: [volunteerRoleTimeslotSchema],
  event: { type: String, ref: "Events", required: true },
});

const VolunteerRoles =
  mongoose.models["VolunteerRoles"] ||
  mongoose.model("VolunteerRoles", volunteerRoleSchema, "VolunteerRoles");

export default VolunteerRoles;
