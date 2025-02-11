/*
AUTHENTICATE WITH GOOGLE CALENDAR
*/
import { updateUser } from "src/db/users";

import { SupabaseClient } from "@supabase/supabase-js";

export const addCalendarScopes = async (supabase, session) => {
  // const { setCalendarToken } = useSupabase();
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      scopes: "https://www.googleapis.com/auth/calendar",
      queryParams: { access_type: "offline", prompt: "consent", login_hint: session.user.email },
    },
  });
};

/*
WEBHOOK TO WATCH CALENDAR EVENTS
*/
export const watchCalendar = async (
  supabase: SupabaseClient,
  accessToken: string,
  calendar: string,
  userId: string
) => {
  const endPoint = `https://www.googleapis.com/calendar/v3/calendars/${calendar}/events/watch`;

  const requestDetails = {
    id: userId,
    type: "web_hook",
    address: "https://s23-clockwork.vercel.app/api/webhook",
  };

  const response = await fetch(endPoint, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + accessToken,
      Accept: "application/json",
    },
    body: JSON.stringify(requestDetails),
  });

  const data = await response.json();
  if (data.resourceId) {
    await updateUser(supabase, {
      user_id: userId,
      webhook_resource_id: data.resourceId,
    });
  }
  return data;
};

/*
READ CALENDARS AND EVENTS
*/

export const getCalendars = async (accessToken: string) => {
  const endPoint = `https://www.googleapis.com/calendar/v3/users/me/calendarList`;

  const response = await fetch(endPoint, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + accessToken,
      Accept: "application/json",
    },
  });

  const data = await response.json();
  return data;
};

export const getPrimaryCalendar = async (accessToken: string) => {
  const calendars = await getCalendars(accessToken);
  const primaryCalendar = calendars?.items?.find((item) => item.primary);
  return primaryCalendar;
};

export const calendarColorMap = {
  "1": "#795548",
  "2": "#e67c73",
  "3": "#d50000",
  "4": "#f4511e",
  "5": "#ef6c00",
  "6": "#f09300",
  "7": "#009688",
  "8": "#0b8043",
  "9": "#7cb342",
  "10": "#c0ca33",
  "11": "#e4c441",
  "12": "#f6bf26",
  "13": "#33b679",
  "14": "#039be5",
  "15": "#4285f4",
  "16": "#3f51b5",
  "17": "#7986cb",
  "18": "#b39ddb",
  "19": "#616161",
  "20": "#a79b8e",
  "21": "#ad1457",
  "22": "#d81b60",
  "23": "#8e24aa",
  "24": "#9e69af",
};

// some of these may be incorrect
// TODO: Correct all of these
export const eventColorMap = {
  "1": "#D50001",
  "2": "#7886CB",
  "3": "#8E24AA", // correct
  "4": "#E67B73",
  "5": "#F4511E",
  "6": "#3F50B5", // correct
  "7": "#32B579",
  "8": "#F5BF25", // correct
  "9": "#039BE5",
  "10": "#0A8043",
  "11": "#616161",
};

export const getEvents = async (accessToken: string, calendarId: string = "primary") => {
  let date = new Date();
  let timeMin = new Date(new Date().setDate(date.getDate() - 1)).toISOString();
  let timeMax = new Date(new Date().setDate(date.getDate() + 30)).toISOString();
  let timeZone = "America/New_York";
  let singleEvent = true;

  const endPoint = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?timeMin=${timeMin}&timeMax=${timeMax}&timeZone=${timeZone}&singleEvents=${singleEvent}`;

  const response = await fetch(endPoint, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + accessToken,
      Accept: "application/json",
    },
  });

  const data = await response.json();
  return data;
};

/*
ADD AND DELETE CALENDARS AND EVENTS
*/

export const addTempoCalendar = async (accessToken: string) => {
  const calendars = await getCalendars(accessToken);
  const tempoCalendar = calendars?.items?.find((item) => item.summary === "Tempo");
  if (tempoCalendar) return tempoCalendar;

  const endPoint = `https://www.googleapis.com/calendar/v3/calendars`;

  const response = await fetch(endPoint, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + accessToken,
      Accept: "application/json",
    },
    body: JSON.stringify({
      summary: "Tempo",
    }),
  });

  const data = await response.json();
  return data;
};

export const addGcalEvents = async (accessToken: string, events: any[]) => {
  if (!events || !accessToken || events.length <= 0) return;

  const tempoCalendar = await addTempoCalendar(accessToken);
  const calendarId = tempoCalendar.id;

  const toTimezone = (dateAsSeconds: number) => {
    return new Date(new Date(dateAsSeconds).toISOString());
  };

  const body = events.map((event) => {
    const startDate = toTimezone(event.start).toISOString();
    const endDate = toTimezone(event.end).toISOString();

    const eventDetails = {
      summary: event.title,
      start: {
        dateTime: startDate,
        timeZone: "America/New_York",
      },
      end: {
        dateTime: endDate,
        timeZone: "America/New_York",
      },
    };

    return {
      method: "POST",
      path: `/calendar/v3/calendars/${calendarId}/events`,
      body: JSON.stringify(eventDetails),
    };
  });

  const formattedBody =
    body
      .map(
        (item, i) => `
--batch_request_boundary_12345
Content-Type: application/http
Content-ID: ${i + 1}

${item.method} ${item.path} HTTP/1.1
Authorization: Bearer ${accessToken}
Content-Type: application/json
Content-Length: ${item.body.length}

${item.body}
`
      )
      .join("") + "--batch_request_boundary_12345--";

  fetch("https://www.googleapis.com/batch/calendar/v3", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + accessToken, // Access token for google
      "Content-Type": "multipart/mixed; boundary=batch_request_boundary_12345",
    },
    body: formattedBody,
  });
};

export const deleteGcalEvents = async (accessToken: string) => {
  const tempoCalendar = await addTempoCalendar(accessToken);
  const calendarId = tempoCalendar.id;

  const events = await getEvents(accessToken, calendarId);
  const eventIds = events?.items?.map((item) => item.id);

  if (!eventIds || !accessToken || eventIds.length <= 0) return;

  const body = eventIds.map((eventId) => {
    return {
      method: "DELETE",
      path: `/calendar/v3/calendars/${calendarId}/events/${eventId}`,
    };
  });

  const formattedBody =
    body
      .map(
        (item, i) => `
--batch_request_boundary_12345
Content-Type: application/http
Content-ID: ${i + 1}

${item.method} ${item.path} HTTP/1.1
Authorization: Bearer ${accessToken}
`
      )
      .join("") + "--batch_request_boundary_12345--";

  fetch("https://www.googleapis.com/batch/calendar/v3", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + accessToken, // Access token for google
      "Content-Type": "multipart/mixed; boundary=batch_request_boundary_12345",
    },
    body: formattedBody,
  });
};
