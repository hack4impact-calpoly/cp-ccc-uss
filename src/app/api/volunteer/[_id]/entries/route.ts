import { NextRequest, NextResponse } from "next/server";
import connectDB from "@database/db";
import VolunteerEntries from "@database/volunteerEntrySchema";

type IParams = {
  params: {
    _id: string;
  };
};

// GET all entries for a specific volunteer, optionally filtered by an event ID
export async function GET(req: NextRequest, { params }: IParams) {
  await connectDB();
  const volunteerId = params._id;

  const url = new URL(req.url);
  const eventId = url.searchParams.get("eventId");

  try {
    const query: { volunteerId: string; eventId?: string } = { volunteerId };
    if (eventId) {
      query["eventId"] = eventId;
    }

    const entries = await VolunteerEntries.find(query).lean();

    if (entries.length > 0) {
      console.log("entries: ", entries);
      return NextResponse.json(entries);
    } else {
      return NextResponse.json([], { status: 200 });
    }
  } catch (err) {
    console.error("Error fetching entries:", err);
    return NextResponse.json(
      { message: "Error fetching entries", error: err },
      { status: 500 }
    );
  }
}
