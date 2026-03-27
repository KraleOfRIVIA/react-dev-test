export type CallStatus = "incoming" | "active" | "hold";

export type Call = {
  id: string;
  phone: string;
  status: CallStatus;
  duration: number;
  updatedAt: number;
};

export type UpdateCallStatusInput = {
  id: Call["id"];
  status: CallStatus;
};
