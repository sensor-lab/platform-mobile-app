import { useEffect, useState } from "react";
import { LogBox, ScrollView, View } from "react-native";
import {
  CustomImage,
  MainContainer,
  MainHeader,
  ParingConnectionCard,
  PrimaryButton,
  SectionContainer,
  Text
} from "../../components";
import { Images, ScreenNames } from "../../config";
import { useTheme } from "../../hooks";
import { usePermission } from "../../hooks/usePermission";
import { ProvisionService } from "../../services/provision_service";
import { toast } from "../../utils/toast.utils";
import { styles } from "./styles";

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

type WifiNetwork = {
  auth: number;
  rssi: number;
  ssid: string;
};

export default function ConnectWifiScreen({ navigation }: any) {
  const [connectedWifi, setConnectedWifi] = useState<WifiNetwork | null>(null);
  const [scannedWifis, setScannedWifis] = useState<WifiNetwork[]>([]);
  const { AppTheme } = useTheme();
  const [selectedWifi, setSelectedWifi] = useState<string | null>(null);
  const { checkAndRequestPermission } = usePermission("wifi");

  const handleNext = () => {
    if (!connectedWifi) {
      return toast.fail("Fail", "Please select network!");
    } else {
      navigation.navigate(ScreenNames.SetWifiPasswordScreen, {
        wifi: connectedWifi,
      });
    }
  };

  useEffect(() => {
    const fetchWifiList = async () => {
      const hasPermission = await checkAndRequestPermission();
      if (!hasPermission) {
        console.warn("Permission denied");
        toast.fail(
          "To detect the connected Wi-Fi, this app needs access to your location. \n You can also enable location permission from Settings."
        );
        return;
      }

      try {
        const wifiList = await ProvisionService.listWiFi();
        const sortedWifiList = [...(wifiList ?? [])].sort((a, b) => b.rssi - a.rssi);
        setScannedWifis(sortedWifiList);
      } catch (err) {
        console.warn("Failed to get Wi-Fi list", err);
        toast.fail("Fail", "Unable to load nearby Wi-Fi networks.");
      }
    };

    fetchWifiList();
  }, [checkAndRequestPermission]);

  return (
    <MainContainer mainContainerStyle={{ backgroundColor: "#FFFFFF" }}>
      <MainHeader back={true} title="连接至路由器" />
      <CustomImage source={Images.wifiRound} style={styles.wifiIcon} />
      <Text
        bold
        color={AppTheme.Black}
        size={18}
        centered
        topSpacing={15}
        bottomSpacing={15}
      >
        在下面的列表选择路由器名称
      </Text>
      <View style={{ flex: 1 }}>
        <SectionContainer containerStyles={styles.wifiSectionContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {scannedWifis?.length < 1 ? (
              <Text bold size={14} color={AppTheme.Black}>
                正在搜索周围的路由器
              </Text>
            ) : (
              <>
                {[...scannedWifis]
                  .map((item, index) => {
                    const ssidCounts = scannedWifis.reduce<Record<string, number>>((acc, wifiItem) => {
                      const ssid = wifiItem.ssid;
                      acc[ssid] = (acc[ssid] || 0) + 1;
                      return acc;
                    }, {});
                    const ssid = item.ssid;
                    const displayName =
                      ssidCounts[ssid] > 1 ? `${ssid} (${item.rssi})` : ssid;

                    return (
                      <ParingConnectionCard
                        isActive={selectedWifi == displayName}
                        isCurrent={false}
                        heading={displayName}
                        subHeading={`${item.rssi} dBm`}
                        onPress={() => {
                          setSelectedWifi(displayName);
                          setConnectedWifi(item);
                        }}
                        key={index}
                        icon={Images.wifiRound}
                      />
                    );
                  })}
              </>
            )}
          </ScrollView>
        </SectionContainer>
      </View>
      <PrimaryButton
        title="下一步"
        customStyles={[styles.nextBtn, !connectedWifi && styles.nextBtnDisabled]}
        onPress={handleNext}
        disabled={!connectedWifi}
      />
    </MainContainer>
  );
}
