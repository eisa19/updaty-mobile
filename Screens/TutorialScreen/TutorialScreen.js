import React, { useState, useRef, useEffect } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  ScrollView,
} from "react-native";

//Components
import Card from "../../Components/Card";
import Pagination from "../../Components/Pagination";

//Redux
import { useDispatch } from "react-redux";
import { handleClick } from "../../Redux/slices/adSlice";

// import { ScrollView } from "react-native-gesture-handler";

//Content TEMP
import tutorials from "../../utils/tutorials.json";
import tutorialsHTML from "../../utils/tutorialsHTML.json";

const { width, height } = Dimensions.get("window");

const TutorialScreen = () => {
  const [activeCardId, setActiveCardId] = useState(null);
  const dispatch = useDispatch();

  //Set viewability of each post based on the id of the post
  const viewabilityConfig = {
    itemVisiblePercentThreshold: 51,
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      dispatch(handleClick());
      setActiveCardId(viewableItems[0].item.id);
    }
  });

  const getItemLayout = (data, index) => ({
    length: width - 20, // width of an item in the list
    offset: width * index, // position of the item in the list
    index,
  });

  console.log();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View>
          <Text style={styles.title}>Tutorials</Text>
        </View>
        <View style={styles.cardContainer}>
          <FlatList
            data={tutorialsHTML}
            snapToInterval={width} // Distance between each snap point
            snapToAlignment={"center"} // Align snap point to the center of the view
            getItemLayout={getItemLayout}
            showsHorizontalScrollIndicator={false}
            initialNumToRender={tutorials.length / 6}
            renderItem={({ item }) => <Card content={item} />}
            keyExtractor={(item) => item.id}
            horizontal
            viewabilityConfig={viewabilityConfig}
            onViewableItemsChanged={onViewableItemsChanged.current}
          />
        </View>
      </ScrollView>
      <Pagination content={tutorials} activeCardId={activeCardId} />
    </View>
  );
};

export default TutorialScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf0f3",
    paddingTop: height / 15,
    height: height,
  },
  scrollView: { flex: 1 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    paddingHorizontal: 18,
    paddingTop: 20,
  },
  cardContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 50,
  },
});
