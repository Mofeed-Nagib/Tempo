import { Session, SupabaseClient } from "@supabase/supabase-js";

import Label from "./types";

export const selectLabels = async (
  supabase: SupabaseClient,
  session: Session,
  retry: boolean = false
): Promise<Label[]> => {
  const { data, error }: { data: Label[]; error: any } = await supabase.from("labels").select("*");

  if (error) {
    console.log(error);

    if (!retry) {
      selectLabels(supabase, session, true);
    } else {
      return [];
    }
  }

  return data;
};
