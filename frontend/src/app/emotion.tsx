"use client";

import resolveConfig from "tailwindcss/resolveConfig";

import { useServerInsertedHTML } from "next/navigation";

import { CacheProvider } from "@emotion/react";
import { MantineProvider, useEmotionCache } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";

import tailwindConfig from "../../tailwind.config";

// Grabs the full Tailwind CSS object
const fullConfig = resolveConfig(tailwindConfig);

const mantineColors: {
  [k: string]: [string, string, string, string, string, string, string, string, string, string];
} = Object.fromEntries(
  Object.entries(fullConfig.theme.colors)
    .filter(([k, v]) => typeof v !== "string")
    .map(([k, v]) => [
      k,
      [v[50], v[100], v[200], v[300], v[400], v[500], v[600], v[700], v[800], v[900]],
    ])
);

export default function RootStyleRegistry({ children }: { children: React.ReactNode }) {
  const cache = useEmotionCache();
  cache.compat = true;

  useServerInsertedHTML(() => (
    <style
      data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(" ")}`}
      dangerouslySetInnerHTML={{
        __html: Object.values(cache.inserted).join(" "),
      }}
    />
  ));

  return (
    <CacheProvider value={cache}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          primaryShade: 5,
          colors: {
            ...mantineColors,
          },
        }}
      >
        <NotificationsProvider containerWidth={300}>{children}</NotificationsProvider>
      </MantineProvider>
    </CacheProvider>
  );
}
