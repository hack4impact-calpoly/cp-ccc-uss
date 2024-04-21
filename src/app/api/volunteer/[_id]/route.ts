import { NextRequest, NextResponse } from "next/server";
import connectDB from "@database/db";
import Volunteers, { IVolunteer } from "@database/volunteerSchema";
import VolunteerEntries, { IVolunteerEntry } from "@database/volunteerEntrySchema";

type IParams = {
  params: {
    _id: string;
  };
};

// Retrieve one specific Volunteer
export async function GET(req: NextRequest, { params }: IParams) {
  await connectDB();
  const id = params._id; // get volunteer ID to find

  try {
    const volunteer = await Volunteers.findById(id).orFail(); // query for volunteer with given ID
    return NextResponse.json(volunteer);
  } catch (err) {
    return NextResponse.json("Could not find Volunteer", { status: 404 });
  }
}

// Edit a Volunteer
export async function PUT(req: NextRequest, { params }: IParams) {
  await connectDB();

  try {
    // get Volunteer ID and structure
    const id = params._id;
    const { name, email, languages, roles, entries }: IVolunteer =
      await req.json();
    const volunteer = { name, email, languages, roles, entries };

    if (volunteer) {
      const updatedVolunteer = await Volunteers.findByIdAndUpdate(
        id,
        volunteer,
        { new: true }
      );
      return NextResponse.json(updatedVolunteer);
    } else {
      console.error("Invalid request body", { status: 200 });
      return NextResponse.json("Invalid request body", { status: 400 });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json("Could not edit the volunteer", { status: 400 });
  }
}

// Delete a volunteer
export async function DELETE(req: NextRequest, { params }: IParams) {
  await connectDB();


  const id = params._id;
  try {
    const deleted = await Volunteers.findByIdAndDelete(id);
    const entries = await VolunteerEntries.find({ volunteerId: id }).orFail(); 
    for (let i = 0; i < entries.length; i++)
      [
        await VolunteerEntries.findByIdAndDelete(entries[i]._id)
      ];
    
    

    if (deleted) {
      return NextResponse.json("Successfully deleted volunteer");
    } else {
      return NextResponse.json("Unable to delete volunteer", { status: 400 });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json("Could not delete the volunteer", { status: 400 });
  }
}
