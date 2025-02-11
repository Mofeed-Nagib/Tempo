import { SupabaseClient } from "@supabase/supabase-js";

import { UpdateTask } from "./types";

export const updateTask = async (supabase: SupabaseClient, data: UpdateTask) => {
  const { error } = await supabase.from("tasks").update(data).match({ id: data.id });

  if (error) {
    console.log(error);
    return null;
  }
};
