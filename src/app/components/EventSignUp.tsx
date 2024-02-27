import React, { useState, useEffect } from "react";
import type { IEvent } from "../../database/eventSchema";
import style from "@styles/EventSignUp.module.css";


type IParams = {
  id: string;
};

export default function EventSignUp({ id }: IParams) {
  const [event, setEvent] = useState<IEvent | null>(null);

  

  return (
    <div>EventSignUp</div>
  );
}