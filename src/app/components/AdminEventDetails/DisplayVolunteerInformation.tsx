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
  timeslot: IVolunteerRoleTimeslot;
  responses: IFormAnswer[];
};

export default function VolunteerDetails({
  name,
  roles,
  timeslot,
  responses,
}: Props) {
  function parseDate(date: Date) {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }
  return (
    <div>
      <h2>{name}</h2>
      {roles.map((role, Index) => (
        <div key={Index}>
          <h3>{role.roleName} - </h3>
          <div className={style.openTime}>
            {parseDate(timeslot.startTime)} - {parseDate(timeslot.endTime)} |
          </div>
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
