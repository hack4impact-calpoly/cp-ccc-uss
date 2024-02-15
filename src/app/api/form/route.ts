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
    console.log(eventId, questions);
    if (eventId && Array.isArray(questions)) {
      for (const question of questions) {
        if (!question.question || !question.fieldType) {
          console.error("Invalid request body - Missing required fields");
          return NextResponse.json(
            "Invalid request body - Missing required fields",
            { status: 400 }
          );
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
    }
  } catch (error) {
    console.error("Error parsing request body:", error);
    return NextResponse.json("Invalid request body - Malformed JSON", {
      status: 400,
    });
  }
}
