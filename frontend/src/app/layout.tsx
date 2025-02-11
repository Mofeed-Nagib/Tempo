import React from "react";

import SupabaseListener from "../components/supabase-listener";
import SupabaseProvider from "../components/supabase-provider";
import { createClient } from "../utils/supabase-server";
import RootStyleRegistry from "./emotion";
import "./globals.css";
import "./preflight.css";

// do not cache this layout
export const revalidate = 0;

export default async function RootLayout({ children }) {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <head>{/* TODO: Add Analytics */}</head>
      <body>
        <SupabaseProvider>
          <SupabaseListener serverAccessToken={session?.access_token} />
          <RootStyleRegistry>
            <div className="bg-white text-gray-800">{children}</div>
          </RootStyleRegistry>
        </SupabaseProvider>
      </body>
    </html>
  );
}
