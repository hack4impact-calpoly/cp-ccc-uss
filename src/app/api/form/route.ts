import { NextRequest, NextResponse } from "next/server";
import connectDB from "@database/db";
import  {IVolunteerForm, IFormQuestion} from "@database/volunteerFormSchema";

/**
 * POST API for creating an VolunteerForm
 * @returns None
 */
export async function POST(req: NextRequest){
    await connectDB();

    try{
        const {eventId, questions} : IVolunteerForm = await req.json();
        

        if(eventId && Array.isArray(questions)){
            for(const question of questions){
                if(question.fieldType && question.question){
                    console.error("Invalid request body - Missing required fields");
                    return NextResponse.json(
                        "Invalid request body - Missing required fields",
                        { status: 400 }
                      );
                }
            }

        }
    }
}
