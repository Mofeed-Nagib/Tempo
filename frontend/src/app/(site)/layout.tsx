"use client";

import { useState } from "react";

import { AppShell } from "@mantine/core";

import Sidebar from "./dashboard/sidebar";
import Footer from "./footer";
import LayoutProvider from "./layoutContext";
import Navbar from "./navbar";

export default function Layout({ children }) {
  const [sidebar, setSidebar] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showFooter, setShowFooter] = useState(true);

  return (
    <LayoutProvider
      sidebar={sidebar}
      setSidebar={setSidebar}
      showSidebar={showSidebar}
      setShowSidebar={setShowSidebar}
      showFooter={showFooter}
      setShowFooter={setShowFooter}
    >
      <AppShell
        header={<Navbar />}
        footer={showFooter && <Footer />}
        navbar={showSidebar && <Sidebar />}
        classNames={{ main: "bg-paper" }}
      >
        {children}
      </AppShell>
    </LayoutProvider>
  );
}
