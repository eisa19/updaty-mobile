import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

//Utills
import { concatString } from "../../utils/utilFunctions";

const { width, height } = Dimensions.get("window");

const CardSmall15 = ({ content, index }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        navigation.navigate("NewInV15SubScreen", { index: index });
      }}
    >
      <View style={styles.imgContainer}>
        <Image source={{ uri: content.imgUrl }} style={styles.img} />
      </View>

      <View style={styles.leftContainer}>
        <View style={styles.subTitleContainer}>
          <Text style={styles.subTitle}>{content.subTitle}</Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{concatString(content.title, 80)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CardSmall15;

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    width: width - 22,
    backgroundColor: "#FFF",
    minHeight: 90,
    padding: 8,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginVertical: 8,

    //  shadowColor: "#000",
    //  shadowOffset: {
    //    width: 0,
    //    height: 4,
    //  },
    //  shadowOpacity: 0.3,
    //  shadowRadius: 4.65,

    //  elevation: 8,
  },
  imgContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  img: {
    width: 80,
    height: 80,
    objectFit: "cover",
    borderRadius: 8,
  },
  leftContainer: {
    paddingHorizontal: 18,
  },
  subTitleContainer: {},
  subTitle: {
    color: "#607080",
    fontSize: 14,
  },
  titleContainer: {
    width: "90%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
