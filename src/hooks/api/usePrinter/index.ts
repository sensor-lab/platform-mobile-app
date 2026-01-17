import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
// import { fetchPrinterDetails } from "../../../services/printerServices";
import { store } from "../../../redux";
import { setPrinterDetailsByIp } from "../../../redux/reducers";

export const usePrinter = (
  ip,
  initialVar = null,
  interval: number | false = 5000,
) => {
  const dispatch = useDispatch();
  const { printerDetailsByIp } = useSelector((state: any) => state.printer);
  return useQuery({
    queryKey: ["printer-status", ip],
    queryFn: async () => {
      if (!ip) throw new Error("IP not set");

      try {
        // const result = await fetchPrinterDetails(ip, initialVar);
        const result = null;

        dispatch(setPrinterDetailsByIp({ ip, details: result }));
        return result;
      } catch (error) {
        // manually fetch the latest state in case user remove the printer during the request
        // and printerDetailsByIp may not get updated on time by redux.
        const printerDetails = store.getState().printer.printerDetailsByIp[ip];

        if (printerDetails) {
          dispatch(
            setPrinterDetailsByIp({
              ip,
              details: {
                Status: "Disconnected",
                statusCategory: "Disconnected",
                IP_Addr: ip,
              },
            }),
          );
        }
        throw new Error(error);
      }
    },
    enabled: !!ip,
    refetchInterval: interval,
    retry: false,
  });
};
