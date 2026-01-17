import { Pressable, View } from "react-native";
import { CustomImage, Text } from "../../../../components";
import { styles } from "./styles";
import { Images, ScreenNames } from "../../../../config";
import { usePrinter, useTheme } from "../../../../hooks";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  base64ToArrayBuffer,
  bin2String,
  converBase64Obj,
  decodeIpFromBase64,
} from "../../../../utils/ble.util";
import { store } from "../../../../redux";
import { getPrinterStatus } from "../../../../api";
import { useDispatch } from "react-redux";
import { removePrinterByIp } from "../../../../redux/reducers";
type propsObj = {
  id: number;
  title: string;
  subTitlel: string;
  status: string;
  connected: string;
};

const PairedDevicesComp = ({
  data,
  showRemoveButton,
  setShowRemoveButton,
}: {
  data: any;
  showRemoveButton: any;
  setShowRemoveButton: any;
}) => {
  const { AppTheme } = useTheme();
  const { HostName, Status, statusCategory, IP_Address } = data;
  const dispatch = useDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  usePrinter(IP_Address, ["Status"]);
  const handleNavigation = () => {
    setShowRemoveButton(null);
    navigation.navigate(ScreenNames.PrinterSettingScreen, { IP_Address });
  };

  // hideShowRemoreButton(setShowRemoveBtn);

  const handleRemovePrinter = () => {
    dispatch(removePrinterByIp(IP_Address));
  };

  const colorOnStatusChange =
    statusCategory == "OK"
      ? AppTheme.lightGreen
      : statusCategory == "WARNING"
      ? AppTheme.Yellow
      : statusCategory == "ERROR"
      ? AppTheme.Red
      : AppTheme.fontGray;

  let isDisconnected = statusCategory == "Disconnected";

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: AppTheme.White,
          opacity: isDisconnected ? 0.6 : 1,
          // opacity: 0.2,
        },
      ]}
    >
      <Pressable
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            // opacity: status == "Ready" ? 1 : 0.5,
          },
        ]}
        onPress={handleNavigation}
      >
        <View
          style={[
            styles.deviceImageView,
            { backgroundColor: AppTheme.skyBlue },
          ]}
        >
          <CustomImage source={Images.printer2} style={styles.deviceImage} />
        </View>
        <View style={styles.textView}>
          <Text
            bold
            size={12}
            color={isDisconnected ? AppTheme.fontGray : AppTheme.Black}
            style={{ textTransform: "uppercase" }}
          >
            {HostName}
          </Text>
          <Text regular size={10} color={AppTheme.fontGray}>
            {/* {subTitlel} */}
            Cognitive Printers
          </Text>
        </View>
        <View style={styles.statusView}>
          <Text bold size={10} color={AppTheme.Black} centered>
            Status
          </Text>
          <Text regular size={10} color={colorOnStatusChange} centered>
            {Status}
          </Text>
        </View>
        <View>
          {/* <Text bold size={10} color={AppTheme.Black}>
          Connected
          </Text> */}
          <Text
            bold
            size={10}
            color={isDisconnected ? AppTheme.fontGray : AppTheme.Black}
            centered
          >
            {/* {connected} */}
            {/* {Status ? "Connected" : "Disconnected"} */}
            {statusCategory == "Disconnected" ? "Disconnected" : "Connected"}
          </Text>
        </View>
        <Pressable onPress={() => setShowRemoveButton(IP_Address)}>
          <CustomImage
            source={Images.verticalDots}
            style={styles.verticalDots}
          />
        </Pressable>
      </Pressable>
      {showRemoveButton == IP_Address && (
        <RemoveComp handleRemove={handleRemovePrinter} />
      )}
    </View>
  );
};

const RemoveComp = ({ handleRemove }) => {
  const { AppTheme } = useTheme();
  return (
    <Pressable style={styles.removeCompContainer} onPress={handleRemove}>
      <CustomImage
        source={Images.bin}
        style={[styles.binIcon, { backgroundColor: "#FFFFFF" }]}
      />
      <Text regular size={12}>
        Remove
      </Text>
    </Pressable>
  );
};

export default PairedDevicesComp;
