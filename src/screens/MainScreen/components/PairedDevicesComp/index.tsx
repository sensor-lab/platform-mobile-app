import { CustomImage, Text } from "@/src/components";
import { Images, ScreenNames } from "@/src/config";
import { usePlatform, useSyncPlatformStatus, useTheme } from "@/src/hooks";
import {
    ConnectStatus,
    PlatformDetails,
    removePlatformByID,
} from "@/src/redux/reducers";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Pressable, View } from "react-native";
import { useDispatch } from "react-redux";
import { styles } from "./styles";

const PairedDevicesComp = ({
  data,
  showRemoveButton,
  setShowRemoveButton,
}: {
  data: PlatformDetails;
  showRemoveButton: any;
  setShowRemoveButton: any;
}) => {
  const { AppTheme } = useTheme();
  const { id, mdnsName, platformStatus, connectStatus } = data;
  const dispatch = useDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const handleNavigation = () => {
    setShowRemoveButton(null);
    navigation.navigate(ScreenNames.PlatformSettingScreen, { id });
  };

  const queryPlatform = usePlatform(id);
  useSyncPlatformStatus(id, {
    data: queryPlatform.data,
    isError: queryPlatform.isError,
  });

  const handleRemovePlatform = () => {
    dispatch(removePlatformByID(id));
  };

  const { colorOnStatusChange, statusName } =
    connectStatus == ConnectStatus.DeviceDown
      ? { colorOnStatusChange: AppTheme.fontGray, statusName: "设备离线" }
      : connectStatus == ConnectStatus.CloudServerDown
        ? { colorOnStatusChange: AppTheme.fontGray, statusName: "服务器异常" }
        : platformStatus.length == 0
          ? { colorOnStatusChange: AppTheme.lightGreen, statusName: "正常" }
          : platformStatus.length == 1
            ? { colorOnStatusChange: AppTheme.Yellow, statusName: "警告" }
            : platformStatus.length == 2
              ? { colorOnStatusChange: AppTheme.Red, statusName: "错误" }
              : { colorOnStatusChange: AppTheme.fontGray, statusName: "未知" };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: AppTheme.White,
          opacity: connectStatus != ConnectStatus.Online ? 0.6 : 1,
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
            color={
              connectStatus != ConnectStatus.Online
                ? AppTheme.fontGray
                : AppTheme.Black
            }
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
            color={
              connectStatus != ConnectStatus.Online
                ? AppTheme.fontGray
                : AppTheme.Black
            }
            centered
          >
            {/* {connected} */}
            {/* {Status ? "Connected" : "Disconnected"} */}
            {connectStatus == ConnectStatus.Online ? "已连接" : "未连接"}
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
