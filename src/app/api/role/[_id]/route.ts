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
    const volunteerRole = await VolunteerRoles.findOne({ _id }).orFail();
    const eventid = volunteerRole.event; //gets event field from volunteerRole

    await Events.findByIdAndUpdate(
      eventid,
      { $pull: { roles: _id } }, //removes role from event array
      { new: true }
    );

    const deletedVolunteerRole = await volunteerRoleSchema
      .findOneAndDelete({ _id }) //deltes volunteer role
      .orFail();
    if (!deletedVolunteerRole) {
      return NextResponse.json("Could not find the Volunteer Role.", {
        status: 404,
      });
    }
    return NextResponse.json(deletedVolunteerRole); //returns deleted volunteer role
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
