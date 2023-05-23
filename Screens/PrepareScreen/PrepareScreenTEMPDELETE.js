import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";

//Device info
import * as FileSystem from "expo-file-system";
import * as Battery from "expo-battery";
import { Platform } from "react-native";
import Constants from "expo-constants";
import * as Device from "expo-device";
import { getTotalDiskCapacityAsync } from "expo-device";
import NetInfo from "@react-native-community/netinfo";
import * as Contacts from "expo-contacts";
// import DeviceInfo from "react-native-device-info";

const { width, height } = Dimensions.get("window");

const PrepareScreen = () => {
  const [deviceMake, setDeviceMake] = useState("");
  const [deviceModel, setdeviceModel] = useState("");
  const [OSVersion, setOSVersion] = useState("");
  const [deviceMemory, setDeviceMemory] = useState("");
  const [deviceTotalDiskSpace, setDeviceTotalDiskSpace] = useState("");
  const [deviceFreeDiskSpace, setDeviceFreeDiskSpace] = useState("");
  const [deviceCurrentBattery, setDeviceCurrentBattery] = useState(100);
  const [isDeviceCharging, setIsDeviceCharging] = useState(false);
  const [isWIFIConnected, setIsWIFIConnected] = useState(false);
  const [batteryStatusChanged, setBatteryStatusChanged] = useState(false);
  const [lastBackup, setLastBackup] = useState("");

  useEffect(() => {
    const checkLastUpdate = async () => {
      const backupPath = FileSystem.documentDirectory + "backup.db"; // Replace 'backup.db' with your backup file name
      const info = await FileSystem.getInfoAsync(backupPath);
      const modificationTime = info.modificationTime;
      const lastBackupDate = new Date(modificationTime).toLocaleString();

      setLastBackup(lastBackupDate);
    };

    checkLastUpdate();
  }, []);

  //========================================================
  //BATTERY LEVEL AND CAHRGING - V
  //========================================================

  useEffect(() => {
    const getBatteryStatus = async () => {
      const status = await Battery.getPowerStateAsync();
      const charging = await Battery.getBatteryStateAsync();

      //Math.round(status.toFixed(2) * 100)

      setDeviceCurrentBattery(status);

      setIsDeviceCharging(
        charging === Battery.BatteryState.CHARGING ||
          charging === Battery.BatteryState.FULL
      );
    };
    getBatteryStatus();

    const subscription = Battery.addBatteryStateListener((event) => {
      if (event.batteryState === 2) {
        setIsDeviceCharging(true);
      } else {
        setIsDeviceCharging(false);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  //========================================================
  //IS CONNECTED TO WIFI - V
  //========================================================
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsWIFIConnected(state.isConnected && state.type === "wifi");
    });

    return () => {
      unsubscribe();
    };
  }, []);

  //========================================================
  //GET DEVICE INFO
  //========================================================
  useEffect(() => {
    async function getFileSystemInfo() {
      //DEVICE MODEL & MAKE
      setDeviceMake(Device.manufacturer);
      setdeviceModel(Device.modelName);

      //DEVIEC OS VERSION
      setOSVersion(Device.osVersion);

      //GET DEVICE MAX MEMORY
      setDeviceMemory((Device.totalMemory / 1024 / 1024 / 1024).toFixed(2));

      //GET DEVICE STORAGE
      const getStorageInfo = async () => {
        const totalFreeDiskCapacity =
          await FileSystem.getFreeDiskStorageAsync();
        const totalDiskCapacity = await FileSystem.getTotalDiskCapacityAsync();

        //TOTAL FREE SPACE
        setDeviceFreeDiskSpace(
          (totalFreeDiskCapacity / 1024 / 1024 / 1024).toFixed(2)
        );

        setDeviceTotalDiskSpace(
          (totalDiskCapacity / 1024 / 1024 / 1024).toFixed(2)
        );
      };

      //DISK USAGE BY FOLDER
      //TODO - TEST ON REAL iOS Device

      getStorageInfo();

      const getFolderSize = async () => {
        const folderPath = `${FileSystem.documentDirectory}photos/`;

        try {
          // Get list of files in the folder
          const files = await FileSystem.readDirectoryAsync(folderPath);

          // Calculate total size of files in the folder
          let totalSize = 0;
          for (let i = 0; i < files.length; i++) {
            const fileInfo = await FileSystem.getInfoAsync(
              `${folderPath}${files[i]}`
            );
            totalSize += fileInfo.size;
          }
        } catch (error) {
          console.log(error);
        }
      };
      getFolderSize();
    }

    getFileSystemInfo();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Make: {deviceMake}</Text>
      <Text>Model: {deviceModel}</Text>
      <Text>OS Version: {OSVersion}</Text>
      <Text>Total Memory: {deviceMemory} GB</Text>
      <Text>Total HD Space: {deviceTotalDiskSpace} GB</Text>
      <Text>Free HD Space: {deviceFreeDiskSpace}</Text>
      <Text>
        Is Low Power mode on? {deviceCurrentBattery.lowPowerMode ? "Yes" : "No"}
      </Text>

      <Text>
        Current Battery: {Math.round(deviceCurrentBattery.batteryLevel * 100)}%
      </Text>
      <Text>Is Charging: {isDeviceCharging ? "Yes" : "No"}</Text>
      <Text>
        Are you connected to the WIFI? {isWIFIConnected ? "Yes" : "No"}
      </Text>
      <Text>Last backup: {lastBackup}</Text>
    </View>
  );
};

export default PrepareScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf0f3",
    paddingTop: height / 15,
    height: height,
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
});
