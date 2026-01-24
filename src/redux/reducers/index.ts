import { combineReducers } from "redux";
import platformReducer, {
  removePlatformByID,
  setPlatformDetailsById,
  setSelectedPlatform,
  updateDeviceStatus,
} from "./platform.slice";

export const rootReducer = combineReducers({
  platform: platformReducer,
});

export {
  platformReducer,
  removePlatformByID,
  setPlatformDetailsById,
  setSelectedPlatform,
  updateDeviceStatus
};

