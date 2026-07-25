import { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import {
    ConnectionStatusModal,
    MainContainer,
    MainHeader,
    PrimaryButton,
    Text,
} from "../../components";
import { Images, ScreenNames } from "../../config";
import { ProvisionService } from "../../services/provision_service";
import { styles } from "./styles";

type Mode = "station" | "hotspot" | null;

const ProvisionModeSelectScreen = ({ navigation }: any) => {
    const [selectedMode, setSelectedMode] = useState<Mode>(null);
    const [devId, setDevId] = useState("");
    const [error, setError] = useState("");

    const loadDeviceId = async () => {
        const id = (await ProvisionService.devId())?.trim() ?? "";
        setDevId(id);
        if (!id) {
            setError("未获取到设备编号，请重试");
        }
    };

    useEffect(() => {
        void (async () => {
            await loadDeviceId();
        })();
    }, []);

    const handleNext = () => {
        if (!selectedMode) return;
        if (!devId) {
            setError("未获取到设备编号，请重试");
            return;
        }

        if (selectedMode === "station") {
            navigation.navigate(ScreenNames.ProvisionConnectWifiScreen);
            return;
        } else {
            navigation.navigate(ScreenNames.ProvisionSetWifiPasswordScreen, {
                mode: "accesspoint",
            });
        }
    };

    const handleRetry = () => {
        setError("");
        void loadDeviceId();
    };

    const handleCloseError = () => {
        setError("");
        navigation.navigate(ScreenNames.ProvisionStartScreen);
    };

    return (
        <MainContainer mainContainerStyle={{ backgroundColor: "#FFFFFF" }}>
            <MainHeader
                back={true}
                title="模式选择"
            />
            <View style={styles.content}>
                <Text bold size={18} centered style={styles.subtitle}>
                    已和平台连接，选择您需要的模式
                </Text>
                <Text regular size={13} centered color="#666A73" style={styles.hint}>
                    配置过程中，请确保手机与平台保持靠近，以保证连接稳定顺畅
                </Text>

                <TouchableOpacity
                    style={[styles.card, selectedMode === "station" && styles.cardSelected]}
                    onPress={() => setSelectedMode("station")}
                    activeOpacity={0.8}
                >
                    <Text bold size={16} style={styles.cardTitle}>
                        连接模式（推荐）
                    </Text>
                    <Text regular size={13} color="#666A73" style={styles.cardDescription}>
                        将平台与外部路由器（如家庭路由器）连接。连接成功后，您即可通过手机应用远程操控平台。
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.card, selectedMode === "hotspot" && styles.cardSelected]}
                    onPress={() => setSelectedMode("hotspot")}
                    activeOpacity={0.8}
                >
                    <Text bold size={16} style={styles.cardTitle}>
                        热点模式
                    </Text>
                    <Text regular size={13} color="#666A73" style={styles.cardDescription}>
                        将平台设置为移动热点后，手机需处于该热点的信号覆盖范围内，方可实现对平台的控制。
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <PrimaryButton
                    title="下一步"
                    customStyles={[styles.nextBtn, !selectedMode && styles.nextBtnDisabled]}
                    textColor="#FFFFFF"
                    onPress={handleNext}
                    disabled={!selectedMode}
                />
            </View>
            <ConnectionStatusModal
                isVisible={!!error}
                onClose={handleCloseError}
                icon={Images.failWifi}
                title={"无法获取设备编号"}
                description={error}
                onRetry={handleRetry}
            />
        </MainContainer>
    );
};

export default ProvisionModeSelectScreen;
