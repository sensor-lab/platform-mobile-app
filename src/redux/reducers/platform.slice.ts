import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type PlatformDetails = {
  id: string;
  mdnsName: string;
  fwVersion: string;
  hardwareVersion: string;
  voltage: number;
  status: number[];
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

    updateDeviceStatus: (
      state,
      action: PayloadAction<{ id: string; status: number[] }>,
    ) => {
      const { id, status } = action.payload;

      if (!state.platformDetailsByID[id]) return;

      state.platformDetailsByID[id].status = status;
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
  updateDeviceStatus,
} = platformSlice.actions;

export default platformSlice.reducer;
