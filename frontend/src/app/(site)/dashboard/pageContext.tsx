"use client";

import { Metric, UpdateMetric } from "src/db/metrics";

import React, { createContext, useContext, useEffect, useState } from "react";

import { getEvents, getPrimaryCalendar } from "../../../components/calendar";
import { useSupabase } from "../../../components/supabase-provider";
import Label, { InsertLabel, UpdateLabel } from "../../../db/labels/types";
import Task, { InsertTask, UpdateTask } from "../../../db/tasks/types";

type Shared = {
  tasks: Task[];
  insertTask: (task: InsertTask) => void;
  updateTask: (task: UpdateTask) => void;
  deleteTask: (id: number) => void;
  labels: Label[];
  insertLabel: (label: InsertLabel) => void;
  updateLabel: (label: UpdateLabel) => void;
  deleteLabel: (id: number) => void;
  metrics: Metric[];
  updateMetric: (metric: UpdateMetric) => void;
};

type PageProviderProps = Shared & {
  children: React.ReactNode;
};

type PageContext = Shared & {
  calendar: any;
  events: any;
  schedule: any;
  loadGcalEvents: () => void;
};

const Context = createContext<PageContext | undefined>(undefined);

export default function PageProvider({ children, ...contextProps }: PageProviderProps) {
  const { calendarToken } = useSupabase();
  const { tasks, labels } = contextProps;

  const [calendar, setCalendar] = useState(null);
  const [events, setEvents] = useState([]);
  const [schedule, setSchedule] = useState([]);

  const loadPrimaryCalendar = async (calendarToken: string) => {
    const primaryCalendar = await getPrimaryCalendar(calendarToken);
    setCalendar(primaryCalendar);
  };

  const loadGcalEvents = async (calendarToken: string) => {
    const gcalEvents = await getEvents(calendarToken);
    if (!(gcalEvents?.items?.length > 0)) return;
    setEvents(gcalEvents.items);
  };

  useEffect(() => {
    if (!calendarToken) return;
    loadPrimaryCalendar(calendarToken);
    loadGcalEvents(calendarToken);
  }, [calendarToken]);

  useEffect(() => {
    if (!tasks) return;

    const queryAlgo = async () => {
      const response = await fetch("/api/algo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tasks, labels, events }),
      });
      const data = await response.json();
      setSchedule(data.schedule);
    };

    queryAlgo();
  }, [tasks, labels, events]);

  return (
    <Context.Provider
      value={{
        ...contextProps,
        calendar,
        events,
        schedule,
        loadGcalEvents: () => loadGcalEvents(calendarToken),
      }}
    >
      {children}
    </Context.Provider>
  );
}

export const usePage = () => {
  let context = useContext(Context);
  if (context === undefined) {
    throw new Error("usePage must be used inside PageProvider");
  } else {
    return context;
  }
};
