import { useEffect, useState } from "react";
import { Linking, Pressable, ScrollView, View } from "react-native";
import { useSelector } from "react-redux";
import { Images, ScreenNames } from "../../config";
import { useTheme } from "../../hooks";
import { SD } from "../../utils";
import {
  CustomImage,
  MainContainer,
  MainHeader,
  PrimaryButton,
  SectionContainer,
  Text,
} from "./../../components";
import { MainScreenOptionsCard, PairedDevicesComp } from "./components";
import { opetionsData } from "./extra/data";
import { styles } from "./styles";

function MainScreen({ navigation }) {
  const { AppTheme } = useTheme();
  const { platformDetailsByID } = useSelector((state: any) => state.platform);
  const [setup, setSetup] = useState([]);
  const [showRemoveButton, setShowRemoveButton] = useState(null);
  useEffect(() => {
    const sortedPlatforms: any = [...Object.values(platformDetailsByID)].sort(
      (a: any, b: any) => {
        if (a.Status === "Connected" && b.Status !== "Connected") return -1;
        if (a.Status !== "Connected" && b.Status === "Connected") return 1;

        return a.HostName.localeCompare(b.HostName);
      },
    );
    setSetup(sortedPlatforms);
  }, [platformDetailsByID]);

  const handleAddNow = () => {
    navigation.navigate(ScreenNames.PlatformSetupScreen);
  };

  const handleOpenLink = (link, heading) => {
    return Linking.openURL(link);
  };

  return (
    <Pressable style={{ flex: 1 }} onPress={() => setShowRemoveButton(null)}>
      <MainContainer isFlatList>
        <MainHeader logo showPlusIcon={!!setup.length} />
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ marginTop: SD.hp(30) }}
        >
          <SectionContainer
            onPress={() => setShowRemoveButton(null)}
            containerStyles={[
              styles.sectionContainerStyles,
              setup.length && {
                flexDirection: "column",
                justifyContent: "flex-start",
                paddingHorizontal: SD.wp(0),
                alignItems: "center",
              },
            ]}
          >
            {setup.length > 0 ? (
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ flex: 1 }}
              >
                {setup?.map((item, index) => {
                  return (
                    <PairedDevicesComp
                      data={item}
                      key={index}
                      showRemoveButton={showRemoveButton}
                      setShowRemoveButton={setShowRemoveButton}
                    />
                  );
                })}
              </ScrollView>
            ) : (
              <View style={styles.optionsSection}>
                <View style={styles.leftView}>
                  <Text bold size={22} blackBold>
                    添加第一个创意盒
                  </Text>
                  <Text
                    regular
                    size={12}
                    width={168}
                    color={AppTheme.fontGray}
                    topSpacing={10}
                    bottomSpacing={10}
                  >
                    添加第一个创意盒，在这里可以看到所有设备
                  </Text>
                  <PrimaryButton
                    title="+ 添加"
                    fontSize={12}
                    customStyles={styles.AddNowBtn}
                    onPress={handleAddNow}
                  />
                </View>
                <CustomImage
                  source={Images.platform}
                  style={styles.printerImage}
                />
              </View>
            )}
          </SectionContainer>
          <View style={styles.optionsSection}>
            {opetionsData.map((item, index) => (
              <MainScreenOptionsCard
                icon={item.icon}
                heading={item.heading}
                subHeading={item.subHeading}
                key={index}
                onPress={handleOpenLink.bind(this, item.link, item?.heading)}
              />
            ))}
          </View>
        </ScrollView>
      </MainContainer>
    </Pressable>
  );
}

export default MainScreen;
