import { NextRequest, NextResponse } from "next/server";
import connectDB from "@database/db";
import eventSchema from "@database/volunteerRoleSchema";

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
