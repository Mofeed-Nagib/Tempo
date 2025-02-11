import { deleteTask } from "./delete";
import { insertTask } from "./insert";
import { selectOngoingTasks, selectTasks } from "./select";
import Task, { InsertTask, UpdateTask } from "./types";
import { updateTask } from "./update";

export type { Task, InsertTask, UpdateTask };

export { selectTasks, selectOngoingTasks, insertTask, updateTask, deleteTask };
