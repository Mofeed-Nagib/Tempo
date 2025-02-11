import { SupabaseClient } from "@supabase/supabase-js";

export const deleteTask = async (supabase: SupabaseClient, id: number) => {
  const { error } = await supabase.from("tasks").delete().match({ id });

  if (error) {
    console.log(error);
    return null;
  }
};
