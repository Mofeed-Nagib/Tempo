import { getSchedule } from "src/algo";
import { Label } from "src/db/labels";
import { Task } from "src/db/tasks";

export default async function handler(req, res) {
  const { tasks, labels, events }: { tasks: Task[]; labels: Label[]; events: any[] } = req.body;

  if (!tasks) {
    res.status(400).json({ message: "No input provided" });
    return;
  }

  if (tasks.length == 0) {
    res.status(200).json({ message: "Success", tasks: [], schedule: [] });
    return;
  }

  if (tasks.length > 100) {
    res.status(400).json({ message: "Too many tasks" });
    return;
  }

  const schedule = await getSchedule(tasks, labels, events);

  res.status(200).json({ message: "Success", schedule });
}
