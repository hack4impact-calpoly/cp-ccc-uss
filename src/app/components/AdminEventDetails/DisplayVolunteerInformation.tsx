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
  role: IVolunteerRole;
  timeslot: IVolunteerRoleTimeslot;
  responses: IFormAnswer[];
};

export default function VolunteerDetails({
  name,
  role,
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
      <h3>{role.roleName} - </h3>
      <div className={style.openTime}>
        {parseDate(timeslot.startTime)} - {parseDate(timeslot.endTime)} |
      </div>
      {responses.map((response: IFormAnswer, Index) => (
        <div key={Index}>
          <p>{response.question}</p>
          <p>{response.answer}</p>
        </div>
      ))}
    </div>
  );
}
