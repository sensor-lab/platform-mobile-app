import { WebsocketService } from "@/src/services/payload_service";
import { useQuery } from "@tanstack/react-query";

type PlatformStatus = {
  status: number[]; // your actual status array
};

export const usePlatform = (
  id: string,
  initialVar = null,
  interval: number | false = 120000,
) => {
  return useQuery<PlatformStatus>({
    queryKey: ["platform-status", id],
    queryFn: async () => {
      if (!id) throw new Error("Invalid ID to query cloud");

      const url = "wss://iot.sensorsparks.com:8080/testapi";
      const ws = new WebsocketService(url);
      try {
        await ws.connect();
        const status = await ws.queryStatus(id);
        return status;
      } finally {
        ws.close();
      }
    },
    enabled: !!id,
    refetchInterval: interval,
    retry: false,
  });
};
