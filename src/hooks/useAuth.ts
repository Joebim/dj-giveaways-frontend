import { useMemo } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useProfile } from "./useAuthQuery";

export const useAuth = () => {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const shouldFetchProfile = isAuthenticated && !user;
  const {
    data: profile,
    isLoading: isProfileLoading,
    isFetching: isProfileFetching,
  } = useProfile({
    enabled: shouldFetchProfile,
  });

  const resolvedUser = useMemo(() => user ?? profile ?? null, [user, profile]);

  return {
    user: resolvedUser,
    isAuthenticated: Boolean(resolvedUser) && isAuthenticated,
    isLoading: isLoading || isProfileLoading || isProfileFetching,
  };
};
