import { NextRequest, NextResponse } from "next/server";
import connectDB from "@database/db";
import eventSchema from "@database/eventSchema";

export async function GET(req: NextRequest) {
  await connectDB(); // function from db.ts

  try {
    const event = await eventSchema.findOne().orFail();
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
    const event = req.body;

    if (event) {
      const createdEvent = await eventSchema.create(event);
      return NextResponse.json(createdEvent, { status: 201 });
    } else {
      return NextResponse.json("Invalid request body", { status: 400 });
    }
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
