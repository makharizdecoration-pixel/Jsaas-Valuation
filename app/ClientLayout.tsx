"use client"

import type { ReactNode } from "react";
import { Suspense } from "react";
import MouseTracker from "@/components/MouseTracker"; 
import { ThemeStyleInjector } from "@/components/logic/ThemeStyleInjector";

export default function ClientLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <ThemeStyleInjector />
      <MouseTracker />
      <Suspense fallback={null}>{children}</Suspense>
    </>
  )
}