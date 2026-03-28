import { useMemo } from "react";
import { useUIStore } from "../store/uiStore";
import { useCalls } from "../hooks/useCalls";

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown error";
}

export function CallDetails() {
  const selectedCallId = useUIStore((state) => state.selectedCallId);
  const { callsQuery, updateStatus } = useCalls();

  const call = useMemo(() => {
    if (!selectedCallId || !callsQuery.data) {
      return null;
    }

    return callsQuery.data.find((currentCall) => currentCall.id === selectedCallId) ?? null;
  }, [callsQuery.data, selectedCallId]);

  if (!selectedCallId) {
    return (
      <div className="flex items-center justify-center">Select a call</div>
    );
  }

  if (callsQuery.isPending) {
    return <div className="flex items-center justify-center">Loading call...</div>;
  }

  if (callsQuery.isError) {
    return (
      <div className="flex items-center justify-center px-4 text-red-700" role="alert">
        Failed to load call details: {getErrorMessage(callsQuery.error)}
      </div>
    );
  }

  if (!call) {
    return (
      <div className="flex items-center justify-center px-4">
        Selected call is no longer available.
      </div>
    );
  }

  const isUpdatingSelectedCall =
    updateStatus.isPending && updateStatus.variables?.id === call.id;
  const hasSelectedCallMutationError =
    updateStatus.isError && updateStatus.variables?.id === call.id;
  const isHoldActionDisabled = isUpdatingSelectedCall || call.status === "hold";

  return (
    <div className="flex items-center justify-center">
      <div>
        <h2>{call.phone}</h2>
        <p>Status: {call.status}</p>

        <button
          disabled={isHoldActionDisabled}
          onClick={() => updateStatus.mutate({ id: call.id, status: "hold" })}
        >
          {isUpdatingSelectedCall ? "Updating..." : "Hold"}
        </button>

        {hasSelectedCallMutationError ? (
          <p className="text-red-700" role="alert">
            Failed to update status: {getErrorMessage(updateStatus.error)}
          </p>
        ) : null}
      </div>
    </div>
  );
}
