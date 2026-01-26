import { combineReducers } from "redux";
import platformReducer, {
  ConnectStatus,
  PlatformDetails,
  removePlatformByID,
  setPlatformDetailsById,
  setSelectedPlatform,
  updateConnectStatus,
  updatePlatformStatus,
} from "./platform.slice";

export const rootReducer = combineReducers({
  platform: platformReducer,
});

export {
  ConnectStatus,
  PlatformDetails,
  platformReducer,
  removePlatformByID,
  setPlatformDetailsById,
  setSelectedPlatform,
  updateConnectStatus,
  updatePlatformStatus
};

