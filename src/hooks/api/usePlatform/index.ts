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

      const ws = new WebsocketService();
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

export function useSyncPlatformStatus<T extends { status: any[] }>(
  id: string,
  query: PlatformQueryResult<T>,
) {
  const dispatch = useDispatch();

  // handle error → offline
  useEffect(() => {
    if (query.isError) {
      dispatch(updateConnectStatus({ id, status: ConnectStatus.DeviceDown }));
      return;
    }
    dispatch(updateConnectStatus({ id, status: ConnectStatus.Online }));
  }, [query.isError, id, dispatch]);

  // handle success → update status
  useEffect(() => {
    if (!query.data) return;

    dispatch(
      updatePlatformStatus({
        id,
        status: query.data.status,
      }),
    );
  }, [query.data, id, dispatch]);
}
