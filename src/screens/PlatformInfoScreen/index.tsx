import {
    MainContainer,
    MainHeader,
    PrimaryButton,
    Text
} from "@/src/components";
import { Images } from "@/src/config";
import { useTheme } from "@/src/hooks";
import { ConnectStatus } from "@/src/redux/reducers";
import { FlatbuffersCommand, FlatbuffersEnvelope, Message } from "@/src/services/flatbuffersmsg";
import { WebsocketService } from "@/src/services/payload_service";
import { SD, Toast } from "@/src/utils";
import CommonUtils from "@/src/utils/common.utils";
import * as flatbuffers from "flatbuffers";
import { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { CustomImage } from "../../components/custom-image";
import { RootState } from "../../redux";
import UpdateProgressModal from "./components/UpdateProgressModal";

type FirmwareUpdateResponse = {
    state: number;
    payload: string;
};

const SUCCESS_PAYLOAD_REGEX = /success/i;
const FAIL_PAYLOAD_REGEX = /fail/i;
const MAX_RETRIES = 3;
const RETRY_DELAY = 10000; // 10 seconds

const parseFirmwareUpdateResponse = (data: Uint8Array): FirmwareUpdateResponse => {
    const bb = new flatbuffers.ByteBuffer(data);
    const envelope = FlatbuffersEnvelope.getRootAsFlatbuffersEnvelope(bb);

    if (envelope.messageType() !== Message.FlatbuffersCommand) {
        throw new Error("固件更新响应格式异常");
    }

    const command = envelope.message(new FlatbuffersCommand());
    const payloadBytes = command.payloadArray();

    if (!payloadBytes) {
        throw new Error("固件更新响应缺少 payload");
    }

    const payloadText = new TextDecoder("utf-8").decode(payloadBytes);
    const parsed = JSON.parse(payloadText) as Partial<FirmwareUpdateResponse>;

    if (typeof parsed.state !== "number" || typeof parsed.payload !== "string") {
        throw new Error("固件更新响应字段不完整");
    }

    return {
        state: parsed.state,
        payload: parsed.payload,
    };
};

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
    const latestFwVer = route?.params?.latestFwVer;
    const { AppTheme } = useTheme();
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const [updateProgress, setUpdateProgress] = useState(0);
    const [updateStatus, setUpdateStatus] = useState("准备开始更新");
    const [isUpdating, setIsUpdating] = useState(false);
    const updateTxidRef = useRef<string | null>(null);
    const rebootTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const updateTotalBytesRef = useRef(0);
    const updateFinishedRef = useRef(false);

    const platformDetail = useSelector(
        (state: RootState) => state.platform.platformDetailsByID[id],
    );

    useEffect(() => {
        if (!platformDetail) {
            navigation.goBack();
        }
    }, [platformDetail, navigation]);

    useEffect(() => {
        return () => {
            if (rebootTimerRef.current) {
                clearTimeout(rebootTimerRef.current);
                rebootTimerRef.current = null;
            }
            if (updateTxidRef.current) {
                WebsocketService.getInstance().unregisterCallback(updateTxidRef.current);
                updateTxidRef.current = null;
            }
        };
    }, []);

    if (!platformDetail) return null;

    const platformStatusText = mapPlatformStatusText(
        platformDetail.connectStatus,
        platformDetail.platformStatus,
    );

    const signalStrength = platformDetail.rssi ?? "未知";

    const canUpdateFw = useMemo(() => {
        return CommonUtils.compareVersions(latestFwVer, platformDetail.fwVersion) > 0;
    }, [latestFwVer, platformDetail.fwVersion]);

    const checkDeviceStatus = async (ws: WebsocketService, retryCount = 0) => {
        try {
            await ws.queryStatus(id);

            setUpdateStatus("更新完成，设备已重新上线");
            setIsUpdating(false);
            Toast.success("固件更新成功");

            rebootTimerRef.current = null;
        } catch (error) {
            console.log(`status check failed (attempt ${retryCount + 1})`, error);

            if (retryCount < MAX_RETRIES - 1) {
                // schedule next retry
                rebootTimerRef.current = setTimeout(() => {
                    checkDeviceStatus(ws, retryCount + 1);
                }, RETRY_DELAY);
            } else {
                // all retries failed
                failFirmwareUpdate("固件已写入，但设备未能在多次尝试后恢复在线");
                rebootTimerRef.current = null;
            }
        }
    };

    const failFirmwareUpdate = (message: string) => {
        updateFinishedRef.current = true;

        if (rebootTimerRef.current) {
            clearTimeout(rebootTimerRef.current);
            rebootTimerRef.current = null;
        }

        if (updateTxidRef.current) {
            WebsocketService.getInstance().unregisterCallback(updateTxidRef.current);
            updateTxidRef.current = null;
        }

        setIsUpdating(false);
        setUpdateStatus(message);
        Toast.fail(message);
    };

    const finalizeFirmwareUpdate = async () => {
        if (updateFinishedRef.current) return;

        updateFinishedRef.current = true;

        if (updateTxidRef.current) {
            WebsocketService.getInstance().unregisterCallback(updateTxidRef.current);
            updateTxidRef.current = null;
        }

        setUpdateProgress(100);
        setUpdateStatus("固件下载完成，设备正在重启...");

        if (rebootTimerRef.current) {
            clearTimeout(rebootTimerRef.current);
        }

        const ws = WebsocketService.getInstance();
        await ws.connect();
        rebootTimerRef.current = setTimeout(() => {
            checkDeviceStatus(ws);
        }, RETRY_DELAY);
    };

    const handleFirmwareUpdateMessage = (data: Uint8Array): boolean => {
        if (updateFinishedRef.current) return true;

        try {
            const response = parseFirmwareUpdateResponse(data);
            const payload = response.payload.trim();

            if (SUCCESS_PAYLOAD_REGEX.test(payload)) {
                void finalizeFirmwareUpdate();
                return true;
            } else if (FAIL_PAYLOAD_REGEX.test(payload)) {
                const errorMsg = `OTA update finished with error: ${payload}`
                console.log(errorMsg)
                throw new Error(errorMsg)
            } else if (response.state == 1) {
                // back to OTA waiting state, indicating a failure
                const errorMsg = `OTA update encounters a failure: ${payload}`
                console.log(errorMsg)
                throw new Error(errorMsg)
            }

            const downloadedBytes = Number(payload);
            if (!Number.isFinite(downloadedBytes) || downloadedBytes < 0) {
                console.log(`unknown payload from server: ${payload}`);
            }

            const totalBytes = updateTotalBytesRef.current;
            if (!Number.isFinite(totalBytes) || totalBytes <= 0) {
                console.log("固件大小无效，无法计算进度");
            }

            const progress = Math.max(
                1,
                Math.min(99, Math.round((downloadedBytes / totalBytes) * 100)),
            );

            setUpdateStatus(`固件下载中`,);
            if (!Number.isNaN(progress)) {
                setUpdateProgress(progress);
            } else {
                setUpdateProgress(0);

            }
            return false;
        } catch (error) {
            console.log("firmware update response parse failed", error);
            failFirmwareUpdate("固件更新响应异常，请重试");
            return true;
        }
    };

    const onUpdateFirmware = async () => {
        if (!canUpdateFw) return;
        if (!id) {
            Toast.fail("设备ID无效，无法更新");
            return;
        }

        updateFinishedRef.current = false;
        updateTotalBytesRef.current = 0;

        Toast.info(`检测到新版本 ${latestFwVer}，正在准备更新`, 3000);
        setUpdateProgress(0);
        setUpdateStatus("正在初始化更新任务...");
        setIsUpdateModalVisible(true);
        setIsUpdating(true);

        try {
            const ws = WebsocketService.getInstance();
            await ws.connect();
            const latestFw = await ws.queryLatestFw();
            if (!latestFw?.size || latestFw.size <= 0) {
                throw new Error("未能获取固件大小");
            }

            updateTotalBytesRef.current = latestFw.size;
            setUpdateStatus("正在发送固件更新指令...");

            updateTxidRef.current = await ws.triggerFwUpdate(
                id,
                handleFirmwareUpdateMessage,
            );
        } catch (error) {
            console.log("triggerFwUpdate failed", error);
            failFirmwareUpdate(
                error instanceof Error
                    ? error.message
                    : "触发固件更新失败，请重试",
            );
        }
    };

    const onCloseUpdateModal = () => {
        if (isUpdating) return;
        setIsUpdateModalVisible(false);
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

            <UpdateProgressModal
                isVisible={isUpdateModalVisible}
                progress={updateProgress}
                status={updateStatus}
                onClose={onCloseUpdateModal}
                canClose={!isUpdating}
            />
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