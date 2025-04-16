"use server"

import { signIn, signOut } from "@/app/lib/auth";

export async function handleAuth() {
  await signIn("google", {
    redirectTo: "/dashboard",
  })
}

export async function handleLogout() {
  await signOut({
    redirectTo: "/login",
  })
}