import { PrimaryButton, Text } from "@/src/components";
import CustomModal from "@/src/components/custom-modal";
import { useTheme } from "@/src/hooks";
import { SD } from "@/src/utils";
import { StyleSheet, View } from "react-native";

type UpdateProgressModalProps = {
    isVisible: boolean;
    progress: number;
    status: string;
    onClose: () => void;
    canClose: boolean;
};

const clampProgress = (value: number) => {
    return Math.max(0, Math.min(100, Math.round(value)));
};

const UpdateProgressModal = ({
    isVisible,
    progress,
    status,
    onClose,
    canClose,
}: UpdateProgressModalProps) => {
    const { AppTheme } = useTheme();
    const safeProgress = clampProgress(progress);

    return (
        <CustomModal isVisible={isVisible} onClose={canClose ? onClose : undefined}>
            <View style={[styles.modalContainer, { backgroundColor: AppTheme.White }]}>
                <Text bold size={22} centered color={AppTheme.Black}>
                    固件更新
                </Text>

                <Text regular size={14} centered color={AppTheme.fontGray} topSpacing={10}>
                    {status}
                </Text>

                <View style={[styles.progressTrack, { backgroundColor: AppTheme.skyBlue }]}>
                    <View
                        style={[
                            styles.progressFill,
                            {
                                width: `${safeProgress}%`,
                                backgroundColor: AppTheme.Primary,
                            },
                        ]}
                    />
                </View>

                <Text semiBold size={30} centered color={AppTheme.Primary} topSpacing={16}>
                    {safeProgress}%
                </Text>

                <PrimaryButton
                    title={canClose ? "完成" : "更新中..."}
                    onPress={onClose}
                    disabled={!canClose}
                    customStyles={[
                        styles.actionBtn,
                        {
                            opacity: canClose ? 1 : 0.55,
                        },
                    ]}
                />
            </View>
        </CustomModal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        width: "92%",
        maxWidth: SD.wp(380),
        minHeight: SD.hp(260),
        borderRadius: SD.wp(16),
        paddingHorizontal: SD.wp(24),
        paddingTop: SD.hp(26),
        paddingBottom: SD.hp(22),
        alignItems: "center",
    },
    progressTrack: {
        width: "100%",
        height: SD.hp(14),
        borderRadius: SD.wp(999),
        marginTop: SD.hp(22),
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        borderRadius: SD.wp(999),
    },
    actionBtn: {
        width: "96%",
        borderRadius: SD.wp(14),
        marginTop: SD.hp(28),
    },
});

export default UpdateProgressModal;