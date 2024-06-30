import { NextRequest, NextResponse } from "next/server";
import connectDB from "@database/db";
import eventSchema, { IEvent } from "@database/eventSchema";
import VolunteerForms from "@database/volunteerFormSchema";
import VolunteerRoles from "@database/volunteerRoleSchema";
import VolunteerEntries, { IVolunteerEntry } from "@database/volunteerEntrySchema";
import Volunteers, { IVolunteer } from "@database/volunteerSchema";

type IParams = {
  params: {
    _id: string;
  };
};

/**
 * GET API for retrieving an event by its id
 * @returns None
 */
export async function GET(req: NextRequest, { params }: IParams) {
  await connectDB();
  const { _id } = params;

  try {
    const event = await eventSchema.findOne({ _id }).orFail();
    return NextResponse.json(event, { status: 201 });
  } catch (err: any) {
    console.error("Error", err);

    if (err.name === "DocumentNotFoundError") {
      return NextResponse.json("No event found.", { status: 404 });
    }

    return NextResponse.json({ err: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * PUT API for editing an event
 * @returns None
 */
export async function PUT(req: NextRequest, { params }: IParams) {
  await connectDB();
  const { _id } = params;

  try {
    const { name, date, roles, description, location, form }: IEvent =
      await req.json();
    const event = { name, date, roles, description, location, form };

    if (event) {
      const updatedEvent = await eventSchema.findByIdAndUpdate({ _id }, event, { new: true });
      return NextResponse.json(updatedEvent, { status: 200 });
    } else {
      console.error("Invalid request body");
      return NextResponse.json("Invalid request body", { status: 400 });
    }
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

// delete

export async function DELETE(req: NextRequest, { params }: IParams) {
  await connectDB(); // function from db.ts
  const { _id } = params;

  try {
    const events = await eventSchema.findOne({ _id: _id }).orFail(); 
    const eventFormID = events.form; 
    const eventRolesArray = events.roles; 

    // delete VolunteerForm
    await VolunteerForms.findByIdAndDelete(eventFormID);

    // update Volunteers with entry references
    const volunteerEntries: IVolunteerEntry[] = await VolunteerEntries.find({ eventId: _id });

    for (const entry of volunteerEntries) {
      // find volunteer who made the entry
      const volunteer = await Volunteers.findById(entry.volunteerId);

      if (volunteer) {
        volunteer.entries = volunteer.entries.filter((entryId: string) => entryId !== entry._id.toString());
        await volunteer.save();
      }
    }

    // delete entries
    await VolunteerEntries.deleteMany({ eventId: _id });

    // update Volunteers with role references & delete roles
    for (const roleId of eventRolesArray) {
      // Find Volunteers with roleId in their "roles" array
      const volunteersWithRole = await Volunteers.find({ roles: roleId });

      // Update each Volunteer to remove roleId from their "roles" array
      for (const volunteer of volunteersWithRole) {
        volunteer.roles = volunteer.roles.filter((role: string) => role !== roleId.toString());
        await volunteer.save();
      }

      // Delete the VolunteerRole document
      await VolunteerRoles.findByIdAndDelete(roleId);
    }

    // delete event
    const eventToDelete = await eventSchema.deleteOne({ _id: _id }).orFail(); 

    return NextResponse.json(eventToDelete);
  } catch (err) {
    console.log(err);
    return NextResponse.json("Unable to delete event.", { status: 404 });
  }
}
