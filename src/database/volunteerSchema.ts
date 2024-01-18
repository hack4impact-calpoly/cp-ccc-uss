import mongoose, { Schema } from "mongoose";
import { IVolunteerRole } from "./volunteerRoleSchema";

export type IVolunteer = {
  _id: string;
  name: string;
  email: string;
  roles: IVolunteerRole[];
};

const volunteerSchema = new Schema<IVolunteer>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  roles: [
    {
      type: Schema.Types.ObjectId,
      ref: "VolunteerRoles",
    },
  ],
});

const Volunteers =
  mongoose.models["Volunteers"] ||
  mongoose.model("Volunteers", volunteerSchema);

export default Volunteers;
