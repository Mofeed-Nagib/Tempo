import {
  Bookmark,
  Calendar,
  Check,
  CircleCheck,
  Edit,
  Flag2,
  HourglassEmpty,
  SquareArrowLeft,
  SquareArrowRight,
  Trash,
  X,
} from "tabler-icons-react";

import React, { useEffect, useState } from "react";

import { Slider } from "@mantine/core";
import { showNotification } from "@mantine/notifications";

import { Tooltip } from "../../../../components/ui";
import { Label } from "../../../../db/labels";
import Task, { UpdateTask } from "../../../../db/tasks/types";
import { classnames, formatHours } from "../../../../utils/utils";
import { usePage } from "../pageContext";
import { useDashboard } from "./dashboardContext";
import {
  DateInput,
  DescriptionInput,
  LabelInput,
  PriorityInput,
  TitleInput,
  WorkloadInput,
} from "./shared";

type TaskWithLabel = Task & { labelObj?: Label };

export const TaskListItem = ({
  task,
  updateTask,
  setConfetti,
}: {
  task: TaskWithLabel;
  updateTask: (task: UpdateTask) => void;
  setConfetti: (confetti: boolean) => void;
}) => {
  const { setOpenDeleteTaskModal } = useDashboard();

  const [progress, setProgress] = useState(task.curr_progress);
  const [finalProgress, setFinalProgress] = useState(task.curr_progress); // for notifications
  const [oldProgress, setOldProgress] = useState(task.curr_progress); // for notifications
  const [editMode, setEditMode] = useState(false);

  const originalTitle = task.title;
  const originalDescription = task.description;
  const originalDate = new Date(task.end_date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const originalWorkload = formatHours(task.expected_duration);
  const originalPriority = { 1: "Low", 2: "Medium", 3: "High" }[task.priority];
  const originalLabel = task.labelObj?.name || "None";

  const id = task.id;
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  // const [start_date, setStartDate] = useState(new Date(task.start_date));
  const [dueDate, setDueDate] = useState(new Date(task.end_date));
  const [workload, setWorkload] = useState(task.expected_duration);
  // const [currProgress, setCurrProgress] = useState(task.curr_progress);
  const [priority, setPriority] = useState(task.priority);
  const [label, setLabel] = useState(task.labelObj?.id?.toString() || null);

  const valid = title && dueDate && workload > 0 && priority;

  const { labels } = usePage();

  useEffect(() => {
    if (finalProgress === 100) {
      showNotification({
        title: "Task Completed",
        message: "Great job! You're done! :)",
        icon: <CircleCheck size={24} />,
      });
      setConfetti(true);
    } else if (finalProgress > oldProgress) {
      showNotification({
        title: "Task Updated",
        message: "Keep up the good work! You're almost there!",
        color: "teal",
        icon: <SquareArrowRight size={24} />,
      });
      setOldProgress(finalProgress);
    } else if (finalProgress < oldProgress) {
      showNotification({
        title: "Task Updated",
        message: "That's okay! You can do it! Keep at it!",
        color: "red",
        icon: <SquareArrowLeft size={24} />,
      });
      setOldProgress(finalProgress);
    }
  }, [finalProgress, oldProgress, setConfetti]);

  const saveTask = () => {
    if (!valid) {
      return;
    }

    updateTask({
      id,
      title,
      description,
      end_date: dueDate.toISOString(),
      expected_duration: workload,
      priority,
      label: labels.find((tempLabel) => tempLabel?.id?.toString() === label?.toString())?.id,
    });
  };

  const enterEditMode = () => {
    setEditMode(true);
    setTitle(originalTitle);
    setDescription(originalDescription);
    setDueDate(new Date(task.end_date));
    setWorkload(task.expected_duration);
    setPriority(task.priority);
    setLabel(task.labelObj?.id?.toString() || null);
  };

  const exitEditMode = () => {
    setEditMode(false);
  };

  return (
    <div
      className="group w-full h-full p-2 pb-8 rounded-lg hover:bg-gray-100 cursor-pointer border-solid border-2 border-gray-100"
      style={{
        backgroundColor: task?.labelObj?.color && task?.labelObj?.color + "20",
        border: task?.labelObj?.color && "1px solid" + task?.labelObj?.color,
      }}
    >
      <div test-id="task-item" className="w-full flex justify-between">
        <div className="w-full">
          <div className="flex w-full gap-1">
            {editMode ? (
              <TitleInput title={title} setTitle={setTitle} />
            ) : (
              <p test-id="task-item-title" className="font-medium text-lg">
                {originalTitle}
              </p>
            )}
          </div>
          <div className="flex w-full gap-1 mt-2 mb-2">
            {editMode ? (
              <DescriptionInput description={description} setDescription={setDescription} />
            ) : (
              <p className="w-full font-normal text-base">{originalDescription}</p>
            )}
          </div>
          <div className="flex flex-row items-end space-x-4">
            {editMode ? (
              <DateInput date={dueDate} setDate={setDueDate} />
            ) : (
              <div className="flex space-x-0.25 flex-row items-center">
                <Calendar size={36} strokeWidth={2} className="p-2" color={"black"} />
                <div test-id="task-item-date" className="text-black-500">
                  {originalDate}
                </div>
              </div>
            )}
            {editMode ? (
              <WorkloadInput workload={workload} setWorkload={setWorkload} />
            ) : (
              <div className="flex flex-row space-x-0.25 items-center">
                <div>
                  <HourglassEmpty size={36} strokeWidth={2} className="p-2" color={"black"} />
                </div>
                <div test-id="task-item-workload" className="text-black-500">
                  {originalWorkload}
                </div>
              </div>
            )}
            {editMode ? (
              <PriorityInput priority={priority?.toString()} setPriority={setPriority} />
            ) : (
              <div className="flex space-x-0.25 flex-row items-center">
                <Flag2 size={36} strokeWidth={2} className="p-2" color={"black"} />
                <div test-id="task-item-priority">{originalPriority}</div>
              </div>
            )}
            {editMode ? (
              <LabelInput labels={labels} label={label} setLabel={setLabel} />
            ) : (
              <div className="flex space-x-0.25 flex-row items-center">
                <Bookmark size={36} strokeWidth={2} className="p-2" color={"black"} />
                <div className={originalLabel === "None" ? "text-gray-400" : "text-black"}>
                  {originalLabel}
                </div>
              </div>
            )}
          </div>
        </div>
        {editMode ? (
          <div className="flex">
            <Check
              size={36}
              color={valid ? "green" : "gray"}
              className={classnames(
                "p-2 rounded-full hover:bg-gray-200 hidden group-hover:block",
                !valid && "cursor-default opacity-50"
              )}
              onClick={() => {
                if (valid) {
                  saveTask();
                  exitEditMode();
                }
              }}
            />
            <X
              size={36}
              color="red"
              className="p-2 rounded-full hover:bg-gray-200 hidden group-hover:block"
              onClick={exitEditMode}
            />
          </div>
        ) : (
          <div className="flex">
            <Tooltip label="Edit Task">
              <div>
                <Edit
                  test-id="task-item-edit-tooltip"
                  size={36}
                  color="gray"
                  className="p-2 rounded-full hover:bg-gray-200 hidden group-hover:block"
                  onClick={enterEditMode}
                />
              </div>
            </Tooltip>
            <Tooltip label="Delete Task">
              <div>
                <Trash
                  size={36}
                  color="red"
                  className="p-2 rounded-full text-red-500 hover:bg-gray-200 hidden group-hover:block"
                  onClick={() => setOpenDeleteTaskModal(task.id)}
                />
              </div>
            </Tooltip>
          </div>
        )}
      </div>
      <Slider
        min={0}
        max={100}
        step={10}
        marks={[
          { value: 0 },
          { value: 10 },
          { value: 20 },
          { value: 30 },
          { value: 40 },
          { value: 50 },
          { value: 60 },
          { value: 70 },
          { value: 80 },
          { value: 90 },
          { value: 100 },
        ]}
        value={progress}
        onChange={(value) => {
          setProgress(value);
        }}
        label={progress + "%"}
        onChangeEnd={(value) => {
          updateTask({
            id: task.id,
            curr_progress: value,
            completed: value === 100,
          });
          setFinalProgress(value);
        }}
        className="w-full mt-2 px-2"
      />
    </div>
    // </div>
  );
};
