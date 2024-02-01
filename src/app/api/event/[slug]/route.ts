import { NextRequest, NextResponse } from "next/server";
import connectDB from "@database/db";
import eventSchema, { IEvent } from "@database/eventSchema";

type IParams = {
  params: {
    slug: string;
  };
};

/**
 * GET API for retrieving an event by its id
 * @returns None
 */
export async function GET(req: NextRequest, { params }: IParams) {
  await connectDB();
  const { slug } = params;

  try {
    const event = await eventSchema.findOne({ slug }).orFail();
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
  const { slug } = params;

  try {
    const { name, date, description, location }: IEvent = await req.json();
    const event = { name, date, description, location };

    if (event) {
      const updatedEvent = await eventSchema.findByIdAndUpdate({ slug }, event);
      return NextResponse.json(updatedEvent, { status: 201 });
    } else {
      return NextResponse.json("Invalid request body", { status: 400 });
    }
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
