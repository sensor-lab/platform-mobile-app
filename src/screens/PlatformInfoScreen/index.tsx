import {
    Loader,
    MainContainer,
    MainHeader,
    PrimaryButton,
    Text,
} from "@/src/components";
import { Images } from "@/src/config";
import { useTheme } from "@/src/hooks";
import { ConnectStatus } from "@/src/redux/reducers";
import { WebsocketService } from "@/src/services/payload_service";
import { SD, toast } from "@/src/utils";
import CommonUtils from "@/src/utils/common.utils";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { CustomImage } from "../../components/custom-image";
import { RootState } from "../../redux";

const mapPlatformStatusText = (
    connectStatus: ConnectStatus,
    platformStatus: number[],
): string => {
    if (connectStatus === ConnectStatus.DeviceDown) return "设备离线";
    if (connectStatus === ConnectStatus.CloudServerDown) return "服务器异常";
    if (platformStatus.length === 0) return "正常";
    if (platformStatus.length === 1) return "警告";
    if (platformStatus.length >= 2) return "错误";
    return "未知";
};

const PlatformInfoScreen = ({ navigation, route }: { navigation: any; route: any }) => {
    const id = route?.params?.id;
    const { AppTheme } = useTheme();
    const [loading, setLoading] = useState(false);
    const [latestFwVersion, setLatestFwVersion] = useState<string | undefined>();

    const platformDetail = useSelector(
        (state: RootState) => state.platform.platformDetailsByID[id],
    );

    useEffect(() => {
        if (!platformDetail) {
            navigation.goBack();
        }
    }, [platformDetail, navigation]);

    useEffect(() => {
        if (!platformDetail?.fwVersion) return;

        const fetchLatestFw = async () => {
            try {
                setLoading(true);
                const ws = WebsocketService.getInstance();
                const txid = uuidv4();
                const resp = await ws.queryLatestFw(txid);
                setLatestFwVersion(resp?.version);
            } catch (error) {
                console.log("Failed to query latest firmware", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLatestFw();
    }, [platformDetail?.fwVersion]);

    if (!platformDetail) return null;

    const platformStatusText = mapPlatformStatusText(
        platformDetail.connectStatus,
        platformDetail.platformStatus,
    );

    const signalStrength = platformDetail.rssi ?? "未知";

    const canUpdateFw = useMemo(() => {
        return CommonUtils.compareVersions(latestFwVersion, platformDetail.fwVersion) > 0;
    }, [latestFwVersion, platformDetail.fwVersion]);

    const onUpdateFirmware = () => {
        if (!canUpdateFw) return;
        toast.info(`检测到新版本 ${latestFwVersion}，请开始固件更新流程`, 5000);
    };

    return (
        <MainContainer>
            <MainHeader
                title="平台信息"
                back
                mainContainerStyle={{
                    paddingVertical: 0,
                }}
            />

            <View style={styles.contentWrap}>
                <View style={styles.deviceWrap}>
                    <CustomImage source={Images.platform} style={styles.deviceImage} />
                    <Text bold size={34} centered color={AppTheme.Black} topSpacing={20}>
                        {platformDetail.mdnsName}
                    </Text>
                    <Text regular size={13} centered color={AppTheme.fontGray} topSpacing={6}>
                        {platformDetail.id}
                    </Text>
                </View>

                <View style={[styles.infoCard, { backgroundColor: AppTheme.skyBlue }]}>
                    <View style={styles.row}>
                        <Text regular size={15} color={AppTheme.Primary}>
                            平台状态
                        </Text>
                        <Text semiBold size={15} color={AppTheme.Black}>
                            {platformStatusText}
                        </Text>
                    </View>

                    <View style={[styles.divider, { backgroundColor: AppTheme.White }]} />

                    <View style={styles.row}>
                        <Text regular size={15} color={AppTheme.Primary}>
                            路由器连接信号强度
                        </Text>
                        <Text semiBold size={15} color={AppTheme.Black}>
                            {String(signalStrength)}
                        </Text>
                    </View>

                    <View style={[styles.divider, { backgroundColor: AppTheme.White }]} />

                    <View style={styles.row}>
                        <Text regular size={15} color={AppTheme.Primary}>
                            版本
                        </Text>
                        <Text semiBold size={15} color={AppTheme.Black}>
                            固件版本: {platformDetail.fwVersion}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.footerButtonWrap}>
                <PrimaryButton
                    title="软件更新"
                    onPress={onUpdateFirmware}
                    disabled={!canUpdateFw}
                    customStyles={styles.updateButton}
                />
            </View>

            <Loader visible={loading} text="检查更新中..." />
        </MainContainer>
    );
};

const styles = StyleSheet.create({
    contentWrap: {
        flex: 1,
        marginTop: SD.hp(80),
    },
    deviceWrap: {
        alignItems: "center",
    },
    deviceImage: {
        width: SD.wp(170),
        height: SD.wp(170),
        resizeMode: "contain",
    },
    infoCard: {
        borderRadius: SD.wp(14),
        marginTop: SD.hp(30),
        paddingHorizontal: SD.wp(16),
        paddingVertical: SD.hp(14),
    },
    row: {
        minHeight: SD.hp(34),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        opacity: 0.9,
    },
    footerButtonWrap: {
        paddingBottom: SD.hp(18),
    },
    updateButton: {
        borderRadius: SD.wp(16),
    },
});

export default PlatformInfoScreen;