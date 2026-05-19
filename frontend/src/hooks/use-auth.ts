import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/lib/auth/auth";

export function useAuth() {
    return useQuery({
        queryKey: ["me"],
        queryFn: getMe,
        retry: false,
        staleTime: 1000 * 60 * 5,

        // IMPORTANT: normalize failure into null
        select: (data) => data ?? null,
    });
}