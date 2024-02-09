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
export async function PUT(req: NextRequest, { params }: IParams) {
  await connectDB();

  try {
    // get Volunteer ID and structure
    const id = params._id;
    const body = req.body;
    if (body) {
      const res = await Volunteers.findByIdAndUpdate(id, body);
      return NextResponse.json(res);
    }
  } catch (err) {
    return NextResponse.json("Could not edit the volunteer", { status: 400 });
  }
}
