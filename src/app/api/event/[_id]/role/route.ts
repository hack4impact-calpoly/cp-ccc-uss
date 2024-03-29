import { NextRequest, NextResponse } from "next/server";
import connectDB from "@database/db";
import VolunteerRoles from "@database/volunteerRoleSchema";
import eventSchema from "@database/eventSchema";

type IParams = {
  params: {
    _id: string;
  };
};

// GET all VolunteerRoles for a specific event
export async function GET(req: NextRequest, { params }: IParams) {
  await connectDB();  // function from db.ts
  const { _id } = params;

  try {
    const event = await eventSchema.findOne({ _id: _id }).orFail();
    const volunteerRolesID = event.roles;

    const volunteerRoles = [];
    for (let i = 0; i < volunteerRolesID.length; i++) {   // finding each role
      const role = await VolunteerRoles.findById(volunteerRolesID[i]);
      if (role) {
        volunteerRoles.push(role);
      }
    }

    return NextResponse.json(volunteerRoles);

  } catch (err) {
    return NextResponse.json("No volunteer roles found.", { status: 404 });
  }
}