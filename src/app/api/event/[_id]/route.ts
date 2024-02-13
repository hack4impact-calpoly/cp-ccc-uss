import { NextRequest, NextResponse } from "next/server";
import connectDB from "@database/db";
import eventSchema, { IEvent } from "@database/eventSchema";
<<<<<<< HEAD
=======
import VolunteerForms from "@database/volunteerFormSchema";
import VolunteerRoles from "@database/volunteerRoleSchema";
>>>>>>> 29f0445de9630471aebcd55f1b63039017bf61e4

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
    const event = await eventSchema.findOne({ _id }).orFail();
    return NextResponse.json(event, { status: 201 });
  } catch (err: any) {
    console.error("Error", err);

    if (err.name === "DocumentNotFoundError") {
      return NextResponse.json("No event found.", { status: 404 });
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
    const { name, date, roles, description, location, form }: IEvent =
      await req.json();
    const event = { name, date, roles, description, location, form };

    if (event) {
      const updatedEvent = await eventSchema.findByIdAndUpdate({ _id }, event);
      return NextResponse.json(updatedEvent, { status: 201 });
    } else {
      console.error("Invalid request body");
      return NextResponse.json("Invalid request body", { status: 400 });
    }
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
<<<<<<< HEAD
=======

// delete

export async function DELETE(req: NextRequest, { params }: IParams) {
  await connectDB(); // function from db.ts
  const { _id } = params;

  try {
    const events = await eventSchema.findOne({ _id: _id }).orFail(); 
    const eventFormID = events.form; 
    const eventRolesArray = events.roles; 
    console.log("Array: " + eventRolesArray); 

    await VolunteerForms.findByIdAndDelete(eventFormID); 

    for (let i = 0; i < eventRolesArray.length; i++)
      [
        
        await VolunteerRoles.findByIdAndDelete(eventRolesArray[i]),
      ];

    const eventToDelete = await eventSchema.deleteOne({ _id: _id }).orFail(); 

    return NextResponse.json(eventToDelete);
  } catch (err) {
    console.log(err);
    return NextResponse.json("Unable to delete event.", { status: 404 });
  }
}
>>>>>>> 29f0445de9630471aebcd55f1b63039017bf61e4
