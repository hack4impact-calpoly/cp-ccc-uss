import { NextRequest, NextResponse } from "next/server";
import connectDB from "@database/db";
import volunteerFormSchema, {
  IVolunteerForm,
} from "@database/volunteerFormSchema";
import eventSchema from "@database/eventSchema";

type IParams = {
  params: {
    _id: string;
  };
};

/**
 * GET API for retrieving a volunteerForm by its id
 * @returns None
 */
export async function GET(req: NextRequest, { params }: IParams) {
  await connectDB();
  const { _id } = params;

  try {
    const event = await volunteerFormSchema.findOne({ _id }).orFail();
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
 * PUT API for editing a volunteerForm
 * @returns None
 */
export async function PUT(req: NextRequest, { params }: IParams) {
  await connectDB();
  const { _id } = params;

  try {
    const { eventId, questions }: IVolunteerForm = await req.json();
    const volunteerForm = { eventId, questions };

    if (volunteerForm) {
      const updatedVolunteerForm = await volunteerFormSchema.findByIdAndUpdate(
        { _id },
        { new: true },
        volunteerForm
      );
      return NextResponse.json(updatedVolunteerForm, { status: 201 });
    } else {
      console.error("Invalid request body");
      return NextResponse.json("Invalid request body", { status: 400 });
    }
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

/**
 * DELETE API for deleting a volunteerForm
 * @returns None
 */
export async function DELETE(req: NextRequest, { params }: IParams) {
  await connectDB(); // function from db.ts
  const { _id } = params;

  try {
    const event = await eventSchema.findOne({ form: _id });
    if (!event) {
      return NextResponse.json(
        "Event not found - unable to delete form reference from event.",
        { status: 404 }
      );
    }
    event.form = "";
    await event.save();

    if (event.form === "") {
      const volunteerFormToDelete = await volunteerFormSchema
        .deleteOne({ _id: _id })
        .orFail();

      return NextResponse.json(volunteerFormToDelete);
    } else {
      return NextResponse.json("Unable to delete volunteerForm.1", {
        status: 404,
      });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json("Unable to delete volunteerForm2.", {
      status: 404,
    });
  }
}
