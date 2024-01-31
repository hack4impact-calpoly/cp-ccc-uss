import { NextRequest, NextResponse } from "next/server";
import connectDB from "@database/db";
import volunteerRoleSchema from "@database/volunteerRoleSchema";
import Events from "@database/eventSchema";
import VolunteerRoles from "@database/volunteerRoleSchema";

type IParams = {
  params: {
    _id: string;
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

  try {
    const event = await VolunteerRoles.findOne({ _id })
      .select("event")
      .orFail();
    console.log("EVENT: " + event);
    const eventid = event._id;

    await Events.findByIdAndUpdate(
      eventid,
      { $pull: { roles: _id } },
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

export async function PUT(req: NextRequest, { params }: IParams) {
  await connectDB();
  const { _id } = params; //destructure
  const { fieldToUpdate, value } = await req.json();
  try {
    await volunteerRoleSchema.findOne({ _id }).select(fieldToUpdate).orFail();
  } catch (err) {
    console.log(err);
    return NextResponse.json("Could not find the field to update.", {
      status: 404,
    });
  }

  try {
    const updatedVolunteerRole = await volunteerRoleSchema
      .findByIdAndUpdate(_id, { [fieldToUpdate]: value }, { new: true })
      .orFail();
    return NextResponse.json(updatedVolunteerRole);
  } catch (err) {
    console.log(err);
    return NextResponse.json("Could not update the Volunteer Role.", {
      status: 500,
    });
  }
}
