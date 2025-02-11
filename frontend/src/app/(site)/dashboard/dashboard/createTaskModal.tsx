import React, { useState } from "react";

import { Button, Kbd } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";

import { Modal, Tooltip } from "../../../../components/ui";
import { usePage } from "../pageContext";
import {
  DateInput,
  DescriptionInput,
  LabelInput,
  PriorityInput,
  TitleInput,
  WorkloadInput,
} from "./shared";

const CreateTaskModal = ({
  opened,
  setOpened,
}: {
  opened: boolean;
  setOpened: (opened: boolean) => void;
}) => {
  const { insertTask, labels } = usePage();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [workload, setWorkload] = useState(1);
  const [priority, setPriority] = useState("2");
  const [label, setLabel] = useState(null);

  const empty =
    title === "" &&
    description === "" &&
    dueDate.toDateString() === new Date().toDateString() &&
    workload === 1 &&
    priority === "2" &&
    label === null;

  const valid = title && dueDate && workload > 0 && priority;

  const resetState = () => {
    setTitle("");
    setDescription("");
    setDueDate(new Date());
    setWorkload(1);
    setPriority("2");
    setLabel(null);
  };

  const closeModal = () => {
    resetState();
    setOpened(false);
  };

  const createTask = () => {
    insertTask({
      title: title,
      description: description,
      start_date: new Date().toISOString(),
      end_date: dueDate.toISOString(),
      expected_duration: workload,
      priority: parseInt(priority),
      label: parseInt(label),
    });
    closeModal();
  };

  useHotkeys([["esc", () => setOpened(false)]]);
  useHotkeys([["enter", () => valid && createTask()]]);

  return (
    <Modal
      size="lg"
      classNames={{
        modal: "rounded-xl",
        inner: "py-24",
      }}
      opened={opened}
      onClose={closeModal}
      closeOnClickOutside={empty}
    >
      <TitleInput title={title} setTitle={setTitle} />
      <DescriptionInput description={description} setDescription={setDescription} />
      <div className="w-full flex items-end justify-start gap-1 mt-2">
        <DateInput date={dueDate} setDate={setDueDate} />
        <WorkloadInput workload={workload} setWorkload={setWorkload} />
        <PriorityInput priority={priority} setPriority={setPriority} />
        <LabelInput label={label} setLabel={setLabel} labels={labels} />
      </div>
      <div className="w-full h-[1px] bg-gray-200 mt-2" />
      <div className="w-full flex items-center justify-end gap-2 mt-2">
        <Tooltip
          label={<Kbd>esc</Kbd>}
          classNames={{
            tooltip: "text-xs bg-transparent",
          }}
        >
          <Button variant="outline" color="gray" onClick={closeModal}>
            Cancel
          </Button>
        </Tooltip>
        <Tooltip
          label={<Kbd>enter</Kbd>}
          classNames={{
            tooltip: "text-xs bg-transparent",
          }}
        >
          <Button variant="filled" color="blue" onClick={createTask} disabled={!valid}>
            Create
          </Button>
        </Tooltip>
      </div>
    </Modal>
  );
};

export default CreateTaskModal;
