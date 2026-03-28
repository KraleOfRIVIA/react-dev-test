import { CallDetails } from "../components/CallDetails";
import { CallsList } from "../components/CallsList";
import { useSocket } from "../hooks/useSocket";

export const Dashboard = () => {
  useSocket();

  return (
    <main className="grid grid-cols-2">
      <CallsList />

      <CallDetails />
    </main>
  );
};
