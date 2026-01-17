import React, { useState } from "react";
import { AppContext } from "./AppContext";

// Create the provider component
export const AppProvider: React.FC = ({ children }) => {
  const [connectedPrinters, setConnectedPrintersState] = useState<any[]>([]);
  const [scannedWifis, setScannedWifisState] = useState<any[]>([]);

  // Functions to update the state
  const setConnectedPrinters = (printers: any[]) => {
    setConnectedPrintersState(printers); // Update the state for connected printers
  };

  const setScannedWifis = (wifis: any[]) => {
    setScannedWifisState(wifis); // Update the state for scanned WiFi networks
  };

  return (
    <AppContext.Provider
      value={{
        connectedPrinters,
        setConnectedPrinters,
        scannedWifis,
        setScannedWifis,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
