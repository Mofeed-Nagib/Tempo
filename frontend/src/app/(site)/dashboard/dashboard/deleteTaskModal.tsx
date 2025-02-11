import React from "react";

import { Button } from "@mantine/core";

import { Modal } from "../../../../components/ui";
import { usePage } from "../pageContext";

const DeleteTaskModal = ({
  opened,
  setOpened,
}: {
  opened: number | null;
  setOpened: (opened: number | null) => void;
}) => {
  const { deleteTask } = usePage();

  const removeTask = () => {
    deleteTask(opened);
    setOpened(null);
  };

  return (
    <Modal
      centered
      size="md"
      title="Are you sure you want to delete this task?"
      withCloseButton={false}
      opened={opened !== null}
      onClose={() => setOpened(null)}
    >
      <div className="flex flex-col items-center">
        <div className="flex flex-row space-x-4">
          <Button onClick={() => setOpened(null)} variant="outline" color="gray">
            Cancel
          </Button>
          <Button onClick={removeTask} className="bg-red-500 hover:bg-red-600">
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteTaskModal;
