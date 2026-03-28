import { useCalls } from "../hooks/useCalls";
import { useUIStore } from "../store/uiStore";
import { CallItem } from "./Calltem";

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown error";
}

export function CallsList() {
  const { callsQuery } = useCalls();
  const selectedCallId = useUIStore((state) => state.selectedCallId);
  const setSelectedCallId = useUIStore((state) => state.setSelectedCallId);

  if (callsQuery.isPending) {
    return <div className="h-screen p-4">Loading calls...</div>;
  }

  if (callsQuery.isError) {
    return (
      <div className="h-screen p-4 text-red-700" role="alert">
        Failed to load calls: {getErrorMessage(callsQuery.error)}
      </div>
    );
  }

  const calls = callsQuery.data ?? [];
  if (calls.length === 0) {
    return <div className="h-screen p-4">No calls found.</div>;
  }

  return (
    <div className="h-screen overflow-auto">
      {calls.map((call) => (
        <CallItem
          key={call.id}
          call={call}
          isSelected={selectedCallId === call.id}
          onSelect={setSelectedCallId}
        />
      ))}
    </div>
  );
}
