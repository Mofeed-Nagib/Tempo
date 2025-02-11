import { cookies, headers } from "next/headers";

import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";

export const createClient = () => createServerComponentSupabaseClient({ headers, cookies });
