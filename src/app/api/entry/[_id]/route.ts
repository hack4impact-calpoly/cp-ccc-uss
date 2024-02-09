import { NextRequest, NextResponse } from "next/server";
import connectDB from "@database/db";
import entrySchema, { IVolunteerEntry } from "@database/volunteerEntrySchema";
import VolunteerForms from "@database/volunteerFormSchema";
import VolunteerRoles from "@database/volunteerRoleSchema";

type IParams = {
  params: {
    _id: string;
  };
};

/**
 * GET API for retrieving an event by its id
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
 * PUT API for editing an event
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
    console.error("Error creating event:", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

// delete

export async function DELETE(req: NextRequest, { params }: IParams) {
  await connectDB(); // function from db.ts
  const { _id } = params;
  try {
    const entryToDelete = await entrySchema.deleteOne({ _id: _id }).orFail(); 
    return NextResponse.json(entryToDelete);
  } catch (err) {
    console.log(err);
    return NextResponse.json("Unable to delete event.", { status: 404 });
  }
}
