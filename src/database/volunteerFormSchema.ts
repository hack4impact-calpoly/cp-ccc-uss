import mongoose, { Schema } from "mongoose";

export type IFormQuestion = {
  question: string;
  fieldType: string; // SHORT_ANSWER or MULTI_SELECT
  options?: string[]; // MULTI_SELECT type options
};

export type IVolunteerForm = {
  eventId: string;
  questions: IFormQuestion[];
};

const formQuestionSchema = new Schema<IFormQuestion>({
  question: { type: String, required: true },
  fieldType: { type: String, required: true },
  options: [{ type: String }],
});

const volunteerFormSchema = new Schema<IVolunteerForm>({
  eventId: { type: String, ref: "Events", required: true },
  questions: [formQuestionSchema],
});

const VolunteerForms =
  mongoose.models["VolunteerForms"] ||
  mongoose.model("VolunteerForms", volunteerFormSchema);

export default VolunteerForms;
