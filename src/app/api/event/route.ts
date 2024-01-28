import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@database/db'
import eventSchema from '@database/eventSchema'

type IParams = {
    params: {
        slug: string
    }
}

export async function GET(req: NextRequest, { params }: IParams) {
    await connectDB() // function from db.ts
		// const { slug } = params // another destructure

	   try {
	        const event = await eventSchema.findOne().orFail()
	        return NextResponse.json(event)
	    } catch (err) {
	        return NextResponse.json('No event found.', { status: 404 })
	    }
}