import { memo } from "react";
import type { Call } from "../types";

type CallItemProps = {
  call: Call;
  isSelected: boolean;
  onSelect: (callId: Call["id"]) => void;
};

function CallItemComponent({ call, isSelected, onSelect }: CallItemProps) {
  return (
    <div
      onClick={() => onSelect(call.id)}
      className={`cursor-pointer border-b p-2 ${isSelected ? "bg-gray-100" : ""}`}
    >
      <div>{call.phone}</div>
      <div>{call.status}</div>
    </div>
  );
}

export const CallItem = memo(
  CallItemComponent,
  (prevProps, nextProps) =>
    prevProps.call === nextProps.call &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.onSelect === nextProps.onSelect,
);
