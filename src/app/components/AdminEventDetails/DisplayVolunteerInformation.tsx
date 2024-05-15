import React, { useState, useEffect } from "react";
import type {
  IVolunteerEntry,
  IFormAnswer,
} from "../../../database/volunteerEntrySchema";
import type { IVolunteer } from "../../../database/volunteerSchema";
import type {
  IVolunteerRole,
  IVolunteerRoleTimeslot,
} from "../../../database/volunteerRoleSchema";
import style from "./AdminEventDetails.module.css";

type Props = {
  name: string;
  roles: IVolunteerRole[];
  responses: IFormAnswer[];
};

export default function VolunteerDetails({ name, roles, responses }: Props) {
  function parseDate(date: Date) {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }
  console.log(name);
  console.log(roles);
  console.log(responses);
  return (
    <div>
      <h2>{name}</h2>
      {roles.map((role, Index) => (
        <div key={Index}>
          <h3>
            {role.roleName} -
            <div className={style.openTime}>
              {role.timeslots.map((timeslot, subIndex) => (
                <span key={subIndex}>
                  {parseDate(timeslot.startTime)} -{" "}
                  {parseDate(timeslot.endTime)}
                </span>
              ))}
            </div>
          </h3>
          {responses.map((response: IFormAnswer, Index2) => (
            <div key={Index2}>
              <p>{response.question}</p>
              <p>{response.answer}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
