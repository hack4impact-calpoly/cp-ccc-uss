import connectDB from "@database/db";
import { NextRequest, NextResponse } from "next/server";
import volunteerSchema, { IVolunteer } from "@database/volunteerSchema";

// POST: create a Volunteer
export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const { name, email, languages, roles, entries }: IVolunteer =
      await req.json(); // collect volunteer data from req

    if (!name || !email || !languages || !roles || !entries) {
      console.error("Invalid request body - Missing required fields");
      return NextResponse.json(
        "Invalid request body - Missing required fields",
        { status: 400 }
      );
    }
    const volunteer = { name, email, languages, roles, entries };

    try {
      const createdVolunteer = await volunteerSchema.create(volunteer); // try to create volunteer in database
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
