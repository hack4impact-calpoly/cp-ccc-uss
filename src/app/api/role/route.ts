import connectDB from "@database/db";
import { NextRequest, NextResponse } from "next/server";
import { IVolunteerRole } from "@database/volunteerRoleSchema";
import VolunteerRoles from "@database/volunteerRoleSchema";
import Events from "@database/eventSchema";
// Create a VolunteerRole (../api/role) POST *get the associated eventid from the request body, update event object w/ roleid
// Get all VolunteerRoles (../api/role) GET

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const { roleName, description, timeslots, event }: IVolunteerRole =
      await req.json();

    const eventObj = await Events.findOne({ name: event });

    if (!eventObj) {
      return NextResponse.json("Event not found.", { status: 404 });
    }
    const eventid = eventObj._id;

    const newVolunteerRole = new VolunteerRoles({
      roleName,
      description,
      timeslots,
      event,
    });
    if (!newVolunteerRole) {
      return NextResponse.json("New Volunteer Role not created", {
        status: 404,
      });
    }

    const savedVolunteerRole = await newVolunteerRole.save();
    try {
      await Events.findByIdAndUpdate(eventid, {
        $push: { roles: savedVolunteerRole._id },
      });
    } catch (err) {
      console.log("Error updating Event Roles. ", err);
      return NextResponse.json("Event Roles not updated", { status: 404 });
    }
  } catch (err) {
    console.log("Error creating volunteer role: ", err);
    return NextResponse.json("New VolunteerRole not created", { status: 404 });
  }
  return NextResponse.json("New VolunteerRole successfully created.");
}

export async function GET() {
  await connectDB();
  try {
    const volunteerRoles = await VolunteerRoles.find();
    return NextResponse.json(volunteerRoles);
  } catch (err) {
    console.error("Error getting volunteer roles: ", err);
    return NextResponse.json("Volunteer Roles not retrieved.", {
      status: 404,
    });
  }
}
