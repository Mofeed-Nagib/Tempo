import React, { useState } from "react";

import { useSupabase } from "../../../../components/supabase-provider";
import { Task } from "../../../../db/tasks";
import CreateInline from "./createInline";
import CreateTaskModal from "./createTaskModal";
import DashboardProvider from "./dashboardContext";
import DeleteTaskModal from "./deleteTaskModal";
import TaskList from "./taskList";

const Dashboard = () => {
  const [openCreateTaskModal, setOpenCreateTaskModal] = useState<boolean>(false);
  const [openTaskModal, setOpenTaskModal] = useState<Task | null>(null); // Task object
  const [openDeleteTaskModal, setOpenDeleteTaskModal] = useState<number | null>(null); // Task id

  return (
    <DashboardProvider
      openCreateTaskModal={openCreateTaskModal}
      setOpenCreateTaskModal={setOpenCreateTaskModal}
      openTaskModal={openTaskModal}
      setOpenTaskModal={setOpenTaskModal}
      openDeleteTaskModal={openDeleteTaskModal}
      setOpenDeleteTaskModal={setOpenDeleteTaskModal}
    >
      <CreateTaskModal opened={openCreateTaskModal} setOpened={setOpenCreateTaskModal} />
      {/* <TaskModal opened={openTaskModal} setOpened={setOpenTaskModal} /> */}
      <DeleteTaskModal opened={openDeleteTaskModal} setOpened={setOpenDeleteTaskModal} />
      <div className="w-full h-full flex flex-col p-4 items-center">
        <CreateInline />
        <TaskList />
      </div>
    </DashboardProvider>
  );
};

export default Dashboard;
