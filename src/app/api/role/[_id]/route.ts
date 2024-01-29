import { NextRequest, NextResponse } from "next/server";
import connectDB from "@database/db";
import volunteerRoleSchema from "@database/volunteerRoleSchema";
import Events from "@database/eventSchema";

type IParams = {
  params: {
    _id: string;
    event: string;
  };
};

export async function GET(req: NextRequest, { params }: IParams) {
  await connectDB();
  const { _id } = params; //destructure
  try {
    const volunteerRole = await volunteerRoleSchema.findOne({ _id }).orFail();
    return NextResponse.json(volunteerRole);
  } catch (err) {
    console.log(err);
    return NextResponse.json("Could not find the Volunteer Role.", {
      status: 404,
    });
  }
}

export async function DELETE(req: NextRequest, { params }: IParams) {
  await connectDB();
  const { _id } = params; //destructure
  const { event } = params;
  try {
    const eventObj = await Events.findOne({ _id: event });

    if (!eventObj) {
      return NextResponse.json("Event not found.", { status: 404 });
    }
    const eventid = eventObj._id;

    await Events.findByIdAndUpdate(
      eventid,
      { $pull: { roles: { _id }.toString() } },
      { new: true }
    );

    const deletedVolunteerRole = await volunteerRoleSchema
      .findOneAndDelete({ _id })
      .orFail();
    if (!deletedVolunteerRole) {
      return NextResponse.json("Could not find the Volunteer Role.", {
        status: 404,
      });
    }
    return NextResponse.json(deletedVolunteerRole);
  } catch (err) {
    console.log(err);
    return NextResponse.json("An error occurred.", { status: 500 });
  }
}

// export async function PUT(req: NextRequest, { params }: IParams) {
//   await connectDB();
//   const { _id } = params; //destructure
// }
