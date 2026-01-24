import { removePlatformByID, updateDeviceStatus } from "@/src/redux/reducers";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { useDispatch } from "react-redux";
import { CustomImage, Text } from "../../../../components";
import { Images } from "../../../../config";
import { usePlatform, useTheme } from "../../../../hooks";
import { styles } from "./styles";

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
  const { id, mdnsName, status } = data;
  const dispatch = useDispatch();
  const [isDisconnected, setIsDisconnected] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const queryPlatform = usePlatform(id, status);
  const handleNavigation = () => {
    setShowRemoveButton(null);
    // navigation.navigate(ScreenNames.PrinterSettingScreen, { IP_Address });
  };

  useEffect(() => {
    if (queryPlatform.isError) {
      // cannot reach to device
      setIsDisconnected(true);
      return;
    } else {
      setIsDisconnected(false);
    }

    if (!queryPlatform.data) return;
    dispatch(
      updateDeviceStatus({
        id,
        status: queryPlatform.data.status,
      }),
    );
  }, [queryPlatform.data, queryPlatform.isError, id, dispatch]);

  const handleRemovePlatform = () => {
    dispatch(removePlatformByID(id));
  };

  // TODO: better parse status array
  const { colorOnStatusChange, statusName } = isDisconnected
    ? { colorOnStatusChange: AppTheme.fontGray, statusName: "离线" }
    : status.length == 0
      ? { colorOnStatusChange: AppTheme.lightGreen, statusName: "正常" }
      : status.length == 1
        ? { colorOnStatusChange: AppTheme.Yellow, statusName: "警告" }
        : status.length == 2
          ? { colorOnStatusChange: AppTheme.Red, statusName: "错误" }
          : { colorOnStatusChange: AppTheme.fontGray, statusName: "未知" };

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
          <CustomImage source={Images.platform} style={styles.deviceImage} />
        </View>
        <View style={styles.textView}>
          <Text
            bold
            size={12}
            color={isDisconnected ? AppTheme.fontGray : AppTheme.Black}
            style={{ textTransform: "uppercase" }}
          >
            {mdnsName}
          </Text>
          <Text regular size={10} color={AppTheme.fontGray}>
            {/* {subTitlel} */}
            {id}
          </Text>
        </View>
        <View style={styles.statusView}>
          <Text bold size={10} color={AppTheme.Black} centered>
            平台状态
          </Text>
          <Text regular size={10} color={colorOnStatusChange} centered>
            {/* {Status} */}
            {statusName}
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
            {statusName == "离线" ? "未连接" : "已连接"}
          </Text>
        </View>
        <Pressable onPress={() => setShowRemoveButton(id)}>
          <CustomImage
            source={Images.verticalDots}
            style={styles.verticalDots}
          />
        </Pressable>
      </Pressable>
      {showRemoveButton == id && (
        <RemoveComp handleRemove={handleRemovePlatform} />
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
