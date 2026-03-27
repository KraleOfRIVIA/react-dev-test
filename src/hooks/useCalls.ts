import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCalls, updateCallStatus } from "../api/calls";
import type { Call, UpdateCallStatusInput } from "../types";

export const CALLS_QUERY_KEY = ["calls"] as const;

type UpdateCallStatusContext = {
  optimisticStatus: Call["status"];
  previousCall?: Call;
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
    mutationKey: ["update-call-status"],
    mutationFn: ({ id, status }) => updateCallStatus(id, status),

    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: CALLS_QUERY_KEY });

      const previousCall = queryClient
        .getQueryData<Call[]>(CALLS_QUERY_KEY)
        ?.find((call) => call.id === id);

      queryClient.setQueryData<Call[]>(CALLS_QUERY_KEY, (calls) =>
        calls?.map((call) => (call.id === id ? { ...call, status } : call)) ?? calls,
      );

      return { previousCall, optimisticStatus: status };
    },

    onError: async (_error, variables, context) => {
      if (context?.previousCall) {
        const { previousCall } = context;

        queryClient.setQueryData<Call[]>(CALLS_QUERY_KEY, (calls) => {
          if (!calls) {
            return calls;
          }

          return calls.map((call) => {
            if (call.id !== variables.id) {
              return call;
            }

            const canRollbackOptimisticState =
              call.status === context.optimisticStatus &&
              call.updatedAt === previousCall.updatedAt;

            return canRollbackOptimisticState ? previousCall : call;
          });
        });
      }

      await queryClient.invalidateQueries({ queryKey: CALLS_QUERY_KEY });
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
