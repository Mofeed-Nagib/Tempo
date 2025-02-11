import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

import { usePage } from "../pageContext";
import { TaskListItem } from "./taskListItem";

const TaskList = () => {
  const { tasks, updateTask, labels } = usePage();
  const [confetti, setConfetti] = useState(false);

  const { width, height } = useWindowSize();

  useEffect(() => {
    confetti &&
      setTimeout(() => {
        setConfetti(false);
      }, 3000);
  }, [confetti, setConfetti]);

  const tasksWithLabels = tasks.map((task) => {
    const label = labels.find((label) => label.id === task.label);
    return { ...task, labelObj: label };
  });

  const overDueTasks = tasksWithLabels
    .filter((task) => {
      const today = new Date();
      const endDate = new Date(task.end_date);
      endDate.setDate(endDate.getDate() + 1);
      return endDate < today;
    })
    .sort((a, b) => Date.parse(a.end_date) - Date.parse(b.end_date));

  const todayTasks = tasksWithLabels
    .filter((task) => {
      const today = new Date();
      const endDate = new Date(task.end_date);
      return (
        endDate.getDate() === today.getDate() &&
        endDate.getMonth() === today.getMonth() &&
        endDate.getFullYear() === today.getFullYear()
      );
    })
    .sort((a, b) => Date.parse(a.end_date) - Date.parse(b.end_date));

  const upcomingTasks = tasksWithLabels
    .filter((task) => {
      const today = new Date();
      const endDate = new Date(task.end_date);
      return endDate > today;
    })
    .sort((a, b) => Date.parse(a.end_date) - Date.parse(b.end_date));

  return (
    <div className="w-1/2 mx-auto flex flex-col items-center gap-2 mt-8">
      {confetti && <Confetti width={width} height={height} />}
      <div className="w-full text-center text-2xl font-bold">Tasks</div>
      {overDueTasks?.length > 0 && (
        <>
          <div className="w-full text-center text-xl font-bold">Overdue</div>
          {overDueTasks.map((task) => (
            <TaskListItem
              task={task}
              updateTask={updateTask}
              key={`task-${task.id}`}
              setConfetti={setConfetti}
            />
          ))}
        </>
      )}
      {todayTasks?.length > 0 && (
        <>
          <div className="w-full text-center text-xl font-bold">Today</div>
          {todayTasks.map((task) => (
            <TaskListItem
              task={task}
              updateTask={updateTask}
              key={`task-${task.id}`}
              setConfetti={setConfetti}
            />
          ))}
        </>
      )}
      {upcomingTasks?.length > 0 && (
        <>
          <div className="w-full text-center text-xl font-bold">Upcoming</div>
          {upcomingTasks.map((task) => (
            <TaskListItem
              task={task}
              updateTask={updateTask}
              key={`task-${task.id}`}
              setConfetti={setConfetti}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default TaskList;
