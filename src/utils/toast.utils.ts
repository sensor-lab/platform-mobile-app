// import Snackbar from 'react-native-snackbar';
// import {
//   ToastPosition,
//   toast as toasts,
// } from '@backpackapp-io/react-native-toast';
// import {ThemeColors} from '../styles';
import Toast from "react-native-toast-message";
import { Alert } from "react-native";

// function successSnack(message: string) {
//   Snackbar.show({
//     text: message || 'Success',
//     duration: Snackbar.LENGTH_LONG,
//     backgroundColor: '#00AC28',
//   });
// }

// function failSnack(message: string) {
//   Snackbar.show({
//     text: message || 'Error',
//     duration: Snackbar.LENGTH_LONG,
//     backgroundColor: ThemeColors.Red,
//   });
// }

// function infoSnack(message: string) {
//   Snackbar.show({
//     text: message || 'Info',
//     duration: Snackbar.LENGTH_LONG,
//     backgroundColor: ThemeColors.Primary,
//   });
// }

function success(message: string) {
  Toast.show({
    type: "success",
    text1: message || "Success",
    position: "top",
    visibilityTime: 10000,
    topOffset: 30,
    autoHide: true,
  });
}

function fail(
  message: string,
  message2?: string,
  isAlert?: boolean,
  alertTitle?: string
) {
  if (isAlert) {
    Alert.alert(
      alertTitle ? `Error (${alertTitle})` : "Error",
      message || "Something Went Wrong"
    );
  } else {
    Toast.show({
      type: "error",
      text1: message || "Error",
      text2: message2,
      position: "top",
      visibilityTime: 10000,
      topOffset: 30,
      autoHide: true,
    });
  }
}

function info(message: string) {
  Toast.show({
    type: "info",
    text1: message || "Info",
    position: "top",
    visibilityTime: 2000,
    topOffset: 30,
    autoHide: true,
  });
}

export const toast = {
  success,
  fail,
  info,
  // successSnack,
  // failSnack,
  // infoSnack,
};
