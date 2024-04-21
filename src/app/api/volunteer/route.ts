import connectDB from "@database/db";
import { NextRequest, NextResponse } from "next/server";
import Volunteers, { IVolunteer } from "@database/volunteerSchema";

// Create a Volunteer
export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const { name, email, languages, roles, entries } /*: IVolunteer*/ =
      await req.json(); // collect volunteer data from req

    if (!name || !email) {
      console.error("Invalid request body - Missing required fields");
      return NextResponse.json(
        "Invalid request body - Missing required fields",
        { status: 400 }
      );
    }
    const volunteer = { name, email, languages, roles, entries, active: true };

    try {
      const createdVolunteer = await Volunteers.create(volunteer); // try to create volunteer in database
      return NextResponse.json(createdVolunteer, { status: 201 });
    } catch (error) {
      console.error("Error creating volunteer:", error);
      return NextResponse.json("Internal server error", { status: 500 });
    }
  } catch (error) {
    console.error("Error parsing volunteer request body:", error);
    return NextResponse.json("Invalid request body - Malformed JSON", {
      status: 400,
    });
  }
}

// Retrieve all Volunteers
export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const volunteers = await Volunteers.find().orFail();
    return NextResponse.json(volunteers);
  } catch (err) {
    return NextResponse.json("No volunteers found", { status: 404 });
  }
}
