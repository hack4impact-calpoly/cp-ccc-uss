import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@database/db';
import volunteerRoleSchema from '@database/volunteerRoleSchema';

type IParams = {
		params: {
			id: string
		}
}

export async function GET(req: NextRequest, { params }: IParams) {
    await connectDB()
		const { id } = params //destructure

	   try {
	        const volunteerRole = await volunteerRoleSchema.findOne({ id }).orFail()
	        return NextResponse.json(volunteerRole)
	    } catch (err) {
	        return NextResponse.json('Could not find the Volunteer Role.', { status: 404 })
	    }
}