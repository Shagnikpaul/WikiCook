import { useQuery } from "@tanstack/react-query"
import { getMe } from "@/lib/auth"

export function useAuth() {
    return useQuery({
        queryKey: ["me"],
        queryFn: getMe,
        retry: false,
    })
}