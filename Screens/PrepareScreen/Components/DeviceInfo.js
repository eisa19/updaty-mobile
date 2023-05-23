import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Dimensions, Image } from "react-native";

const { width, height } = Dimensions.get("window");

//TODO - Check with Nikolaus if we want to be super

import * as Device from "expo-device";

import greenCheck from '../../../assets/iconsSvg/checkGreen.png'
import redCheck from '../../../assets/iconsSvg/checkRed.png'


const DeviceInfo = ({ isWIFIConnected, isUpdateAvailable, maxOsUpdate }) => {

 


  
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.subTitle}>Step 1 of 5</Text>
        <Text style={styles.title}>Info about your device</Text>
      </View>
      <View style={styles.infoContainer}>
        {/* Row 1*/}
        <View style={[styles.row, { borderTopColor: "rgba(144,128,144,0.2)" }]}>
          <Text style={styles.leftText}>Your device</Text>
          <Text style={styles.rightText}>{Device.modelName}</Text>
        </View>
        {/* Row 2 */}
        <View style={[styles.row, { borderTopColor: "rgba(144,128,144,0.2)" }]}>
          <Text style={styles.leftText}>Current iOS version</Text>
          <Text style={styles.rightText}>{Device.osVersion}</Text>
        </View>
        {/* Row 3 */}
        <View style={[styles.row, { borderTopColor: "rgba(144,128,144,0.2)" }]}>
          <Text style={styles.leftText}>Supported iOS version</Text>
          <Text style={styles.rightText}>{maxOsUpdate}</Text>
        </View>
        {/* Row 4 */}
        <View style={[styles.row, { borderTopColor: "rgba(144,128,144,0.2)" }]}>
          <Text style={styles.leftText}>Wi-Fi state</Text>
          <Text style={styles.rightText}>
            {isWIFIConnected ? "connected" : "not connected"}
          </Text>
        </View>
        {/* Messages  */}
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
                  ? greenCheck
                  : redCheck
              }
              style={{ width: 20, height: 20 }}
            />
            <Text style={styles.msgText}>
              {isWIFIConnected ? "Wi-Fi connected" : "Please connect to Wi-Fi"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default DeviceInfo;

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
});
