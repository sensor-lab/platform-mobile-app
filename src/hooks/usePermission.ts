import { useCallback } from "react";
import { Platform, PermissionsAndroid } from "react-native";
import {
  check,
  request,
  RESULTS,
  Permission,
  PERMISSIONS,
} from "react-native-permissions";

type PermissionType = "wifi" | "location";

type UsePermissionResult = {
  checkAndRequestPermission: () => Promise<boolean>;
};

export const usePermission = (
  permissionType: PermissionType
): UsePermissionResult => {
  const getPlatformPermission = (): Permission => {
    switch (permissionType) {
      case "wifi":
      case "location":
        return Platform.select({
          ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
          android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        })!;
      default:
        throw new Error(`Unsupported permission type: ${permissionType}`);
    }
  };

  const checkAndRequestPermission = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === "android") {
      const permission: any = getPlatformPermission();

      const granted = await PermissionsAndroid.request(permission, {
        title: "Location Permission Required for Wi-Fi",
        message:
          "This app needs location permission to access current Wi-Fi SSID.",
        buttonPositive: "ALLOW",
        buttonNegative: "DENY",
      });

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      const permission = getPlatformPermission();
      const status = await check(permission);

      if (status === RESULTS.GRANTED) return true;
      if (status === RESULTS.DENIED || status === RESULTS.LIMITED) {
        const result = await request(permission);
        return result === RESULTS.GRANTED;
      }

      return false;
    }
  }, [permissionType]);

  return { checkAndRequestPermission };
};
