import { Session, SupabaseClient } from "@supabase/supabase-js";

import Metric from "./type";

export const selectMetrics = async (
  supabase: SupabaseClient,
  session: Session,
  retry: boolean = false
): Promise<Metric[]> => {
  const { data, error }: { data: Metric[]; error: any } = await supabase
    .from("metrics")
    .select("*");

  if (error) {
    console.log(error);

    if (!retry) {
      selectMetrics(supabase, session, true);
    } else {
      return [];
    }
  }

  return data;
};
