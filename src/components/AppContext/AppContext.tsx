import React, { createContext, useContext, useState } from "react";

// Define the context type
type AppContextType = {
  connectedPrinters: any[];
  scannedWifis: any[];
  setConnectedPrinters: (printers: any[]) => void;
  setScannedWifis: (wifis: any[]) => void;
};

// Create the context with a default value (undefined here)
export const AppContext = createContext<AppContextType | undefined>(undefined);

// Custom hook to access the context easily
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
