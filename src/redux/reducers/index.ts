import { combineReducers } from "redux";
import printerReducer, {
  setError,
  setLoading,
  setScannedWifis,
  setSelectedPrinter,
  setSuccess,
  addConnectedPrinter,
  addScannedWifi,
  setCurrentConnectedPrinter,
  setPrinterDetailsByIp,
  removePrinterByIp,
} from "./printer.slice";

export const rootReducer = combineReducers({
  printer: printerReducer,
});

export {
  setError,
  setLoading,
  setScannedWifis,
  setSelectedPrinter,
  setSuccess,
  addConnectedPrinter,
  addScannedWifi,
  printerReducer,
  setCurrentConnectedPrinter,
  setPrinterDetailsByIp,
  removePrinterByIp,
};
