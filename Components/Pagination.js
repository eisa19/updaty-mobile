import { StyleSheet, Text, View } from "react-native";
import React from "react";

const Pagination = ({ content, activeCardId }) => {
  return (
    <View style={styles.paginationContainer}>
      <View
        style={[
          styles.paginationBox,
          { backgroundColor: "rgba(255,255,255,0.8)" },
        ]}
      >
        {content.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  activeCardId === index + 1 ? "#d72c16" : "gray",
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default Pagination;

const styles = StyleSheet.create({
  paginationContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    bottom: 10,
    width: "100%",
  },
  paginationBox: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    paddingHorizontal: 4,
  },
  dot: {
    width: 10,
    aspectRatio: 1,
    borderRadius: 5,
    margin: 10,
    marginHorizontal: 5,
  },
});
