import { NextRequest, NextResponse } from "next/server";
import connectDB from "@database/db";
import VolunteerEntries from "@database/volunteerEntrySchema";
import Volunteers from "@database/volunteerSchema";
import VolunteerRoles from "@database/volunteerRoleSchema";
import eventSchema from "@database/eventSchema";

type IParams = {
  params: {
    _id: string;
  };
};


// GET all volunteer entries for a specific event with expanded volunteer and role data

export async function GET(req: NextRequest, { params }: IParams) {

}