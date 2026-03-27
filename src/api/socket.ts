import type { Call } from "../types";

type Listener = (update: Partial<Call>) => void;

const listeners: Listener[] = [];
let socketTimer: ReturnType<typeof setInterval> | null = null;
let socketConnections = 0;

export function connectSocket() {
  socketConnections += 1;

  if (!socketTimer) {
    socketTimer = setInterval(() => {
      const callId = String(Math.floor(Math.random() * 1000));
      const update: Partial<Call> = {
        id: callId,
        status: Math.random() > 0.5 ? "active" : "hold",
        updatedAt: Date.now(),
      };

      for (const listener of listeners) {
        listener(update);
      }
    }, 1000);
  }

  return () => {
    socketConnections = Math.max(0, socketConnections - 1);

    if (socketConnections === 0 && socketTimer) {
      clearInterval(socketTimer);
      socketTimer = null;
    }
  };
}

export function subscribe(listener: Listener) {
  listeners.push(listener);

  return () => {
    const index = listeners.indexOf(listener);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  };
}
