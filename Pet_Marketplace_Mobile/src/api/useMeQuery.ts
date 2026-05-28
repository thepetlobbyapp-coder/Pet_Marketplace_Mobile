import { useQuery } from "@tanstack/react-query";
import { getMe } from "./client";
import type { MeResponse } from "./types";
import { useAuth } from "../auth/AuthProvider";

export function meQueryKey(userId?: string) {
  return ["me", userId] as const;
}

export function useMeQuery() {
  const { accessToken, session } = useAuth();
  const userId = session?.user.id;

  return useQuery({
    enabled: Boolean(accessToken),
    queryKey: meQueryKey(userId),
    queryFn: () => getMe(accessToken),
    retry: 1,
  });
}

export function hasTutorProfile(me?: MeResponse | null): boolean {
  return Boolean(me?.roles.includes("tutor") && me.profiles?.tutor);
}

export function hasProviderProfile(me?: MeResponse | null): boolean {
  return Boolean(me?.roles.includes("provider") && me.profiles?.provider);
}
