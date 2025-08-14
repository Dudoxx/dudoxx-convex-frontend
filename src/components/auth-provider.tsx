"use client";

import { ReactNode } from "react";

// Secure authentication provider - no client-side Convex connections
export function AuthProvider({ children }: { children: ReactNode }) {
  // All authentication is handled through Next.js API routes
  // No direct client-to-Convex connections for security
  return <>{children}</>;
}