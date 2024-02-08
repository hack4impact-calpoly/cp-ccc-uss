import mongoose, { Schema } from "mongoose";

export type IFormAnswer = {
  question: string;
  answer: string;
};

export type IVolunteerEntry = {
  eventId: string;
  roles: string[];
  volunteerId: string;
  responses: IFormAnswer[];
};

const formResponseSchema = new Schema<IFormAnswer>({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

const volunteerEntrySchema = new Schema<IVolunteerEntry>({
  eventId: { type: String, ref: "Events", required: true },
  roles: [ { type: String, ref: "VolunteerRoles"} ],
  volunteerId: { type: String, ref: "Volunteers", required: true },
  responses: [formResponseSchema],
});

const VolunteerEntries =
  mongoose.models["VolunteerEntries"] ||
  mongoose.model("VolunteerEntries", volunteerEntrySchema, "VolunteerEntries");

export default VolunteerEntries;
