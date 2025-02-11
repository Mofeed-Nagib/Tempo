import { SupabaseClient } from "@supabase/supabase-js";

import { UpdateMetric } from "./type";

export const updateMetric = async (supabase: SupabaseClient, data: UpdateMetric) => {
  const { error } = await supabase.from("metrics").update(data).match({ id: data.id });

  if (error) {
    console.log(error);
    return null;
  }
};
