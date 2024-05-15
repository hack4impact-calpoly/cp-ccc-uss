import { NextRequest, NextResponse } from "next/server";
import connectDB from "@database/db";
import VolunteerEntries from "@database/volunteerEntrySchema";
import Volunteers from "@database/volunteerSchema";
import VolunteerRoles from "@database/volunteerRoleSchema";

type IParams = {
  params: {
    _id: string;
  };
};

// GET all volunteer entries for a specific event with expanded volunteer and role data
export async function GET(req: NextRequest, { params }: IParams) {
  await connectDB();
  const { _id } = params;

  try {
    const volunteerEntries = await VolunteerEntries.find({ eventId: _id });
    const expandedEntries = [];

    for (let i = 0; i < volunteerEntries.length; i++) {
      const currentEntry = volunteerEntries[i];
      const expandedVolunteer = await Volunteers.findById(currentEntry.volunteerId, {
        _id: 1,
        name: 1,
        email: 1,
        languages: 1,
        active: 1,
      }).lean()

      const expandedRoles = await VolunteerRoles.find({ _id: { $in: currentEntry.roles } }, {
        _id: 1,
        roleName: 1,
        description: 1,
        timeslots: 1,
      }).lean();

      expandedEntries.push({
        _id: currentEntry._id,
        eventId: currentEntry.eventId,
        roles: expandedRoles ?? [],
        volunteer: expandedVolunteer ?? null,
        responses: currentEntry.responses,
      });
    }

    return NextResponse.json(expandedEntries);
  } catch (err) {
    return NextResponse.json({ message: "Error getting expanded entries:", error: err }, { status: 404 });
  }
}
