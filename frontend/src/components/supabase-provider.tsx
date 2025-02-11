"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

import type { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Session } from "@supabase/supabase-js";

import { User, updateUser } from "../db/users";
import { selectUser } from "../db/users";
import { createClient } from "../utils/supabase-browser";

type SupabaseContext = {
  supabase: SupabaseClient;
  session: Session | null;
  calendarToken: string;
  loggedIn: boolean;
  user: User | null;
};

const Context = createContext<SupabaseContext | undefined>(undefined);

const MINUTE_MS = 60 * 1000;

export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createClient());
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [calendarToken, setCalendarToken] = useState(null);
  const [tokenExpiry, setTokenExpiry] = useState(null);

  const loggedIn = session !== null;

  // update current session
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data?.session ?? null);
    });

    supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      if (event === "SIGNED_OUT") {
        setUser(null);
        setRefreshToken(null);
        setCalendarToken(null);
        setTokenExpiry(null);
      }
    });
  }, [supabase]);

  // fetch user data
  useEffect(() => {
    if (!supabase || !session) return;
    if (!user || !(session.user?.id == user?.user_id)) {
      const fetchUser = async () => {
        const currUser = await selectUser(supabase, session);
        setUser(currUser);
        // TODO: validate refresh token here
        if (currUser?.gcal_auth_token) {
          setRefreshToken(currUser.gcal_auth_token);
        }
      };

      fetchUser();
    }
  }, [supabase, session, user]);

  // store calendar and refresh tokens from session
  useEffect(() => {
    if (!supabase || !session || !user) return;
    const updateTokens = async () => {
      setRefreshToken(session.provider_refresh_token);
      await updateUser(supabase, {
        user_id: user.user_id,
        gcal_auth_token: session.provider_refresh_token,
      });
    };

    // TODO: validate refresh token here
    if (session?.provider_refresh_token) {
      updateTokens();
    }
  }, [supabase, session, user]);

  // get calendar token from refresh token
  useEffect(() => {
    const updateToken = async (refreshToken) => {
      if (refreshToken) {
        if (!calendarToken || tokenExpiry - Date.now() < 300 * 1000) {
          console.log("refreshing calendar token");
          const response = await fetch("/api/auth-calendar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          });
          const data = await response.json();
          const token = data.access_token;
          const expiry = new Date().getTime() + data.expires_in * 1000;
          setCalendarToken(token);
          setTokenExpiry(expiry);
        }
      }
    };

    // refresh calendar token every minute
    const interval = setInterval(() => {
      updateToken(refreshToken);
    }, MINUTE_MS);

    // get initial calendar token
    updateToken(refreshToken);

    return () => clearInterval(interval);
  }, [refreshToken, calendarToken, tokenExpiry]);

  console.log(session, user, refreshToken, calendarToken, tokenExpiry);

  return (
    <Context.Provider
      value={{
        supabase,
        session,
        calendarToken,
        loggedIn,
        user,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export const useSupabase = () => {
  let context = useContext(Context);
  if (context === undefined) {
    throw new Error("useSupabase must be used inside SupabaseProvider");
  } else {
    return context;
  }
};
