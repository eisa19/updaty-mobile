import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  Pressable,
  TouchableOpacity,
} from "react-native";

const { width, height } = Dimensions.get("window");

import * as SecureStore from "expo-secure-store";

const BackupInfo = ({ setHasBackupCheck }) => {
  const [hasBackup, setHasBackup] = useState(false);
  const [lastBackupDate, setLastBackupDate] = useState("No Backup");
  const [hasBackedupLast6Month, sethasBackedupLast6Month] = useState(false);

  useEffect(() => {
    if (lastBackupDate !== "No Backup") {
      setHasBackupCheck(true);
      setHasBackup(true);
    }
  }, [lastBackupDate]);

  async function storeDate(date) {
    //! For testing only------------------------------
    // try {
    //   await SecureStore.deleteItemAsync("lastBackup");
    //   setLastBackupDate("No backup");
    //   setHasBackup(false);
    // } catch (error) {
    //   console.log(error);
    // }
    //!-----------------------------------------------
    try {
      await SecureStore.setItemAsync("lastBackup", date.toString());
      // console.log("Date stored successfully");
      const newDate = new Date(date);
      const formattedDate = newDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      setLastBackupDate(formattedDate);
    } catch (error) {
      console.log("Error storing date:", error);
    }
  }

  useEffect(() => {
    async function retrieveDate() {
      try {
        const dateStr = await SecureStore.getItemAsync("lastBackup");
        if (dateStr === null) return;

        const date = new Date(dateStr);
        const formattedDate = date.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        if (date.getTime() < sixMonthsAgo.getTime()) {
          // stored date is older than 6 months ago
          setHasBackup(true);
          setLastBackupDate(formattedDate);
          sethasBackedupLast6Month(true);
          // console.log(
          //   `Stored date ${formattedDate} is older than 6 months ago.`
          // );
        } else {
          // stored date is newer than or equal to 6 months ago
          setHasBackup(true);
          setLastBackupDate(formattedDate);
          sethasBackedupLast6Month(false);
          // console.log(
          //   `Stored date ${formattedDate} is newer than or equal to 6 months ago.`
          // );
        }
      } catch (error) {
        console.log("Error retrieving date:", error);
      }
    }
    retrieveDate();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.subTitle}>Step 3 of 5</Text>
        <Text style={styles.title}>Did you backup your data?</Text>
      </View>
      <View style={styles.infoContainer}>
        {/* Row 1*/}
        <View style={[styles.row, { borderTopColor: "rgba(144,128,144,0.2)" }]}>
          <Text style={styles.leftText}>Last backup</Text>
          <Text style={styles.rightText}>{lastBackupDate}</Text>
        </View>
        {!hasBackup && (
          <View>
            {/* Row 2 */}
            <View
              style={[
                styles.rowInstructions,
                { borderTopColor: "rgba(144,128,144,0.2)" },
              ]}
            >
              <Text style={styles.rightText}>
                How to back up your iPhone or iPad with iCloud{" "}
              </Text>
              <Text style={styles.instructionsList}>
                1.Connect your device to a Wi-Fi network.
              </Text>
              <Text style={styles.instructionsList}>
                2.Go to Settings {">"} [your name], and tap iCloud.
              </Text>
              <Text style={styles.instructionsList}>3.Tap iCloud Backup.</Text>
              <Text style={styles.instructionsList}>
                4.Tap Back Up Now. Stay connected to your Wi-Fi network until
                the process has finished. Under Back Up Now, you'll see the date
                and time of your last backup.
              </Text>
              <Text style={styles.instructionsList}>
                5.Return to updatly app and confirm your backup
              </Text>
            </View>
            {/* Confirm backup */}
            <TouchableOpacity
              onPress={() => storeDate(new Date())}
              style={[
                styles.confirmBtn,
                {
                  borderTopColor: "rgba(144,128,144,0.2)",
                  borderBottomColor: "rgba(144,128,144,0.2)",
                },
              ]}
            >
              <Text style={styles.leftText}>Click here to confirm backup </Text>
              {/* <Text style={styles.rightText}>NO</Text> */}
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.msgsContainer}>
          <View
            style={[
              styles.statusContainer,
              {
                backgroundColor: hasBackup
                  ? "rgba(102, 204, 102, .1)"
                  : "rgba(255,170,34,.1)",
                marginBottom: 6,
                marginTop: 6,
              },
            ]}
          >
            <Image
              source={
                hasBackup
                  ? require("../../../assets/iconsSvg/checkGreen.png")
                  : require("../../../assets/iconsSvg/checkYellow.png")
              }
              style={{ width: 20, height: 20 }}
            />
            <Text style={styles.msgText}>
              {hasBackup
                ? "You've recently made a backup"
                : "You should create a backup!"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default BackupInfo;

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    width: width - 20,
    backgroundColor: "#FFF",
    marginHorizontal: 10,
    // minHeight: height,
    padding: 20,
    // justifyContent: "space-between",

    //  shadowColor: "#000",
    //  shadowOffset: {
    //    width: 0,
    //    height: 4,
    //  },
    //  shadowOpacity: 0.3,
    //  shadowRadius: 4.65,

    //  elevation: 8,
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
  confirmBtn: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
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
  rowInstructions: {
    borderTopWidth: 1,
    paddingVertical: 8,
  },
  instructionsList: {
    paddingVertical: 4,
    paddingLeft: 18,
  },
});
