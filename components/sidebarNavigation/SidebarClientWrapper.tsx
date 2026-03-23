"use client";

import dynamic from "next/dynamic";

const SidebarNavigation = dynamic(
  () => import("./sidebarNavigation"),
  { ssr: false }
);

export default function SidebarClientWrapper() {
  return <SidebarNavigation />;
}
