import React from "react";

import { Modal } from "../../../../components/ui";
import Task from "../../../../db/tasks/types";

const TaskModal = ({
  opened,
  setOpened,
}: {
  opened: Task | null;
  setOpened: (task: Task | null) => void;
}) => {
  return (
    <Modal size="lg" centered opened={opened !== null} onClose={() => setOpened(null)}>
      <div>{opened?.title}</div>
    </Modal>
  );
};

export default TaskModal;
