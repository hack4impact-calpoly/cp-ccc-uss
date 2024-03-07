import { NextRequest, NextResponse } from "next/server";
import connectDB from "@database/db";
import VolunteerRoles from "@database/volunteerRoleSchema";
import entrySchema from "@database/volunteerEntrySchema";

type IParams = {
  params: {
    _id: string;
  };
};

// GET all VolunteerRoles for a specific volunteer entry
export async function GET(req: NextRequest, { params }: IParams) {
  await connectDB();  // function from db.ts
  const { _id } = params;

  try {
    const entry = await entrySchema.findOne({ _id: _id }).orFail();
    const volunteerRoles = entry.roles;

    const volunteerRolesArr = await VolunteerRoles.find({ _id: { $in: volunteerRoles } });

    return NextResponse.json(volunteerRolesArr);

  } catch (err) {
    return NextResponse.json("No volunteer roles found.", { status: 404 });
  }
}