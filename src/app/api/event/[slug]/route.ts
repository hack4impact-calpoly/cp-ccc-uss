import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@database/db'
import eventSchema from '@database/eventSchema'
import VolunteerForms from '@database/volunteerFormSchema'
import VolunteerRoles from '@database/volunteerRoleSchema' 

type IParams = {
    params: {
        slug: string
    }
}

export async function DELETE(req: NextRequest, { params }: IParams) {
    await connectDB() // function from db.ts
		const { slug } = params 

	   try {
			const events = await eventSchema.findOne({_id: slug}).orFail()	// finding whole event document
			const eventFormID = events.form		// getting form id from event 
			const eventRolesArray = events.roles	// getting array of roles from event
			console.log("Array: " + eventRolesArray)	// print array for testing purposes


			await VolunteerForms.findByIdAndDelete(eventFormID)	// using event form ID from event to find the form and delete it

			for(let i = 0; i<eventRolesArray.length; i++)[		// iterate through array of roles and delete using id in array
				await VolunteerRoles.findByIdAndDelete(eventRolesArray[i])
			]

	        const eventToDelete = await eventSchema.deleteOne({_id: slug}).orFail()	// delete entire event
			
	        return NextResponse.json(eventToDelete)
			
	    } catch (err) {
			console.log(err);
	        return NextResponse.json('Unable to delete event.', { status: 404 })
	    }
}