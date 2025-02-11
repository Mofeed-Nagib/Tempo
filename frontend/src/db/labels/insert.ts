import { Session, SupabaseClient } from "@supabase/supabase-js";

import { InsertLabel } from "./types";

export const insertLabel = async (
  supabase: SupabaseClient,
  session: Session,
  data: InsertLabel
) => {
  const { error } = await supabase.from("labels").insert({
    user_id: session.user.id,
    ...data,
  });

  if (error) {
    console.log(error);
    return null;
  }
};
