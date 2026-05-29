import { authClient } from "@/lib/auth-client";

export async function signOutAndRedirect(to = "/") {
  await authClient.signOut();

  if (typeof window !== "undefined") {
    window.location.assign(to);
  }
}
