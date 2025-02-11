import { Session, SupabaseClient } from "@supabase/supabase-js";

import { InsertTask } from "./types";

export const insertTask = async (supabase: SupabaseClient, session: Session, data: InsertTask) => {
  const { error } = await supabase.from("tasks").insert({
    user_id: session.user.id,
    completed: false,
    actual_duration: 0,
    curr_progress: 0,
    ...data,
  });

  if (error) {
    console.log(error);
    return null;
  }
};
