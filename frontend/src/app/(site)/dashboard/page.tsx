"use client";

import React, { useEffect, useState } from "react";
import { BounceLoader } from "react-spinners";

import { useSupabase } from "../../../components/supabase-provider";
import {
  InsertLabel,
  Label,
  UpdateLabel,
  deleteLabel as _deleteLabel,
  insertLabel as _insertLabel,
  updateLabel as _updateLabel,
  selectLabels,
} from "../../../db/labels";
import {
  Metric,
  UpdateMetric,
  updateMetric as _updateMetric,
  selectMetrics,
} from "../../../db/metrics";
import {
  InsertTask,
  Task,
  UpdateTask,
  deleteTask as _deleteTask,
  insertTask as _insertTask,
  updateTask as _updateTask,
  selectOngoingTasks,
} from "../../../db/tasks";
import { useLayout } from "../layoutContext";
import CalendarPage from "./calendar";
import DashboardPage from "./dashboard";
import LabelsPage from "./labels";
import PageProvider from "./pageContext";
import Scratchpad from "./scratchpad";
import SettingsPage from "./settings";

// do not cache this page
export const revalidate = 0;

const findAndUpdate = (objs, obj) => {
  const index = objs.findIndex((t) => t.id === obj.id);
  if (index === -1) return objs;

  const newObjs = [...objs];
  newObjs[index] = {
    ...newObjs[index],
    ...obj,
  };

  return newObjs;
};

const Page = () => {
  const { supabase, session, user } = useSupabase();
  const { sidebar, showSidebar, setShowSidebar, showFooter, setShowFooter } = useLayout();

  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);

  useEffect(() => {
    if (!showSidebar) setShowSidebar(true);
    if (showFooter) setShowFooter(false);
  }, [showSidebar, setShowSidebar, showFooter, setShowFooter]);

  useEffect(() => {
    const fetchRows = async () => {
      const tasks = await selectOngoingTasks(supabase, session);
      setTasks(tasks);

      const labels = await selectLabels(supabase, session);
      setLabels(labels);

      const metrics = await selectMetrics(supabase, session);
      setMetrics(metrics);

      setLoading(false);
    };

    fetchRows();
  }, [supabase, session]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("*")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "tasks" }, (payload) =>
        setTasks((tasks) => [...tasks, payload.new as Task])
      )
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "tasks" }, (payload) =>
        setTasks((tasks) => findAndUpdate(tasks, payload.new as Task))
      )
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "tasks" }, (payload) =>
        setTasks((tasks) => tasks.filter((task) => task.id !== payload.old.id))
      )
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "labels" }, (payload) =>
        setLabels((labels) => [...labels, payload.new as Label])
      )
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "labels" }, (payload) =>
        setLabels((labels) => findAndUpdate(labels, payload.new as Label))
      )
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "labels" }, (payload) =>
        setLabels((labels) => labels.filter((label) => label.id !== payload.old.id))
      )
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "metrics" }, (payload) =>
        setMetrics((metrics) => findAndUpdate(metrics, payload.new as Metric))
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, setTasks, tasks]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <BounceLoader color="#526B45" loading={loading} size={75} />
      </div>
    );
  }

  const filteredTasks = tasks.filter((task) => !task.completed);

  const insertTask = async (task: InsertTask) => {
    await _insertTask(supabase, session, task);
  };

  const updateTask = async (task: UpdateTask) => {
    await _updateTask(supabase, task);
  };

  const deleteTask = async (task: number) => {
    await _deleteTask(supabase, task);
  };

  const insertLabel = async (label: InsertLabel) => {
    await _insertLabel(supabase, session, label);
  };

  const updateLabel = async (label: UpdateLabel) => {
    await _updateLabel(supabase, label);
  };

  const deleteLabel = async (label: number) => {
    await _deleteLabel(supabase, label);
  };

  const updateMetric = async (metric: UpdateMetric) => {
    await _updateMetric(supabase, metric);
  };

  return (
    <PageProvider
      tasks={filteredTasks}
      insertTask={insertTask}
      updateTask={updateTask}
      deleteTask={deleteTask}
      labels={labels}
      insertLabel={insertLabel}
      updateLabel={updateLabel}
      deleteLabel={deleteLabel}
      metrics={metrics}
      updateMetric={updateMetric}
    >
      {sidebar === 0 && <DashboardPage />}
      {sidebar === 1 && <CalendarPage />}
      {sidebar === 2 && <LabelsPage />}
      {sidebar === 3 && <Scratchpad />}
      {sidebar === 4 && <SettingsPage />}
    </PageProvider>
  );
};

export default Page;
