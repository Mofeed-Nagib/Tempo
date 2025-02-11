"use client";

import React, { createContext, useContext } from "react";

type LayoutContext = {
  sidebar: number;
  setSidebar: (sidebar: number) => void;
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
  showFooter: boolean;
  setShowFooter: (show: boolean) => void;
};

type LayoutProviderProps = LayoutContext & {
  children: React.ReactNode;
};

const Context = createContext<LayoutContext | undefined>(undefined);

export default function LayoutProvider({ children, ...contextProps }: LayoutProviderProps) {
  return <Context.Provider value={contextProps}>{children}</Context.Provider>;
}

export const useLayout = () => {
  let context = useContext(Context);
  if (context === undefined) {
    throw new Error("useLayout must be used inside LayoutProvider");
  } else {
    return context;
  }
};
