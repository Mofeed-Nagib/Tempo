"use client";

import { createScheduleEvents } from "src/algo";
import { useSupabase } from "src/components/supabase-provider";
import { Refresh } from "tabler-icons-react";

import React, { useState } from "react";

import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { ActionIcon, Tooltip } from "@mantine/core";

import {
  addCalendarScopes,
  addGcalEvents,
  calendarColorMap,
  deleteGcalEvents,
  eventColorMap,
} from "../../../../components/calendar";
import { DEFAULT_COLOR } from "../../../../constants";
import { usePage } from "../pageContext";

const createGcalEvents = (rawEvents, calendarColor) => {
  const events = rawEvents.map((event) => {
    const eventColor = event.colorId && eventColorMap[event.colorId];
    return {
      title: event.summary,
      color: eventColor || calendarColor || "red",
      start: Date.parse(event.start.dateTime),
      end: Date.parse(event.end.dateTime),
    };
  });

  return events;
};

const createDeadlineEvents = (tasks, labels) => {
  const deadlineEvents = [];

  tasks.map((task) => {
    const label = labels.find((label) => label?.id === task?.label);
    deadlineEvents.push({
      title: task.title,
      allDay: true,
      color: label?.color ?? DEFAULT_COLOR,
      start: task.end_date,
      end: task.end_date,
    });
  });

  return deadlineEvents;
};

const FullCalendarApp = () => {
  // const { calendarToken, tokenExpiry, getNewToken, setCalendarToken } = useSupabase();
  const { supabase, session, calendarToken } = useSupabase();
  const { tasks, labels, calendar, events, schedule, loadGcalEvents } = usePage();

  const calendarColor = calendarColorMap[calendar?.colorId] || DEFAULT_COLOR;

  const gcalEvents = createGcalEvents(events, calendarColor);
  const deadlineEvents = createDeadlineEvents(tasks, labels);
  const scheduleEvents = createScheduleEvents(tasks, labels, schedule);
  const [loading, setLoading] = useState(false);

  const updateGcal = async () => {
    if (loading == true) return;
    if (calendarToken) {
      setLoading(true);
      await deleteGcalEvents(calendarToken);
      await addGcalEvents(calendarToken, scheduleEvents);
      await loadGcalEvents();
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col">
      {!calendarToken && (
        <div className="w-full flex items-center justify-center bg-gray-100 mx-2 mb-8 p-2 rounded-lg">
          <div
            onClick={() => addCalendarScopes(supabase, session)}
            className="cursor-pointer text-blue-500 hover:text-blue-600 mr-1"
          >
            Connect to Google Calendar
          </div>{" "}
          for automatic syncing!
        </div>
      )}
      <div className="relative">
        <Tooltip label="Sync from Google Calendar" withArrow className="absolute top-2 left-48">
          <ActionIcon onClick={loadGcalEvents}>
            <Refresh size={20} strokeWidth={2} color={"black"} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Sync to Google Calendar" withArrow className="absolute top-2 left-60">
          <ActionIcon onClick={updateGcal} disabled={loading}>
            <Refresh size={20} strokeWidth={2} color={"black"} />
          </ActionIcon>
        </Tooltip>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          themeSystem="standard"
          initialView="timeGridWeek"
          headerToolbar={{
            left: "dayGridMonth,timeGridWeek,timeGridDay",
            center: "title",
            right: "prev,next today",
          }}
          events={[...gcalEvents, ...deadlineEvents, ...scheduleEvents]}
          nowIndicator
          scrollTime={Date.now()}
          businessHours={{
            daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
            startTime: "08:00",
            endTime: "20:00",
          }}
          dateClick={(e) => console.log("Click Date", e)}
          eventClick={(e) => console.log("Click Event", e)}
        />
      </div>
    </div>
  );
};

export default FullCalendarApp;
