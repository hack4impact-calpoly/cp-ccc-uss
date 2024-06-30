import { NextRequest, NextResponse } from "next/server";
import connectDB from "@database/db";
import entrySchema from "@database/volunteerEntrySchema";

type IParams = {
  params: {
    _id: string;
  };
};

// GET all Volunteer responses for a specific volunteer entry
export async function GET(req: NextRequest, { params }: IParams) {
  await connectDB();  // function from db.ts
  const { _id } = params;

  try {
    const entry = await entrySchema.findOne({ _id: _id }).orFail();

    return NextResponse.json(entry.responses);
  } catch (err) {
    return NextResponse.json("No volunteer responses found.", { status: 404 });
  }
}