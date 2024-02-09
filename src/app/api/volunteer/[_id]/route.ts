import { NextRequest, NextResponse } from "next/server";
import connectDB from "@database/db";
import Volunteers from "@database/volunteerSchema";

type IParams = {
  params: {
    _id: string;
  };
};

// Retrieve one specific Volunteer
export async function GET(req: NextRequest, { params }: IParams) {
  await connectDB();
  const id = params._id; // get volunteer ID to find

  try {
    const volunteer = await Volunteers.findById(id).orFail(); // query for volunteer with given ID
    return NextResponse.json(volunteer);
  } catch (err) {
    return NextResponse.json("Could not find Volunteer", { status: 404 });
  }
}

// Edit a Volunteer
