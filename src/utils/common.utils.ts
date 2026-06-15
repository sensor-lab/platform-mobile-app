import _ from "lodash"; // Import lodash library
import { Linking, NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { toast } from "./toast.utils";

const objectContainsKey = (
  object: Record<string | number, any>,
  key: number | string,
) => {
  return typeof object === "object" && object && object[key] !== undefined;
};

const handleScrollToBottom = (
  event: NativeSyntheticEvent<NativeScrollEvent>,
  onEndReached: () => void,
) => {
  const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
  const scrollThreshold = 0.9; // 10% before reaching the bottom
  if (
    contentOffset.y + layoutMeasurement.height >=
    scrollThreshold * contentSize.height
  ) {
    onEndReached();
  }
};

/**
 * Will convert an array of objects into an object with
 * desired value as the key, can optianlly add or delete
 * values from original object as well while converting.
 */
function getObjectByKeys(
  arr: Array<Record<string, any>>,
  key: string = "id",
  deleteKey: string | null = null,
  addKeys: Record<string, any> | null = null,
) {
  const obj: any = {};
  arr.forEach((val) => {
    obj[val[key]] = val;
    if (deleteKey) {
      delete obj[val[key]][deleteKey];
    }
    if (addKeys) {
      obj[val[key]] = {
        ...obj[val[key]],
        ...addKeys,
      };
    }
  });
  return obj;
}

/**
 * we can use Promise.allSettled as well but
 * due to less browser support added custom one.
 */
const promiseAllSettled = (promises: any) =>
  Promise.all(
    promises.map((p: any) =>
      p
        .then((value: any) => ({
          status: "fulfilled",
          value,
        }))
        .catch((reason: any) => ({
          status: "rejected",
          reason,
        })),
    ),
  );

const getGreeting = () => {
  const currentHour = new Date().getHours();

  if (currentHour >= 5 && currentHour < 12) {
    return "Good Morning 👋";
  } else if (currentHour >= 12 && currentHour < 17) {
    return "Good Afternoon ☀️";
  } else if (currentHour >= 17 && currentHour < 21) {
    return "Good Evening 🌇";
  } else {
    return "Good Night 🌙";
  }
};

const callNumber = (phoneNumber?: string) => {
  if (phoneNumber) {
    Linking.openURL(`tel:${phoneNumber}`);
  } else {
    toast.fail(`User does'nt have phone number`);
  }
};

const sendMail = (recipient?: string) => {
  if (recipient) {
    Linking.openURL(`mailto:${recipient}`);
  } else {
    toast.fail(`User does'nt have mail`);
  }
};

const sendMessage = (message?: string) => {
  if (message) {
    Linking.openURL(`sms:${message}`);
  } else {
    toast.fail(`User does'nt have phone number`);
  }
};

const parseVersion = (version?: string): number[] => {
    if (!version) return [];
    return version
        .replace(/^[vV]/, "")
        .split(/[^0-9]+/)
        .filter(Boolean)
        .map((part) => Number(part));
};

const compareVersions = (ver1?: string, ver2?: string): number => {
    const oneParts = parseVersion(ver1);
    const twoParts = parseVersion(ver2);
    const commonLength = Math.min(oneParts.length, twoParts.length);

    for (let i = 0; i < commonLength; i += 1) {
        const l = oneParts[i];
        const r = twoParts[i];
        if (l > r) return 1;
        if (l < r) return -1;
    }

    if (oneParts.length > twoParts.length) return 1;
    if (oneParts.length < twoParts.length) return -1;

    return 0;
};

const debouncedFunction = _.debounce((callback) => {
  callback(); // Call your function here
}, 700); // Adjust the debounce delay (in milliseconds) as needed

const generateFilledArray = (length: number): number[] => {
  return new Array(length).fill(1);
};

const emailRegex =
  /^[A-Za-z0-9._%+-]*[A-Za-z][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const fullNameRegex = /^[A-Za-z\s]+$/;
const isNumber = /^[0-9]+$/;
const isNumberWithDashed = /^[0-9-]+$/;
const ssnRegex = /^\d{3}-\d{2}-\d{4}$/;
const latLongRegex = /^-?\d{1,3}\.\d+,-?\d{1,3}\.\d+$/;

export default {
  objectContainsKey,
  handleScrollToBottom,
  getObjectByKeys,
  promiseAllSettled,
  callNumber,
  sendMail,
  sendMessage,
  getGreeting,
  generateFilledArray,
  compareVersions,
  debouncedFunction,
  emailRegex,
  fullNameRegex,
  isNumber,
  isNumberWithDashed,
  ssnRegex,
  latLongRegex,
};
