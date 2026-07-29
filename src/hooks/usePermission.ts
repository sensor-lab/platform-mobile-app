import { useCallback } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import {
    check,
    Permission,
    PERMISSIONS,
    request,
    RESULTS,
} from "react-native-permissions";

export type PermissionType = "wifi" | "location";

type UsePermissionResult = {
  checkAndRequestPermission: () => Promise<boolean>;
};

const getPlatformPermission = (permissionType: PermissionType): Permission => {
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

export const checkAndRequestPermission = async (
  permissionType: PermissionType,
): Promise<boolean> => {
  if (Platform.OS === "android") {
    const permission: any = getPlatformPermission(permissionType);

    const granted = await PermissionsAndroid.request(permission, {
      title: "Location Permission Required for Wi-Fi",
      message: "This app needs location permission to access current Wi-Fi SSID.",
      buttonPositive: "ALLOW",
      buttonNegative: "DENY",
    });

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }

  const permission = getPlatformPermission(permissionType);
  const status = await check(permission);

  if (status === RESULTS.GRANTED) return true;
  if (status === RESULTS.DENIED || status === RESULTS.LIMITED) {
    const result = await request(permission);
    return result === RESULTS.GRANTED;
  }

  return false;
};

export const usePermission = (
  permissionType: PermissionType,
): UsePermissionResult => {
  const checkPermission = useCallback(async (): Promise<boolean> => {
    return checkAndRequestPermission(permissionType);
  }, [permissionType]);

  return { checkAndRequestPermission: checkPermission };
};
