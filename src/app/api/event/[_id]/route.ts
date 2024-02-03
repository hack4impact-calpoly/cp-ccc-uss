import { NextRequest, NextResponse } from "next/server";
import connectDB from "@database/db";
import eventSchema, { IEvent } from "@database/eventSchema";
import VolunteerForms from '@database/volunteerFormSchema'
import VolunteerRoles from '@database/volunteerRoleSchema' 

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
    const { name, date, description, location }: IEvent = await req.json();
    const event = { name, date, description, location };

    if (event) {
      const updatedEvent = await eventSchema.findByIdAndUpdate({ _id }, event);
      return NextResponse.json(updatedEvent, { status: 201 });
    } else {
      return NextResponse.json("Invalid request body", { status: 400 });
    }
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

// delete

export async function DELETE(req: NextRequest, { params }: IParams) {
  await connectDB() // function from db.ts
  const { _id } = params 

   try {
    const events = await eventSchema.findOne({_id: _id}).orFail()	// finding whole event document
    const eventFormID = events.form		// getting form id from event 
    const eventRolesArray = events.roles	// getting array of roles from event
    console.log("Array: " + eventRolesArray)	// print array for testing purposes

    await VolunteerForms.findByIdAndDelete(eventFormID)	// using event form ID from event to find the form and delete it

    for(let i = 0; i<eventRolesArray.length; i++)[		// iterate through array of roles and delete using id in array
      await VolunteerRoles.findByIdAndDelete(eventRolesArray[i])
    ]

        const eventToDelete = await eventSchema.deleteOne({_id: _id}).orFail()	// delete entire event
    
        return NextResponse.json(eventToDelete)
    
    } catch (err) {
    console.log(err);
        return NextResponse.json('Unable to delete event.', { status: 404 })
    }
}
