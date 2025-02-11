import { Client } from "pg";
import { createScheduleEvents, getSchedule } from "src/algo";
import { addGcalEvents, deleteGcalEvents, getEvents } from "src/components/calendar";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const SUPABASE_PASSWORD = process.env.SUPABASE_PASSWORD;

export default async function handler(req, res) {
  /*
  Check if valid request
  */

  const overallStart = new Date();

  console.log(req.headers);
  console.log(req.body);

  const { "x-goog-channel-id": userId, "x-goog-resource-state": resourceState } = req.headers;

  if (resourceState === "sync") {
    return res.status(200).json({ message: "Sync" });
  }

  // check if userId is valid uuid
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (!uuidRegex.test(userId)) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  const client = new Client(
    `postgres://postgres:${SUPABASE_PASSWORD}@db.piqlrqkrapytusmoajsn.supabase.co:6543/postgres`
  );

  await client.connect();

  const { rows } = await client.query(`SELECT * FROM "users" WHERE "user_id" = '${userId}'`);

  if (rows.length !== 1) {
    await client.end();
    return res.status(404).json({ message: "User not found" });
  }

  /*
  Get calendar events
  */

  const refreshToken = rows[0].gcal_auth_token;

  if (!refreshToken) {
    await client.end();
    return res.status(404).json({ message: "Refresh token not found" });
  }

  // from pages/api/auth-calendar.ts
  const url = `https://oauth2.googleapis.com/token?client_id=${GOOGLE_CLIENT_ID}&client_secret=${GOOGLE_CLIENT_SECRET}&refresh_token=${refreshToken}&grant_type=refresh_token`;
  const authResponse = await fetch(url, { method: "POST" });
  const authData = await authResponse.json();
  const calendarToken = authData.access_token;

  const eventsData = await getEvents(calendarToken);
  const events = eventsData.items;

  if (!events) {
    await client.end();
    return res.status(404).json({ message: "Events not found" });
  }

  /*
  Get tasks and labels
  */

  const { rows: tasks } = await client.query(
    `SELECT * FROM "tasks" WHERE "user_id" = '${userId}' AND "completed" = false`
  );

  if (!tasks) {
    await client.end();
    return res.status(404).json({ message: "Tasks not found" });
  }

  const { rows: labels } = await client.query(
    `SELECT * FROM "labels" WHERE "user_id" = '${userId}'`
  );

  if (!labels) {
    await client.end();
    return res.status(404).json({ message: "Labels not found" });
  }

  await client.end();

  /*
  Run schedule algorithm
  */

  const schedule = await getSchedule(tasks, labels, events);

  const scheduleEvents = createScheduleEvents(tasks, labels, schedule);

  /*
  Sync Google Calendar
  */

  await deleteGcalEvents(calendarToken);

  await addGcalEvents(calendarToken, scheduleEvents);

  console.log("Total time", new Date().getTime() - overallStart.getTime());

  res.status(200).json({ message: "Hello World" });
}
