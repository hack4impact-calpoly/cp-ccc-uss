import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@database/db'
import volunteerRoleSchema from '@database/volunteerRoleSchema'

type IParams = {
    params: {
        slug: string
    }
}

export async function GET(req: NextRequest, { params }: IParams) {
    await connectDB() // function from db.ts
		const { slug } = params 

	   try {
	        const volunteerRoles = await volunteerRoleSchema.find().orFail()
	        return NextResponse.json(volunteerRoles)
	    } catch (err) {
	        return NextResponse.json('No volunteer roles found.', { status: 404 })
	    }
}