import { SupabaseClient } from "@supabase/supabase-js";

import { UpdateLabel } from "./types";

export const updateLabel = async (supabase: SupabaseClient, data: UpdateLabel) => {
  const { error } = await supabase.from("labels").update(data).match({ id: data.id });

  if (error) {
    console.log(error);
    return null;
  }
};
