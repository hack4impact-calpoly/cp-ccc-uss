import { NextRequest, NextResponse } from "next/server";
import connectDB from "@database/db";
import eventSchema from "@database/eventSchema";
import Events from "@database/eventSchema";

export async function GET(req: NextRequest) {
  await connectDB(); // function from db.ts

  try {
    const events = await eventSchema.find().orFail();

    return NextResponse.json(events);
  } catch (err) {
    console.log(err);
    return NextResponse.json("No events found.", { status: 404 });
  }
}
