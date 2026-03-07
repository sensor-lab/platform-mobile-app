import {
    MainContainer,
    MainHeader,
    PrimaryButton,
    Text,
} from "@/src/components";
import { View } from "react-native";
import { styles } from "./styles";

const RemoteCameraScreen = ({ navigation, route }) => {

  const handleTakePhoto = () => {
    // TODO: Send command to platform to take photo
    console.log('Taking photo');
  };

  return (
    <MainContainer>
      <MainHeader
        title="远程照相机"
        back
        mainContainerStyle={{
          paddingVertical: 0,
        }}
      />

      <View style={styles.content}>
        <View style={styles.imageArea}>
          <Text size={14} color="#9CA3AF">
            图片
          </Text>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <PrimaryButton
          title="拍照"
          customStyles={styles.takePhotoBtn}
          onPress={handleTakePhoto}
        />
      </View>
    </MainContainer>
  );
};

export default RemoteCameraScreen;