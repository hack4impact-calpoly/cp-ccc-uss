import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@database/db'
import eventSchema from '@database/eventSchema'

export async function GET(req: NextRequest) {
    await connectDB() // function from db.ts

	   try {
	        const event = await eventSchema.findOne().orFail()
	        return NextResponse.json(event)
	    } catch (err) {
	        return NextResponse.json('No event found.', { status: 404 })
	    }
}
