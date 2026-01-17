import { TextInput, View } from "react-native";
import Text from "../text";
import { styles } from "./styles";
import { CustomTouchable } from "../custom-touchable";
import { useTheme } from "../../hooks";
import { CustomImage } from "../custom-image";
import { Images } from "../../config";
import React from "react";

type Props = {
  value: number;
  setValue: (e: any) => void;
  sign?: string;
};

export const IncreamentDecreamentComp: React.FC<Props> = ({
  value = 0,
  setValue,
  sign,
}) => {
  const { AppTheme } = useTheme();

  const handleInputChange = (text: string) => {
    // const numeric = text.replace(/[^0-9]/g, ""); // Only keep digits
    // setValue(numeric ? parseInt(numeric) : 0);
    setValue(text);
  };
  return (
    <View style={{ ...styles.container, backgroundColor: AppTheme.White }}>
      <CustomTouchable
        style={{ ...styles.btn, backgroundColor: AppTheme.skyBlue }}
        onPress={(e) => setValue((parseFloat(value) - 0.01).toFixed(2))}
      >
        <CustomImage source={Images.minus} style={styles.btnIcon} />
      </CustomTouchable>
      {/* <Text bold size={12} color={AppTheme.fontGray} centered>
        {value} {sign}
      </Text> */}
      <View style={styles.inputView}>
        <TextInput
          value={value.toString()}
          style={styles.input}
          onChangeText={handleInputChange}
          keyboardType="decimal-pad"
        />
        <Text bold size={12} color={AppTheme.fontGray} centered>
          {sign}
        </Text>
      </View>
      <CustomTouchable
        style={{ ...styles.btn, backgroundColor: AppTheme.skyBlue }}
        onPress={(e) => setValue((parseFloat(value) + 0.01).toFixed(2))}
      >
        <CustomImage source={Images.plus} style={styles.btnIcon} />
      </CustomTouchable>
    </View>
  );
};
