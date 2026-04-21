import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "https://planora-api.pixprocoder.com",
});

export const { signIn, signUp, useSession, signOut } = authClient;
