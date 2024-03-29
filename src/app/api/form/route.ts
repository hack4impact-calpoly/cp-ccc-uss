import { NextRequest, NextResponse } from "next/server";
import connectDB from "@database/db";
import volunteerFormSchema, {
  IVolunteerForm,
  IFormQuestion,
} from "@database/volunteerFormSchema";

/**
 * POST API for creating an VolunteerForm
 * @returns None
 */
export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const { eventId, questions }: IVolunteerForm = await req.json();
    if (eventId && Array.isArray(questions)) {
      for (const question of questions) {
        if (
          !question.question ||
          !question.fieldType ||
          ((question.fieldType === "MULTI_SELECT" ||
            question.fieldType === "MULTI_CHOICE") &&
            !question.options)
        ) {
          console.error("Invalid request body - Missing required fields");
          return NextResponse.json(
            "Invalid request body - Missing required fields",
            { status: 400 }
          );
        }
        if (Array.isArray(question.options)) {
          for (const option of question.options) {
            if (typeof option != "string") {
              console.error(
                "Invalid request body - Incorrect type for options"
              );
              return NextResponse.json(
                "Invalid request body - Incorrect type for options",
                { status: 400 }
              );
            }
          }
        }
      }
    }

    const volunteerForm = { eventId, questions };
    try {
      const createdVolunteerForm = await volunteerFormSchema.create(
        volunteerForm
      );
      return NextResponse.json(createdVolunteerForm, { status: 201 });
    } catch (error) {
      console.error("Error creating volunteerForm:", error);
      return NextResponse.json("Internal Server Error", { status: 500 });
    }
  } catch (error) {
    console.error("Error parsing request body:", error);
    return NextResponse.json("Invalid request body - Malformed JSON", {
      status: 400,
    });
  }
}

/**
 * GET API for retrieving all volunteerForms in database
 * @returns None
 */
export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const volunteerForms = await volunteerFormSchema.find().orFail();
    return NextResponse.json(volunteerForms);
  } catch (err) {
    return NextResponse.json("No volunteerForm found.", { status: 404 });
  }
}
