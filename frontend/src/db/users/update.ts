import { SupabaseClient } from "@supabase/supabase-js";

import { UpdateUser } from "./type";

export const updateUser = async (supabase: SupabaseClient, data: UpdateUser) => {
  const { error } = await supabase.from("users").update(data).match({ user_id: data.user_id });

  if (error) {
    console.log(error);
    return null;
  }
};
