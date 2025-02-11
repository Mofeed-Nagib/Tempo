import { Session, SupabaseClient } from "@supabase/supabase-js";

import Task from "./types";

export const selectTasks = async (
  supabase: SupabaseClient,
  session: Session,
  retry: boolean = false
): Promise<Task[]> => {
  const { data, error }: { data: Task[]; error: any } = await supabase.from("tasks").select("*");

  if (error) {
    console.log(error);

    if (!retry) {
      selectTasks(supabase, session, true);
    } else {
      return [];
    }
  }

  return data;
};

export const selectOngoingTasks = async (
  supabase: SupabaseClient,
  session: Session,
  retry: boolean = false
): Promise<Task[]> => {
  const { data, error }: { data: any; error: any } = await supabase
    .from("tasks")
    .select("*")
    .eq("completed", false);

  if (error) {
    console.log(error);

    if (!retry) {
      selectOngoingTasks(supabase, session, true);
    } else {
      return [];
    }
  }

  return data;
};
