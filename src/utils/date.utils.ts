import moment from "moment";
import { toast } from "./toast.utils";
export enum apiDateTimeFormat {
  ISODate = "YYYY-MM-DD",
  TimeWithOutSeconds = "LT",
  ClientDate = "MM/DD/YYYY",
  ReverseDate = "YYYY/MM/DD",
  DateTimeDuration = "YYYY-DD-MM  H:mm:ss",
  DateTimeDurationWithoutSeconds = "YYYY-MM-DD  HH:mm",
  DateTimeApiBody = "MM/DD/YYYY HH:mm:ss",
  HoursTime = "h:mm a",
  Hours24 = "HH:mm",
}

// const getDateTimeFormat = (date: Date | string, format?: apiDateTimeFormat) => {
//   const effectiveFormat =
//     format ?? apiDateTimeFormat.ClientDate ?? apiDateTimeFormat;
//   return moment(date).format(effectiveFormat);
// };
const getDateTimeFormat = (date: Date | string, format?: apiDateTimeFormat) => {
  const effectiveFormat = format ?? apiDateTimeFormat.ClientDate;
  return moment(date).format(effectiveFormat)?.toString();
};

export const formatedDateTime = (date: Date, time: Date) => {
  return (
    getDateTimeFormat(date, apiDateTimeFormat["ISODate"]) +
    " " +
    getDateTimeFormat(time, apiDateTimeFormat["Hours24"])
  );
};

export const timeHumanize = (time: string): string => {
  const now = moment();
  const thatTime = moment(time);

  // Calculate the difference in various time units
  const diffInSeconds = now.diff(thatTime, "seconds");
  const diffInMinutes = now.diff(thatTime, "minutes");
  const diffInHours = now.diff(thatTime, "hours");
  const diffInDays = now.diff(thatTime, "days");
  const diffInMonths = now.diff(thatTime, "months");
  const diffInYears = now.diff(thatTime, "years");

  // Handle different time ranges
  if (diffInSeconds < 60) {
    return `just now`;
  } else if (diffInMinutes < 60) {
    return diffInMinutes === 1
      ? "1 minute ago"
      : `${diffInMinutes} minutes ago`;
  } else if (diffInHours < 24) {
    return diffInHours === 1 ? "1 hour ago" : `${diffInHours} hours ago`;
  } else if (diffInDays < 30) {
    return diffInDays === 1 ? "1 day ago" : `${diffInDays} days ago`;
  } else if (diffInMonths < 12) {
    return diffInMonths === 1 ? "1 month ago" : `${diffInMonths} months ago`;
  } else {
    return diffInYears === 1 ? "1 year ago" : `${diffInYears} years ago`;
  }
};

const generateTimerArray = () => {
  const timerArray = [];
  for (let i = 0; i < 24; i++) {
    let firstNum = i > 9 ? "" : "0";
    timerArray?.push({ id: Math.random() + 1, label: `${firstNum}${i}:00` });
    timerArray?.push({ id: Math.random() + 2, label: `${firstNum}${i}:15` });
    timerArray?.push({ id: Math.random() + 3, label: `${firstNum}${i}:30` });
    timerArray?.push({ id: Math.random() + 4, label: `${firstNum}${i}:45` });
  }
  return timerArray;
};

export const getMinutesDifference = (
  startDate?: string,
  endDate?: string
): number => {
  const start = moment(startDate, "YYYY-MM-DD HH:mm");
  const end = moment(endDate, "YYYY-MM-DD HH:mm");

  if (!start.isValid() || !end.isValid()) {
    throw new Error("Invalid date format");
  }

  return end.diff(start, "minutes"); // Get difference in minutes
};

export const formatMinutesToHHMM = (minutes: number): string => {
  if (minutes < 0) {
    // throw new Error('Minutes cannot be negative');
    toast.fail("Minutes cannot be negative");
    return "";
  }

  // Alert.alert('Test minutes', `${minutes}`);

  // Alert.alert(
  //   'minutes',
  //   `${moment
  //     .utc(minutes * 60 * 1000)
  //     .format('HH:mm')
  //     ?.toString()}`,
  // );

  return moment
    .utc(minutes * 60 * 1000)
    .format("HH:mm")
    ?.toString();
};

export default {
  getDateTimeFormat,
  apiDateTimeFormat,
  generateTimerArray,
  getMinutesDifference,
  formatMinutesToHHMM,
};
