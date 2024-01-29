import { NextRequest, NextResponse } from "next/server";
import connectDB from "@database/db";
import volunteerRoleSchema from "@database/volunteerRoleSchema";

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
    const volunteerRole = await volunteerRoleSchema
      .findOneAndDelete({ _id })
      .orFail();
    return NextResponse.json(volunteerRole);
  } catch (err) {
    console.log(err);
    return NextResponse.json("Could not find the Volunteer Role.", {
      status: 404,
    });
  }
}

// export async function PUT(req: NextRequest, { params }: IParams) {
//   await connectDB();
//   const { _id } = params; //destructure
// }
