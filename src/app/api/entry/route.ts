import { NextRequest, NextResponse } from "next/server";
import connectDB from "@database/db";
import entrySchema, { IFormAnswer, IVolunteerEntry } from "@database/volunteerEntrySchema";

// GET all events
export async function GET(req: NextRequest) {
  await connectDB(); // function from db.ts

  try {
    const entry = await entrySchema.find().orFail();
    return NextResponse.json(entry);
  } catch (err) {
    return NextResponse.json("No volunteer entries found.", { status: 404 });
  }
}



/**
 * POST API for creating an Event
 * @returns None
 */
export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const { eventId, roles, volunteerId, responses }: IVolunteerEntry =
      await req.json();
    
    if (!eventId || !roles || !volunteerId || !responses) {
        console.error("Invalid request body - Missing required fields");
        return NextResponse.json(
            "Invalid request body - Missing required fields",
            { status: 400 }
        );
    }

    const entry = { eventId, roles, volunteerId, responses };

    try {
      const createdEntry = await entrySchema.create(entry);
      return NextResponse.json(createdEntry, { status: 201 });
    } catch (error) {
      console.error("Error creating event:", error);
      return NextResponse.json("Internal Server Error", { status: 500 });
    }
  } catch (error) {
    console.error("Error parsing request body:", error);
    return NextResponse.json("Invalid request body - Malformed JSON", {
      status: 400,
    });
  }
}
