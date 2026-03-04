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

    
const appCategory = [
  { label: "发光类", value: "lightCategory" },
  { label: "传感器类", value: "sensorCategory" },
];

const apps: Record<string, { label: string; value: string; icon: number }[]> = {
    "lightCategory": [{
        label: "灯带控制器", value: "ledStripController", icon: Images.ledStripApp
    }],
    "sensorCategory": [{
        label: "环境监测应用", value: "environmentMonitor", icon: Images.environmentApp
    }]
}

const PlatformSettingScreen = ({ navigation, route }) => {
  const id = route?.params?.id;
  const [loading, setLoading] = useState("");
  const [showAddAppsModal, setShowAddAppsModal] = useState(false);
  const [addedApps, setAddedApps] = useState<string[]>([]);
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

  // Helper function to get app details
  const getAppDetails = (appValue: string) => {
    for (const category in apps) {
      const appInCategory = apps[category].find(app => app.value === appValue);
      if (appInCategory) return appInCategory;
    }
    return null;
  };

  // Helper function to handle app navigation
  const handleAppClick = (appValue: string) => {
    switch (appValue) {
      case "ledStripController":
        navigation.navigate(ScreenNames.LedStripController, { id });
        break;
      case "environmentMonitor":
        navigation.navigate(ScreenNames.EnvironmentMonitorScreen, { id });
        break;
      default:
        console.log(`App not implemented: ${appValue}`);
        break;
    }
  };

  const handleClick = (el) => {
    switch (el.title) {
      case "测试应用":
        navigation.navigate(ScreenNames.TestAppScreen, {
          id,
        });
        break;
      case "HTTP服务器":
        Linking.openURL("http://192.168.1.187");
        break;
      case "添加应用":
        setShowAddAppsModal(true);
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
  //       setShowAddAppsModal(false);
  //       setLoading(null);
  //     }
  //   }, 2000);
  // };

  const closeCalibrationModal = () => {
    setShowAddAppsModal(!showAddAppsModal);
  };

  const handleAddApp = (appValue: string) => {
    if (appValue && !addedApps.includes(appValue)) {
      setAddedApps([...addedApps, appValue]);
      setShowAddAppsModal(false);
      console.log(`Added app: ${appValue}`);
    }
  };

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
        
        {/* Render added apps */}
        {addedApps.map((appValue, index) => {
          const appDetails = getAppDetails(appValue);
          if (!appDetails) return null;
          
          return (
            <PrinterSettingScreenCard
              key={`app-${index}`}
              icon={appDetails.icon}
              title={appDetails.label}
              onPress={() => handleAppClick(appValue)}
            />
          );
        })}
      </View>
      <AddAppsModal
        isVisible={showAddAppsModal}
        onClose={closeCalibrationModal}
        onAddNewApp={handleAddApp}
        status={Status}
      />
      <Loader visible={!!loading} text={loading} />
    </MainContainer>
  );
};

const AddAppsModal = ({ isVisible, onClose, onAddNewApp, status }) => {
  const { AppTheme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);

  // Reset selections when modal opens/closes
  useEffect(() => {
    if (isVisible) {
      setSelectedCategory(null);
      setSelectedApp(null);
    }
  }, [isVisible]);

  const handleAddApp = () => {
    if (selectedApp) {
      onAddNewApp(selectedApp);
    }
  };

  return (
    <CustomModal isVisible={isVisible} onClose={onClose}>
      <View
        style={[styles.clibModalContainer, { backgroundColor: AppTheme.White }]}
      >
        <View style={styles.clibModalContentContainer}>
          <Text bold size={24} primartColor centered>
            添加应用
          </Text>
          <Text
            regular
            size={12}
            color={AppTheme.fontGray}
            bottomSpacing={20}
            topSpacing={10}
          >
            选择应用的类别和名称
          </Text>

          <CustomDropdown
            data={appCategory}
            value={selectedCategory}
            onChange={(value) => {
              setSelectedCategory(value);
              setSelectedApp(null); // Reset app selection when category changes
            }}
            placeholder="选择应用类别"
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

          {selectedCategory && (
            <CustomDropdown
              data={apps[selectedCategory]}
              value={selectedApp}
              onChange={setSelectedApp}
              placeholder="选择应用名称"
              dropdownStyle={{
                ...styles.customDropdownStyle,
                backgroundColor: AppTheme.skyBlue,
                marginTop: SD.hp(15),
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
          )}
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
            title="添加"
            customStyles={[
              styles.modalBtn,
              { opacity: selectedApp ? 1 : 0.5 }
            ]}
            onPress={handleAddApp}
            disabled={!selectedApp}
          />
          <CustomTouchable
            onPress={onClose}
            style={{ marginVertical: SD.hp(12) }}
          >
            <Text bold size={12} color={AppTheme.fontGray}>
              返回
            </Text>
          </CustomTouchable>
        </View>
      </View>
    </CustomModal>
  );
};

export default PlatformSettingScreen;
