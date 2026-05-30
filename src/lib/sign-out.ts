export async function signOutAndRedirect(to = "/") {
  // NOTE: authClient.signOut() POSTs an empty body with a JSON content-type,
  // which the better-auth / srvx adapter fails to parse ("Unexpected end of
  // JSON input") and returns 500 — so the session is never cleared. Hit the
  // endpoint directly with a valid `{}` body, which clears the cookie reliably.
  try {
    await fetch("/api/auth/sign-out", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
      credentials: "same-origin",
    });
  } catch {
    // ignore network errors — we still redirect so the user lands signed-out
  }

  if (typeof window !== "undefined") {
    window.location.assign(to);
  }
}
