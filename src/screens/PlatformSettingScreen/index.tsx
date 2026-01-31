import {
  CustomDropdown,
  CustomImage,
  CustomModal,
  CustomTouchable,
  Loader,
  MainContainer,
  MainHeader,
  PrimaryButton,
  SectionContainer,
  Text,
} from "@/src/components";
import { Images, ScreenNames } from "@/src/config";
import { usePlatform, useSyncPlatformStatus, useTheme } from "@/src/hooks";
import { ConnectStatus } from "@/src/redux/reducers";
import { useEffect, useState } from "react";
import { Linking, Pressable, View } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import { SD } from "../../utils";
import { PrinterSettingScreenCard } from "./components";
import { cardsDummyData } from "./extra";
import { styles } from "./styles";

const PlatformSettingScreen = ({ navigation, route }) => {
  const id = route?.params?.id;
  const [loading, setLoading] = useState("");
  const platformDetail = useSelector(
    (state: RootState) => state.platform.platformDetailsByID[id],
  );

  useEffect(() => {
    // in case it accidentally navigate here right after printer card removed. go back to home screne.
    if (!platformDetail) {
      navigation.goBack();
    }
  }, [platformDetail, navigation]);

  const queryPlatform = usePlatform(id);
  useSyncPlatformStatus(id, {
    data: queryPlatform.data,
    isError: queryPlatform.isError,
  });

  // const { refetch, isFetching, isLoading } = usePrinter(
  //   IP_Address,
  //   ["Status"],
  //   false,
  // );
  // const {
  //   HostName,
  //   Status,
  //   statusCategory,
  //   LanguageV,
  //   SpeedV,
  //   TOFAdj,
  //   Darkness,
  //   PrintWidth,
  //   ShiftLeft,
  // } = printerDetails;

  const { AppTheme } = useTheme();
  const handleClick = (el) => {
    switch (el.title) {
      case "测试应用":
        navigation.navigate(ScreenNames.TestAppScreen, {
          id,
        });
        break;
      case "HTTP服务器":
        // handlePrinterSetting("calibrate");
        // setShowCalibrationModal(true);
        Linking.openURL("http://192.168.1.24");
        break;
      default:
        break;
    }
  };

  // const handlePrinterSetting = async (
  //   path,
  //   parameter = undefined,
  //   data = undefined,
  // ) => {
  //   try {
  //     setLoading("Setting values to printer...");
  //     await sendRequest({
  //       ip: IP_Address,
  //       method: "POST",
  //       endpoint: parameter ? `${path}.cgi?${parameter}` : `${path}.cgi`,
  //       data: data ? `${data}` : ``,
  //     });

  //     refetch();
  //     setLoading(null);
  //     if (path === "calibrate") {
  //       toast.success(`calibrate in progress`);
  //     } else {
  //       toast.success(`${path} sucesss`);
  //     }
  //   } catch (error) {
  //     setLoading(null);
  //     toast.fail(`Failed','Failed to ${path} printer`);
  //   }
  // };

  // const handleCalibrate = async (indexMode) => {
  //   handlePrinterSetting("calibrate", `type=${indexMode}`);
  //   let intervalId = null;
  //   setLoading(`Calibrating...`);

  //   intervalId = setInterval(async () => {
  //     await refetch();

  //     // Get the latest status from Redux manually
  //     const latestStatus =
  //       store.getState().printer.printerDetailsByIp[IP_Address]?.Status;
  //     console.log("STATUS => ", latestStatus);

  //     if (
  //       latestStatus === "Calibrate Succeeded" ||
  //       latestStatus === "Calibrate Failed"
  //     ) {
  //       clearInterval(intervalId);
  //       toast.success(`Calibration result: ${latestStatus}`);
  //       setShowCalibrationModal(false);
  //       setLoading(null);
  //     }
  //   }, 2000);
  // };

  // const closeCalibrationModal = () => {
  //   setShowCalibrationModal(!showCalibrationModal);
  // };

  // const statusFontColor =
  //   statusCategory == "OK"
  //     ? AppTheme.lightGreen
  //     : statusCategory == "WARNING"
  //       ? AppTheme.YellowishTextColor
  //       : AppTheme.ErrorTextColor;

  // const handleRefresh = async () => {
  //   try {
  //     setLoading("Refreshing...");
  //     refetch();
  //     setLoading(null);
  //     toast.success("Refreshed!");
  //   } catch (error) {
  //     toast.fail("Fail", "Fail to refresh");
  //   }
  // };

  const { platformStatus, connectStatus } = platformDetail;
  const { statusFontColor, Status } =
    connectStatus == ConnectStatus.DeviceDown
      ? { statusFontColor: AppTheme.fontGray, Status: "设备离线" }
      : connectStatus == ConnectStatus.CloudServerDown
        ? { statusFontColor: AppTheme.fontGray, Status: "服务器异常" }
        : platformStatus.length == 0
          ? { statusFontColor: AppTheme.lightGreen, Status: "正常" }
          : platformStatus.length == 1
            ? { statusFontColor: AppTheme.Yellow, Status: "警告" }
            : platformStatus.length == 2
              ? { statusFontColor: AppTheme.Red, Status: "错误" }
              : { statusFontColor: AppTheme.fontGray, Status: "未知" };

  return (
    <MainContainer>
      <MainHeader
        title="平台设置"
        back
        mainContainerStyle={{
          paddingVertical: 0,
        }}
      />
      <SectionContainer
        containerStyles={{ marginTop: SD.hp(100), paddingBottom: SD.hp(10) }}
      >
        <Pressable
          style={{ marginVertical: SD.hp(15) }}
          onPress={
            () => {}
            // navigation.navigate(ScreenNames.PlatformInfoScreen, { id })
          }
        >
          <CustomImage source={Images.platform} style={styles.deviceImage} />
          <Text
            bold
            size={24}
            centered
            color={AppTheme.Black}
            style={{ textTransform: "uppercase" }}
          >
            {/* CTPG5824 */}
            {platformDetail.mdnsName}
          </Text>
          <Text
            regular
            size={14}
            color={AppTheme.fontGray}
            centered
            style={{ paddingBottom: 5 }}
          >
            电子创意平台
          </Text>
        </Pressable>
        <View style={styles.btnsView}>
          <CustomTouchable
            style={[styles.sectionBtn, { backgroundColor: AppTheme.White }]}
          >
            <Text bold size={12}>
              状态
            </Text>
            <Text regular size={12} color={statusFontColor}>
              {/* Online */}
              {Status}
            </Text>
          </CustomTouchable>
          <CustomTouchable
            style={[
              styles.sectionBtn,
              {
                backgroundColor: AppTheme.White,
                flexDirection: "row",
                alignItems: "center",
              },
            ]}
            // onPress={handleRefresh}
          >
            <CustomImage source={Images.refresh} style={styles.refreshIcon} />
            <Text bold size={17} color={AppTheme.Primary}>
              刷新
            </Text>
          </CustomTouchable>
        </View>
      </SectionContainer>
      <View style={styles.cardsSection}>
        {cardsDummyData.map((item, index) => (
          <PrinterSettingScreenCard
            key={index}
            icon={item.icon}
            title={item.title}
            onPress={() => handleClick(item)}
          />
        ))}
      </View>
      {/* <CalibrationModal
        isVisible={showCalibrationModal}
        onClose={closeCalibrationModal}
        onCalibrate={handleCalibrate}
        status={Status}
      /> */}
      <Loader visible={!!loading} text={loading} />
    </MainContainer>
  );
};

const CalibrationModal = ({ isVisible, onClose, onCalibrate, status }) => {
  const { AppTheme } = useTheme();
  const [selectedValue, setSelectedValue] = useState<string>("gap");

  return (
    <CustomModal isVisible={isVisible} onClose={onClose}>
      <View
        style={[styles.clibModalContainer, { backgroundColor: AppTheme.White }]}
      >
        <View style={styles.clibModalContentContainer}>
          <Text bold size={24} primartColor centered>
            Start Calibration
          </Text>
          <Text
            regular
            size={12}
            color={AppTheme.fontGray}
            bottomSpacing={20}
            topSpacing={10}
          >
            Select Your Media Type
          </Text>

          {status === "Calibrate Succeeded" ? (
            <Text
              regular
              size={12}
              color={AppTheme.lightGreen}
              bottomSpacing={5}
              centered
            >
              ✅ Calibration completed successfully
            </Text>
          ) : status == "Calibrate Failed" ? (
            <Text
              regular
              size={12}
              color={AppTheme.ErrorTextColor}
              bottomSpacing={5}
              centered
            >
              ❌ Calibration failed. Please check the printer and try again
            </Text>
          ) : status == "Ready" ? (
            <Text
              regular
              size={12}
              color={AppTheme.SuccessTextColor}
              bottomSpacing={5}
            >
              Printer is ready to calibrate
            </Text>
          ) : status == "Calibrating" ? (
            <Text
              regular
              size={12}
              color={AppTheme.DispatcedTextColor}
              bottomSpacing={5}
            >
              Calibrating in progress
            </Text>
          ) : (
            <Text
              regular
              size={12}
              color={AppTheme.ErrorTextColor}
              bottomSpacing={5}
            >
              ⚠️ Printer is not ready. Please clear any errors before starting
              calibration
            </Text>
          )}

          <CustomDropdown
            disable={status != "Ready"}
            data={calibrationMethods}
            value={selectedValue}
            onChange={setSelectedValue}
            placeholder="Pick a color"
            dropdownStyle={{
              ...styles.customDropdownStyle,
              backgroundColor: AppTheme.skyBlue,
            }}
            iconColor={AppTheme.Primary}
            placeholderStyle={{
              ...styles.dropdownPlaceHoldertextStyles,
              color: AppTheme.fontGray,
            }}
            itemStyle={{
              ...styles.customItemStyle,
            }}
            containerStyle={{
              ...styles.itemContainerStyle,
              backgroundColor: AppTheme.skyBlue,
            }}
            place
            activeColor={AppTheme.White}
            // fontFamily={Fonts["Bold"]}
          />
        </View>
        <View
          style={{
            width: "100%",
            paddingHorizontal: SD.wp(10),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <PrimaryButton
            title="Calibrate"
            customStyles={styles.modalBtn}
            onPress={() => onCalibrate(selectedValue)}
            disabled={status != "Ready"}
          />
          <CustomTouchable
            onPress={onClose}
            style={{ marginVertical: SD.hp(12) }}
          >
            <Text bold size={12} color={AppTheme.fontGray}>
              Skip
            </Text>
          </CustomTouchable>
        </View>
      </View>
    </CustomModal>
  );
};

export default PlatformSettingScreen;
