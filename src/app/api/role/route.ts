import connectDB from "@database/db";
import { NextRequest, NextResponse } from "next/server";
import { IVolunteerRole } from "@database/volunteerRoleSchema";
import VolunteerRoles from "@database/volunteerRoleSchema";
import Events from "@database/eventSchema";

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const { roleName, description, timeslots, event }: IVolunteerRole =
      await req.json();
    const eventObj = await Events.findOne({ _id: event });
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
    

    const savedVolunteerRole = await newVolunteerRole.save();
    console.log("Saved Volunteer Role:", savedVolunteerRole);

    if (!savedVolunteerRole) {
        return NextResponse.json("New Volunteer Role not created", {
          status: 404,
        });
      }
   

    try {
      await Events.findByIdAndUpdate(eventid, {
        $push: { roles: savedVolunteerRole._id.toString() },
      });
    } catch (err) {
      console.log("Error updating Event Roles. ", err);
      return NextResponse.json("Event Roles not updated", { status: 404 });
    }
    return NextResponse.json(savedVolunteerRole);
  } catch (err) {
    console.log("Error creating volunteer role: ", err);
    return NextResponse.json("New VolunteerRole not created", { status: 404 });
  }
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
