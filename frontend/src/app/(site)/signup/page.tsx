"use client";

import React, { useEffect } from "react";

import { useRouter } from "next/navigation";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa as AuthTheme } from "@supabase/auth-ui-shared";

import { useSupabase } from "../../../components/supabase-provider";
import { useLayout } from "../layoutContext";

// Supabase auth needs to be triggered client-side
export default function SignUp() {
  const { supabase } = useSupabase();
  const { showSidebar, setShowSidebar, showFooter, setShowFooter } = useLayout();

  const router = useRouter();

  useEffect(() => {
    if (showSidebar) setShowSidebar(false);
    if (showFooter) setShowFooter(true);
  }, [showSidebar, setShowSidebar, showFooter, setShowFooter]);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        router.push("/dashboard");
      }
    });
  }, [supabase.auth, router]);

  // TODO: Change to correct colors
  // TODO: Currently a bug where cannot resubmit after failed login. See https://github.com/supabase/auth-ui/pull/93
  // TODO: Email verification
  return (
    <div className="mx-auto grid h-full w-full max-w-md place-items-center p-6 ">
      <div className="w-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-7">
        <Auth
          supabaseClient={supabase}
          view="sign_up"
          appearance={{
            theme: AuthTheme,
            variables: {
              default: {
                colors: {
                  brand: "#526B45",
                  brandAccent: "001E05",
                },
              },
            },
          }}
          providers={["google"]}
        />
      </div>
    </div>
  );
}
