import mongoose, { Schema } from "mongoose";

export type IFormAnswer = {
  question: string;
  answer: string;
};

export type IVolunteerEntry = {
  eventId: string;
  signedUpRoles: string[];
  volunteerId: string;
  answers: IFormAnswer[];
};

const formAnswerSchema = new Schema<IFormAnswer>({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

const volunteerEntrySchema = new Schema<IVolunteerEntry>({
  eventId: { type: String, ref: "Events", required: true },
  signedUpRoles: [ { type: String, ref: "VolunteerRoles"} ],
  volunteerId: { type: String, ref: "Volunteers", required: true },
  answers: [formAnswerSchema],
});

const VolunteerEntries =
  mongoose.models["VolunteerEntries"] ||
  mongoose.model("VolunteerEntries", volunteerEntrySchema);

export default VolunteerEntries;
