import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum ConnectStatus {
  Online = "online",
  DeviceDown = "devicedown",
  CloudServerDown = "serverdown",
}

export type PlatformDetails = {
  id: string;
  mdnsName: string;
  fwVersion: string;
  hardwareVersion: string;
  voltage: number;
  platformStatus: number[];
  connectStatus: ConnectStatus;
};

export type PlatformStateType = {
  selectedPlatform: string | null;
  platformDetailsByID: Record<string, PlatformDetails>;
};

const initialState: PlatformStateType = {
  selectedPlatform: null,
  platformDetailsByID: {},
};

const platformSlice = createSlice({
  name: "platform",
  initialState,
  reducers: {
    setPlatformDetailsById: (
      state,
      action: PayloadAction<{ id: string; details: PlatformDetails }>,
    ) => {
      const { id, details } = action.payload;
      state.platformDetailsByID[id] = {
        ...state.platformDetailsByID[id],
        ...details,
      };
    },

    setSelectedPlatform: (state, action: PayloadAction<string>) => {
      state.selectedPlatform = action.payload;
    },

    updatePlatformStatus: (
      state,
      action: PayloadAction<{ id: string; status: number[] }>,
    ) => {
      const { id, status } = action.payload;

      if (!state.platformDetailsByID[id]) return;

      state.platformDetailsByID[id].platformStatus = status;
    },

    updateConnectStatus: (
      state,
      action: PayloadAction<{ id: string; status: ConnectStatus }>,
    ) => {
      const { id, status } = action.payload;
      if (!state.platformDetailsByID[id]) return;
      state.platformDetailsByID[id].connectStatus = status;
    },

    removePlatformByID: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.platformDetailsByID && state.platformDetailsByID[id]) {
        delete state.platformDetailsByID[id];
      }
    },
  },
});

export const {
  setPlatformDetailsById,
  setSelectedPlatform,
  removePlatformByID,
  updatePlatformStatus,
  updateConnectStatus,
} = platformSlice.actions;

export default platformSlice.reducer;
