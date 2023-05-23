import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Dimensions, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Path, Svg } from "react-native-svg";

const { width, height } = Dimensions.get("window");

const FinalInfo = ({
  isUpdateAvailable,
  isWIFIConnected,
  hasBackupCheck,
  hasEnoughStorageCheck,
  isDeviceCharging,
}) => {
  const [isReadyForUpdate, setIsReadyForUpdate] = useState(false);
  const [title, setTitle] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    if (
      isUpdateAvailable &&
      isWIFIConnected &&
      hasBackupCheck &&
      hasEnoughStorageCheck &&
      isDeviceCharging
    ) {
      setIsReadyForUpdate(true);
    } else {
      setIsReadyForUpdate(false);
    }
  }, [
    isUpdateAvailable,
    isWIFIConnected,
    hasBackupCheck,
    hasEnoughStorageCheck,
    isDeviceCharging,
  ]);

  useEffect(() => {
    //If already running the latest version, but not all green
    if (!isUpdateAvailable && !isReadyForUpdate) {
      setTitle(
        "🎉 It looks like you are running the latest version congratulations."
      );
    } else if (isReadyForUpdate) {
      setTitle("🎉 Congratulations! You're all set to update your device.");
    } else {
      setTitle("🙈 Oh no! Looks like there are still issues you need to fix.");
    }
  }, []);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.subTitle}>Step 5 of 5</Text>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.msgsContainer}>
            {/* Update message */}
            <View
              style={[
                styles.statusContainer,
                {
                  backgroundColor: isUpdateAvailable
                    ? "rgba(102, 204, 102, .1)"
                    : "rgba(255,170,34,.1)",
                  marginBottom: 6,
                  marginTop: 6,
                },
              ]}
            >
              <Image
                source={
                  isUpdateAvailable
                    ? require("../../../assets/iconsSvg/checkGreen.png")
                    : require("../../../assets/iconsSvg/checkYellow.png")
                }
                style={{ width: 20, height: 20 }}
              />
              <Text style={styles.msgText}>
                {isUpdateAvailable
                  ? "Update available"
                  : "No Update available. You're already running the latest version!"}
              </Text>
            </View>

            {/* Wi-Fi Message */}
            <View
              style={[
                styles.statusContainer,
                {
                  backgroundColor: isWIFIConnected
                    ? "rgba(102, 204, 102, .1)"
                    : "rgba(187,17,51,.1)",
                },
              ]}
            >
              <Image
                source={
                  isWIFIConnected
                    ? require("../../../assets/iconsSvg/checkGreen.png")
                    : require("../../../assets/iconsSvg/checkRed.png")
                }
                style={{ width: 20, height: 20 }}
              />
              <Text style={styles.msgText}>
                {isWIFIConnected
                  ? "Wi-Fi connected"
                  : "Please connect to Wi-Fi"}
              </Text>
            </View>
            {/* Wi-Fi Message */}
            <View
              style={[
                styles.statusContainer,
                {
                  backgroundColor: hasBackupCheck
                    ? "rgba(102, 204, 102, .1)"
                    : "rgba(255,170,34,.1)",
                  marginBottom: 6,
                  marginTop: 6,
                },
              ]}
            >
              <Image
                source={
                  hasBackupCheck
                    ? require("../../../assets/iconsSvg/checkGreen.png")
                    : require("../../../assets/iconsSvg/checkYellow.png")
                }
                style={{ width: 20, height: 20 }}
              />
              <Text style={styles.msgText}>
                {hasBackupCheck
                  ? "You've recently made a backup"
                  : "You should create a backup!"}
              </Text>
            </View>
            {/* Update message */}
            <View
              style={[
                styles.statusContainer,
                {
                  backgroundColor: hasEnoughStorageCheck
                    ? "rgba(102, 204, 102, .1)"
                    : "rgba(187,17,51,.1)",
                  marginBottom: 6,
                  marginTop: 6,
                },
              ]}
            >
              <Image
                source={
                  hasEnoughStorageCheck
                    ? require("../../../assets/iconsSvg/checkGreen.png")
                    : require("../../../assets/iconsSvg/checkRed.png")
                }
                style={{ width: 20, height: 20 }}
              />
              <Text style={styles.msgText}>
                {hasEnoughStorageCheck
                  ? "Sufficient space available"
                  : "Not enough space! You should delete apps, videos and photos that you no longer need."}
              </Text>
            </View>
            <View
              style={[
                styles.statusContainer,
                {
                  backgroundColor: isDeviceCharging
                    ? "rgba(102, 204, 102, .1)"
                    : "rgba(187,17,51,.1)",
                },
              ]}
            >
              <Image
                source={
                  isDeviceCharging
                    ? require("../../../assets/iconsSvg/checkGreen.png")
                    : require("../../../assets/iconsSvg/checkRed.png")
                }
                style={{ width: 20, height: 20 }}
              />
              <Text style={styles.msgText}>
                {isDeviceCharging
                  ? "Charger connected"
                  : "Connect your charger!"}
              </Text>
            </View>
          </View>
          <View style={styles.messageContainer}>
            <Text style={{ fontSize: 16 }}>
              {isReadyForUpdate
                ? "To find out how to install the update, please read our installation guide."
                : "Please fix the issues mentioned above before continuing"}
            </Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.bottom, { borderTopColor: "rgba(144,128,144,0.2)" }]}
        onPress={() => navigation.navigate("Tutorial")}
      >
        <Text style={styles.bottomBtn}>Installation guide </Text>
        <Svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <Path
            d="M9 18L15 12L9 6"
            stroke="#708090"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </Svg>
      </TouchableOpacity>
    </View>
  );
};

export default FinalInfo;

const styles = StyleSheet.create({
  mainContainer: {
    borderRadius: 20,
    width: width - 20,
    backgroundColor: "#FFF",
    marginHorizontal: 10,
  },
  container: {
    padding: 20,
  },
  titleContainer: {
    paddingBottom: 20,
  },
  subTitle: {
    color: "#607080",
    fontSize: 14,
    paddingBottom: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  infoContainer: {},
  row: {
    borderTopWidth: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  leftText: {
    fontSize: 16,
  },
  rightText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  msgsContainer: {},
  statusContainer: {
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 8,
    flexDirection: "row",
    borderRadius: 8,
  },
  msgText: {
    fontSize: 14,
    fontWeight: "bold",
    paddingLeft: 10,
    width: "94%",
  },
  messageContainer: {
    paddingTop: 20,
  },
  bottom: {
    borderTopWidth: 1,
    padding: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  bottomBtn: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
