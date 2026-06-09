import {
  ConnectStatus,
  updateConnectStatus,
  updatePlatformStatus,
} from "@/src/redux/reducers";
import { WebsocketService } from "@/src/services/payload_service";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

type PlatformStatus = {
  status: number[]; // your actual status array
};

type PlatformQueryResult<T> = {
  data?: T;
  isError: boolean;
  error?: unknown;
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

      const ws = WebsocketService.getInstance();
      const str = await ws.connect();
      console.log(`websocket connect result: ${str}`)
      return ws.queryStatus(id);
    },
    enabled: !!id,
    refetchInterval: interval,
    retry: false,
  });
};

export function useSyncPlatformStatus<T extends { status: any[] }>(
  id: string,
  query: PlatformQueryResult<T>,
) {
  const dispatch = useDispatch();

  // Keep connect status and platform status in sync from a single query lifecycle.
  useEffect(() => {
    if (query.isError) {
      console.error("useSyncPlatformStatus error:", { id, error: query.error });
      dispatch(updateConnectStatus({ id, status: ConnectStatus.DeviceDown }));
      return;
    }

    if (!query.data) return;

    dispatch(updateConnectStatus({ id, status: ConnectStatus.Online }));
    dispatch(
      updatePlatformStatus({
        id,
        status: query.data.status,
      }),
    );
  }, [query.isError, query.error, query.data, id, dispatch]);
}
