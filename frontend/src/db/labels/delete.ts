import { SupabaseClient } from "@supabase/supabase-js";

export const deleteLabel = async (supabase: SupabaseClient, id: number) => {
  const { error: error1, data } = await supabase
    .from("tasks")
    .update({ label: null })
    .match({ label: id });

  if (error1) {
    console.log(error1);
    return null;
  }

  const { error: error2 } = await supabase.from("labels").delete().match({ id });

  if (error2) {
    console.log(error2);
    return null;
  }
};
