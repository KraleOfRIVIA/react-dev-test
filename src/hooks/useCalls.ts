import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCalls, updateCallStatus } from "../api/calls";
import type { Call, UpdateCallStatusInput } from "../types";

export const CALLS_QUERY_KEY = ["calls"] as const;

type UpdateCallStatusContext = {
  previousCalls?: Call[];
};

export function useCalls() {
  const queryClient = useQueryClient();

  const callsQuery = useQuery<Call[], Error>({
    queryKey: CALLS_QUERY_KEY,
    queryFn: fetchCalls,
    refetchOnWindowFocus: false,
  });

  const updateStatus = useMutation<
    Call,
    Error,
    UpdateCallStatusInput,
    UpdateCallStatusContext
  >({
    mutationFn: ({ id, status }) => updateCallStatus(id, status),

    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: CALLS_QUERY_KEY });

      const previousCalls = queryClient.getQueryData<Call[]>(CALLS_QUERY_KEY);
      if (!previousCalls) {
        return { previousCalls };
      }

      queryClient.setQueryData<Call[]>(CALLS_QUERY_KEY, (calls) =>
        calls?.map((call) =>
          call.id === id ? { ...call, status } : call,
        ) ?? [],
      );

      return { previousCalls };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousCalls) {
        queryClient.setQueryData<Call[]>(CALLS_QUERY_KEY, context.previousCalls);
      }
    },

    onSuccess: (updatedCall) => {
      queryClient.setQueryData<Call[]>(CALLS_QUERY_KEY, (calls) => {
        if (!calls) {
          return calls;
        }

        return calls.map((call) =>
          call.id === updatedCall.id ? { ...call, ...updatedCall } : call,
        );
      });
    },
  });

  return { callsQuery, updateStatus };
}
