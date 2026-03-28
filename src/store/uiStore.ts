import { create } from "zustand";
import type { Call } from "../types";

type UIState = {
  selectedCallId: Call["id"] | null;
  setSelectedCallId: (callId: Call["id"] | null) => void;
};

export const useUIStore = create<UIState>((set) => ({
  selectedCallId: null,

  setSelectedCallId: (callId) => set({ selectedCallId: callId }),
}));
