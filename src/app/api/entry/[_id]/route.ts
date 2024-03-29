import { NextRequest, NextResponse } from "next/server";
import connectDB from "@database/db";
import entrySchema, { IVolunteerEntry } from "@database/volunteerEntrySchema";
import volunteerSchema from "@database/volunteerSchema";

type IParams = {
  params: {
    _id: string;
  };
};

/**
 * GET API for retrieving a volunteer entry by its id
 * @returns None
 */
export async function GET(req: NextRequest, { params }: IParams) {
  await connectDB();
  const { _id } = params;

  try {
    const entry = await entrySchema.findOne({ _id }).orFail();
    return NextResponse.json(entry, { status: 201 });
  } catch (err: any) {
    console.error("Error", err);

    if (err.name === "DocumentNotFoundError") {
      return NextResponse.json("No volunteer entry found.", { status: 404 });
    }

    return NextResponse.json({ err: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * PUT API for editing a volunteer entry
 * @returns None
 */
export async function PUT(req: NextRequest, { params }: IParams) {
  await connectDB();
  const { _id } = params;

  try {
    const { eventId, roles, volunteerId, responses }: IVolunteerEntry =
      await req.json();
    const entry = { eventId, roles, volunteerId, responses };

    if (entry) {
      const updatedEntry = await entrySchema.findByIdAndUpdate({ _id }, entry);
      return NextResponse.json(updatedEntry, { status: 201 });
    } else {
      console.error("Invalid request body");
      return NextResponse.json("Invalid request body", { status: 400 });
    }
  } catch (error) {
    console.error("Error creating volunteer entry:", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

// delete

export async function DELETE(req: NextRequest, { params }: IParams) {
  await connectDB(); // function from db.ts
  const { _id } = params;
  try {
    const entry = await entrySchema.findOne({ _id: _id }).orFail(); 
    const volID = entry.volunteerId;

    await volunteerSchema.findByIdAndUpdate(
      volID,
      { $pull: { entries: _id } }, //removes entry from volunteer.entries array
      { new: true }
    ).orFail();
    
    const entryToDelete = await entrySchema.findOneAndDelete({ _id: _id }).orFail(); 
    if (!entryToDelete) {
      return NextResponse.json("Could not find the Volunteer Entry.", {
        status: 404,
      });
    }
    return NextResponse.json(entryToDelete);
  } catch (err) {
    console.log(err);
    return NextResponse.json("Unable to delete volunteer entry.", { status: 404 });
  }
}
