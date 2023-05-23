import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";

const { width, height } = Dimensions.get("window");

import RenderHtml from "react-native-render-html";
import { ScrollView } from "react-native";

const htmlSource = {
  html: `
      <html>
        <div>
          <div>
            <p class=subTitle >Subtitle Lorem ipsum</p> 
          </div>
          <div>
            <p class=title>This is a long title dolor sit amet sed do 3</p>
          </div>
          <div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla finibus libero eu mauris venenatis, non malesuada elit volutpat. Sed eu neque at leo aliquam blandit. Nam vel orci sed lacus gravida auctor. In euismod, justo eget ultrices iaculis, dui elit pulvinar risus, quis ultricies tellus ipsum non tellus.</p>
          </div>
          <div>
            <img src=https://images.unsplash.com/photo-1585060282215-39a72f82385c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2087&q=80 alt=placeholder >
          </div>
          <div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla finibus libero eu mauris venenatis, non malesuada elit volutpat. Sed eu neque at leo aliquam blandit. Nam vel orci sed lacus gravida auctor. In euismod, justo eget ultrices iaculis, dui elit pulvinar risus, quis ultricies tellus ipsum non tellus.</p> </div><div><img src=https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8bW9iaWxlJTIwcGhvbmV8ZW58MHx8MHx8&auto=format&fit=crop&w=1200&q=60 alt=placeholder > 
          </div>
          <div>
            <ul>
              <li >Lorem ipsum dolor sit amet, consectetur adipilibero eu mauris 1</li>
              <li >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla finibus libero eu mauris 2</li>
              <li >Lorem insectetur adipiscing elit. Nulla finibus libero eu mauris 3</li>
              <li> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla finibus libero eu mauris 4</li>
              <li >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla finibus libero eu mauris 5</li>
            </ul>
            <ol>
              <li >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla finibus libero eu mauris 1</li>
              <li >Lorem ipsum dolor sit amet, conelit. Nulla finibus libero eu mauris 2</li> 
              <li>Lorem ipsum dolortetur adipiscing elit. Nulla finibus libero eu mauris 3</li>
              <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla finibus libero eu mauris 4</li>
              <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.  Nulla  mauris 5</li>
            </ol> 
            <div>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla finibus libero eu mauris venenatis, non malesuada elit volutpat. Sed eu neque at leo aliquam blandit. Nam vel orci sed lacus gravida auctor. In euismod, justo eget ultrices iaculis, dui elit pulvinar risus, quis ultricies tellus ipsum non tellus.</p>
            </div>
          </div> 
        </div> 
      </html>
    `,
};

const tagStyles = {
  img: {
    width: "100%",
    objectFit: "cover",
    marginVertical: 10,
  },
  li: {
    paddingBottom: 10,
    fontStyle: "italic",
  },
};

const classesStyles = {
  subTitle: {
    color: "#999",
  },
  title: {
    fontSize: "22px",
    color: "#000",
    fontWeight: "bold",
  },
};

const Card = ({ content }) => {
  const htmlSource = {
    html: `${content.html}`,
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <RenderHtml
          contentWidth={width - 20}
          source={htmlSource}
          tagsStyles={tagStyles}
          classesStyles={classesStyles}
        />
        {/* <View>
        <View style={styles.subTitleContainer}>
        <Text style={styles.subTitle}>{content.subTitle}</Text>
        </View>
        <View style={styles.titleContainer}>
        <Text style={styles.title}>{content.title}</Text>
        </View>
        <View style={styles.contentContainer}>
        <Text style={styles.content}>{content.content}</Text>
        </View>
      </View>
      <View style={styles.imgContainer}>
        <Image source={{ uri: content.imgUrl }} style={styles.img} />
      </View> */}
      </ScrollView>
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    width: width - 20,
    backgroundColor: "#FFF",
    marginHorizontal: 10,
    minHeight: height / 1.5,
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
  subTitleContainer: {},
  subTitle: {
    color: "#607080",
    fontSize: 14,
  },
  titleContainer: {
    paddingVertical: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  contentContainer: {
    paddingTop: 5,
  },
  content: {
    fontSize: 16,
  },
  imgContainer: {
    marginTop: 10,
  },
  img: {
    width: "100%",
    minHeight: 175,
    objectFit: "cover",
    borderRadius: 20,
  },
});
