import { NextRequest, NextResponse } from "next/server";
import connectDB from "@database/db";
import volunteerFormSchema from "@database/volunteerFormSchema";

type IParams = {
  params: {
    _id: string;
  };
};

/**
 * GET API for retrieving a volunteerForm by its id
 * @returns None
 */
export async function GET(req: NextRequest, { params }: IParams) {
  await connectDB();
  const { _id } = params;

  try {
    const event = await volunteerFormSchema.findOne({ _id }).orFail();
    return NextResponse.json(event, { status: 201 });
  } catch (err: any) {
    console.error("Error", err);

    if (err.name === "DocumentNotFoundError") {
      return NextResponse.json("No event found.", { status: 404 });
    }

    return NextResponse.json({ err: "Internal Server Error" }, { status: 500 });
  }
}
