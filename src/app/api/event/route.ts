import { NextRequest, NextResponse } from "next/server";
import connectDB from "@database/db";
import eventSchema, { IEvent } from "@database/eventSchema";

// GET all events
export async function GET(req: NextRequest) {
  await connectDB(); // function from db.ts

  try {
    const event = await eventSchema.find().orFail();
    return NextResponse.json(event);
  } catch (err) {
    return NextResponse.json("No event found.", { status: 404 });
  }
}

/**
 * POST API for creating an Event
 * @returns None
 */
export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const { name, date, roles, description, location, form }: IEvent =
      await req.json();

    if (!name || !date || !roles || !description || !location || !form) {
      console.error("Invalid request body - Missing required fields");
      return NextResponse.json(
        "Invalid request body - Missing required fields",
        { status: 400 }
      );
    }

    const event = { name, date, roles, description, location, form };

    try {
      const createdEvent = await eventSchema.create(event);
      return NextResponse.json(createdEvent, { status: 201 });
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
