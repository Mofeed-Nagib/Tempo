import { DEFAULT_COLOR } from "src/constants";

class Setpoints {
  setpoints_list: number[];

  constructor(T: number) {
    this.setpoints_list = Array(T + 1).fill(0);
  }

  get_list() {
    return this.setpoints_list.map((v, i) => [i, v]);
  }

  add_task(due, workload) {
    for (let i = due; i < this.setpoints_list.length; i++) {
      this.setpoints_list[i] += workload;
    }
  }

  get_slope(x, y) {
    const sps = this.get_list();
    const upcoming_sps = sps.filter(([t, v]) => t >= x);
    if (upcoming_sps.length == 0) {
      return 0;
    }

    const slopeOptions = upcoming_sps.map((s) => (s[1] - y) / (s[0] - x + 1));
    return Math.min(10, Math.max(...slopeOptions));
  }
}

const createSchedule = (rawTasks: any[]) => {
  const today = Math.floor((Date.now() / 1000 / 60 / 60 - 4) / 24);

  const tasks = rawTasks.map((t) => ({
    id: t.id,
    start_date: Math.floor(Date.parse(t.start_date) / 1000 / 60 / 60 / 24) - today,
    due_date: Math.floor(Date.parse(t.end_date) / 1000 / 60 / 60 / 24) - today,
    workload: t.expected_duration,
  }));

  const availTasks = tasks.sort((a, b) => a.start_date - b.start_date);
  const dueTasks = tasks.sort((a, b) => a.due_date - b.due_date);

  const T = Math.max(0, dueTasks[dueTasks.length - 1].due_date + 1) + 10;
  const S = tasks.reduce((acc, t) => acc + t.workload, 0);

  const currWork = [0];
  const setpoints = new Setpoints(T);
  const currAvailTasks = availTasks
    .filter((t) => t.start_date < 0)
    .sort((a, b) => a.due_date - b.due_date);
  for (const t of currAvailTasks) {
    setpoints.add_task(t.due_date, t.workload);
  }

  for (let i = 0; i < T + 1; i++) {
    const newAvailTasks = availTasks.filter((t) => t.start_date == i);
    for (const t of newAvailTasks) {
      setpoints.add_task(t.due_date, t.workload);
    }
    const slope = setpoints.get_slope(i, currWork[i]);
    currWork.push(Math.min(S, currWork[i] + slope));
  }

  const workPerDay = currWork.map((w, i) => w - (currWork[i - 1] || 0)).slice(1, T + 1);

  const schedule = [];
  const remainingTasks = [...dueTasks.filter((t) => t.id >= 0)];
  const remainingEvents = [...dueTasks.filter((t) => t.id < 0)];
  const workLeft = remainingTasks.map((t) => t.workload);
  for (let i = 0; i < T; i++) {
    let todayWork = workPerDay[i];
    const eventWorkload = remainingEvents
      .filter((e) => e.due_date == i)
      .reduce((acc, t) => acc + t.workload, 0);
    todayWork -= eventWorkload;

    schedule.push([]);
    while (todayWork > 0 && remainingTasks.length > 0) {
      const workDone = Math.min(todayWork, workLeft[0]);
      schedule[schedule.length - 1].push({
        date: new Date((today + i) * 1000 * 60 * 60 * 24),
        id: remainingTasks[0].id,
        work: workDone,
      });
      workLeft[0] -= workDone;
      todayWork -= workDone;
      if (workLeft[0] <= 0) {
        remainingTasks.shift();
        workLeft.shift();
      }
    }
  }

  return schedule;
};

const addTimes = (schedule, rawGcalEvents) => {
  const gcalEvents = rawGcalEvents.map((event) => ({
    start: Date.parse(event.start.dateTime),
    end: Date.parse(event.end.dateTime),
  }));

  const scheduleEvents = [];

  const startTime = 9; // 9am
  const buffer = 0.25; // 15 minutes
  const minWork = 0.5; // 30 minutes

  schedule?.map((day) => {
    if (day.length === 0) return;

    let time = 4 + startTime; // timezone + 9am
    let date = Date.parse(day[0].date);
    const currGcalEvents = gcalEvents
      .filter((event) => event.start >= date && event.start < date + 24 * 3600 * 1000)
      .sort((a, b) => a.start - b.start);

    day.map((scheduleItem) => {
      let workLeft = scheduleItem.work;
      const addEvent = (work) => {
        scheduleEvents.push({
          id: scheduleItem.id,
          start: date + time * 3600 * 1000,
          end: date + (time + work) * 3600 * 1000,
        });
      };

      while (workLeft > 0) {
        const currGcalEvent = currGcalEvents[0];
        if (currGcalEvent) {
          const currGcalEventStart = currGcalEvent.start;
          const currGcalEventEnd = currGcalEvent.end;
          const availTime = (currGcalEventStart - date) / 3600 / 1000 - time - buffer;
          if (availTime >= workLeft) {
            addEvent(workLeft);
            time += workLeft + buffer;
            workLeft = 0;
          } else {
            if (availTime > minWork) {
              addEvent(availTime);
              workLeft -= availTime;
            }
            time = (currGcalEventEnd - date) / 3600 / 1000 + buffer;
            currGcalEvents.shift();
          }
        } else {
          addEvent(workLeft);
          time += workLeft + buffer;
          workLeft = 0;
        }
      }
    });
  });

  return scheduleEvents;
};

export const getSchedule = async (tasks, labels, events) => {
  const tasksAndEvents = [
    ...tasks,
    ...events
      .map((e, i) => ({
        id: -(i + 1),
        start_date: e.start.dateTime,
        end_date: e.end.dateTime,
        expected_duration:
          (Date.parse(e.end.dateTime) - Date.parse(e.start.dateTime)) / 1000 / 60 / 60,
      }))
      .filter((e) => e.expected_duration > 0), // filter out all day events
  ];

  const rawScheduleWithEvents = createSchedule(tasksAndEvents);
  const rawSchedule = rawScheduleWithEvents.map((day) => day.filter((t) => t.id >= 0));
  const schedule = addTimes(rawSchedule, events);

  return schedule;
};

export const createScheduleEvents = (tasks, labels, schedule) => {
  return schedule.map((scheduleItem) => {
    {
      const task = tasks.find((task) => task.id === scheduleItem.id);
      const label = labels.find((label) => label?.id === task?.label);
      return {
        title: "Work on " + task?.title,
        color: label?.color || DEFAULT_COLOR,
        start: scheduleItem.start,
        end: scheduleItem.end,
      };
    }
  });
};
