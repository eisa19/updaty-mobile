import { StyleSheet, Text, View, Dimensions, Image } from "react-native";
import React from "react";

const { width, height } = Dimensions.get("window");

const Initial = () => {
  return (
    <View style={styles.container}>
      <View>
        <Image
          style={styles.image}
          source={require("../../../assets/27.png")}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.subTitle}>Time for an update?</Text>
        <Text style={styles.title}>
          Let's check for an update and prepare your system
        </Text>
        <Text style={styles.description}>
          Find out if your device can be updated and make the necessary
          preparations. Our Update Assistant will guide you through 5 easy
          steps. Swipe left to begin.
        </Text>
      </View>
    </View>
  );
};

export default Initial;

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    width: width - 20,
    backgroundColor: "#FFF",
    marginHorizontal: 10,
    // minHeight: height,
    padding: 20,
  },
  image: {
    // width: "50%",
  },
  textContainer: {},
  subTitle: {
    color: "#607080",
    fontSize: 14,
    paddingVertical: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    paddingBottom: 10,
  },
  description: {
    fontSize: 16,
    // lineHeight: 27,
  },
});
