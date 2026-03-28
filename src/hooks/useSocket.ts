import { useEffect } from "react";
import { subscribe, connectSocket } from "../api/socket";
import { useQueryClient } from "@tanstack/react-query";
import type { Call } from "../types";
import { CALLS_QUERY_KEY } from "./useCalls";

export function useSocket() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const disconnectSocket = connectSocket();
    const unsubscribe = subscribe((update: Partial<Call>) => {
      if (!update.id) {
        return;
      }

      queryClient.setQueryData<Call[]>(CALLS_QUERY_KEY, (calls) => {
        if (!calls) {
          return calls;
        }

        return calls.map((call) =>
          call.id === update.id ? { ...call, ...update } : call,
        );
      });
    });

    return () => {
      unsubscribe();
      disconnectSocket();
    };
  }, [queryClient]);
}
