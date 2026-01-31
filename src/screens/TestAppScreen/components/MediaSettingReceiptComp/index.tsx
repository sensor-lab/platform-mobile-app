import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import {
  CustomDropdown,
  CustomTextInput,
  IncreamentDecreamentComp,
  InfoFieldComp,
  Loader,
  MainContainer,
  PrimaryButton,
  SectionContainer,
  Text,
} from "../../../../components";
import { SD } from "../../../../utils";
import { styles } from "./styles";
import { usePrinter, useTheme } from "../../../../hooks";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { sendRequest } from "../../../../services/printerServices";
import { toast } from "../../../../utils/toast.utils";
import { generateTestLabelScript } from "../../../../utils/printer.utls";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const MediaSettingReceiptComp = ({ data }) => {
  const { ip } = data;
  const { ModelNum, PrintWidth, ShiftLeft, IndexV, LanguageV, MediaTypeV } =
    useSelector((state: any) => state.printer.printerDetailsByIp[ip]);
  usePrinter(ip, [
    "ModelNum",
    "PrintWidth",
    "ShiftLeft",
    "IndexV",
    "LanguageV",
    "MediaTypeV",
  ]);
  const [selectedType, setSelectedType] = useState<string | number>(MediaTypeV);
  const { refetch } = usePrinter(ip);
  const [typeData, setTypeData] = useState([
    {
      label: "Direct thermal",
      value: "0",
    },
    {
      label: "Thermal Transfer",
      value: "1",
    },
  ]);

  const { AppTheme } = useTheme();
  const [printWidth, setPrintWidth] = useState<any>(0);
  const [shiftLeft, setShiftLeft] = useState<any>(0);
  const [printWidthError, setPrintWidthError] = useState<string | null>(null);
  const [shiftLeftError, setShiftLeftError] = useState<string | null>(null);
  const [loading, setLoading] = useState(null);
  useEffect(() => {
    // setPrintWidth(PrintWidth);
    // setShiftLeft(Number(ShiftLeft));
    setPrintWidth(PrintWidth ? Number(PrintWidth) / 100 : 0);
    setShiftLeft(ShiftLeft ? Number(ShiftLeft) / 100 : 0);
  }, []);

  const getPrintWidthRange = () => {
    if (
      ModelNum &&
      (ModelNum.startsWith("CXT4") ||
        ModelNum.startsWith("CXD4") ||
        ModelNum.startsWith("DBD4") ||
        ModelNum.startsWith("DBT4"))
    ) {
      return { min: 1, max: 409 }; // 4-inch print head
    } else if (
      ModelNum &&
      (ModelNum.startsWith("CXT2") ||
        ModelNum.startsWith("CXD2") ||
        ModelNum.startsWith("DBD2") ||
        ModelNum.startsWith("DBT2"))
    ) {
      return { min: 1, max: 203 }; // 2-inch print head
    }
    return { min: 0, max: 0 }; // default range if model number is not recognized
  };

  const getShiftLeftRange = () => {
    if (
      ModelNum &&
      (ModelNum.startsWith("CXT4") ||
        ModelNum.startsWith("CXD4") ||
        ModelNum.startsWith("DBD4") ||
        ModelNum.startsWith("DBT4"))
    ) {
      return { min: -409, max: 409 }; // 4-inch print head
    } else if (
      ModelNum &&
      (ModelNum.startsWith("CXT2") ||
        ModelNum.startsWith("CXD2") ||
        ModelNum.startsWith("DBD2") ||
        ModelNum.startsWith("DBT2"))
    ) {
      return { min: -203, max: 203 }; // 2-inch print head
    }
    return { min: 0, max: 0 }; // default range if model number is not recognized
  };

  useEffect(() => {
    if (ModelNum) {
      // Validate print width when model number changes
      const { min, max } = getPrintWidthRange();
      const min_inch = min / 100;
      const max_inch = max / 100;
      if (printWidth <  min_inch || printWidth > max_inch) {
        setPrintWidthError(
          `Print width value must be between ${min_inch} and ${max_inch}`
        );
      } else {
        setPrintWidthError(null);
      }

      // Validate shift left when model number changes
      const { min: shiftMin, max: shiftMax } = getShiftLeftRange();
      const shift_left_min_inch = shiftMin / 100;
      const shift_left_max_inch = shiftMax / 100;
      if (shiftLeft < shift_left_min_inch || shiftLeft > shift_left_max_inch) {
        setShiftLeftError(
          `Shift left value must be between ${shift_left_min_inch} and ${shift_left_max_inch}`
        );
      } else {
        setShiftLeftError(null);
      }
    }
  }, [ModelNum, printWidth, shiftLeft]);

  const handleSetValues = async () => {
    if (shiftLeftError != null || printWidthError !== null) return;
    try {
      setLoading(`Setting values to printer...`);
      await sendRequest({
        ip,
        endpoint: "saveprintervarvalues.cgi",
        data: `ShiftLeft=${Math.round(
          shiftLeft * 100
        )}&MediaTypeV=${selectedType}&PrintWidth=${Math.round(
          printWidth * 100
        )}&IndexV=1`,   // force indexing off
        method: "POST",
      });
      refetch();
      setLoading(null);
      toast.success("Media setting updated!");
    } catch (error) {
      setLoading(null);
      toast.fail("Failed", "Update failed. Check printer connections!!!");
    }
  };

  useEffect(() => {
    if (ModelNum) {
      const thirdChar = ModelNum.charAt(2).toUpperCase();
      if (thirdChar === "T") {
        setTypeData([
          { label: "Direct thermal", value: "0" },
          { label: "Thermal Transfer", value: "1" },
        ]);
      } else {
        setTypeData([{ label: "Direct thermal", value: "0" }]);
        setSelectedType("0");
      }
    }
  }, [ModelNum]);

  const handleTestPrint = async () => {
    try {
      setLoading("Sending test command...");

      let script = generateTestLabelScript(LanguageV, {
        // shiftLeft: shiftLeft,
        // printWidth: printWidth,
        shiftLeft: Math.round(shiftLeft * 100),
        printWidth: Math.round(printWidth * 100),
      });

      let response = await sendRequest({
        ip,
        endpoint: "scripttransfer.cgi",
        method: "POST",
        data: script,
        headers: { "Content-Type": "text/plain" },
      });
      setLoading(null);
      toast.success("Test print command sent!");
    } catch (error) {
      setLoading(null);

      toast.fail("Failed", "Test failed.");
    }
  };
  const { height } = Dimensions.get("window");
  return (
    // <MainContainer
    //   customeStyle={{
    //     marginTop: SD.hp(20),
    //     paddingHorizontal: 0,
    //     paddingVertical: 0,
    //     padding: 0,
    //     borderWidth: 1,
    //   }}
    // >
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={{ flex: 1 }}
        // contentContainerStyle={{ flex: 1 }}
      >
        <View
          style={{
            flex: 1,
            height: height / 1.7,
            marginTop: SD.hp(20),
          }}
        >
          <InfoFieldComp
            title="Type"
            children={
              <CustomDropdown
                iconColor={AppTheme.Primary}
                data={typeData}
                onChange={setSelectedType}
                value={selectedType}
                dropdownStyle={styles.dropdownStyles}
                itemStyle={{
                  ...styles.customItemStyle,
                  backgroundColor: AppTheme.White,
                }}
                containerStyle={{
                  ...styles.itemContainerStyle,
                  backgroundColor: AppTheme.White,
                }}
              />
            }
          />
          {/* <InfoFieldComp
            title="Print Width (Hundredths of an Inch)"
            children={
              <CustomTextInput
                placeholder="Enter width"
                value={printWidth}
                setValue={(e) => setPrintWidth(e)}
                backgroundColor={AppTheme.White}
                placeholderTextColor={AppTheme.fontGray}
                bold
                fontSize={12}
                textColor={AppTheme.fontGray}
                topSpacing={10}
                radius={10}
                height={50}
                // style={{ padding: SD.wp(15) }}
              />
            }
          /> */}
          <InfoFieldComp
            title="Print Width"
            children={
              <IncreamentDecreamentComp
                value={printWidth}
                setValue={(e) => setPrintWidth(e)}
                sign="in"
              />
            }
          />
          {printWidthError && (
            <Text size={16} color={AppTheme.Red}>
              {printWidthError}
            </Text>
          )}
          <InfoFieldComp
            title="Shift Left"
            children={
              <IncreamentDecreamentComp
                value={shiftLeft}
                setValue={(e) => setShiftLeft(e)}
                sign="in"
              />
            }
          />
          {shiftLeftError && (
            <Text size={16} color={AppTheme.Red}>
              {shiftLeftError}
            </Text>
          )}
        </View>
        <PrimaryButton
          title="Apply"
          customStyles={{ borderRadius: 15 }}
          onPress={handleSetValues}
        />
        <PrimaryButton
          title="Test Print"
          customStyles={{ borderRadius: 15, marginVertical: 0 }}
          onPress={handleTestPrint}
        />
        <Loader visible={!!loading} text={loading} />
      </ScrollView>
    </KeyboardAvoidingView>
    // </MainContainer>
  );
};
export default MediaSettingReceiptComp;
