"use client";

import React, { createContext, useContext } from "react";

import Task from "../../../../db/tasks/types";

type DashboardContext = {
  openCreateTaskModal: boolean;
  setOpenCreateTaskModal: (open: boolean) => void;
  openTaskModal: Task | null;
  setOpenTaskModal: (task: Task) => void;
  openDeleteTaskModal: number | null;
  setOpenDeleteTaskModal: (id: number) => void;
};

type DashboardProviderProps = DashboardContext & {
  children: React.ReactNode;
};

const Context = createContext<DashboardContext | undefined>(undefined);

export default function DashboardProvider({ children, ...contextProps }: DashboardProviderProps) {
  return <Context.Provider value={contextProps}>{children}</Context.Provider>;
}

export const useDashboard = () => {
  let context = useContext(Context);
  if (context === undefined) {
    throw new Error("useDashboard must be used inside DashboardProvider");
  } else {
    return context;
  }
};
