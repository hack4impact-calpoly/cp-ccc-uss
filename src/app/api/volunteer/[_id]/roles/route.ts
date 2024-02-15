import { NextRequest, NextResponse } from "next/server";
import Volunteers, { IVolunteer } from "@database/volunteerSchema";
import VolunteerRoles from "@database/volunteerRoleSchema";
import connectDB from "@database/db";

type IParams = {
  params: {
    _id: string;
  };
};

// Retrieve all of one Volunteer's VolunteerRoles
export async function GET(req: NextRequest, { params }: IParams) {
  await connectDB();

  const id = params._id; // get volunteer ID to find
  try {
    const volunteer: IVolunteer = await Volunteers.findById(id).orFail(); // query for specific volunteer
    const roles = volunteer.roles; // retrieve list of role IDs from volunteer
    let rolesList = [];
    for (let i = 0; i < roles.length; i++) {
      const role = await VolunteerRoles.findById(roles[i]).orFail(); // query for each role by ID
      if (role) {
        rolesList.push(role); // for each role found, add to list of roles
      }
    }

    return NextResponse.json(rolesList);
  } catch (err) {
    console.error(err);
    return NextResponse.json("No volunteer roles found.", { status: 404 });
  }
}
