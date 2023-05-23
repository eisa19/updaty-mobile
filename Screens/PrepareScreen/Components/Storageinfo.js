import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";

//Navigation
import { useNavigation } from "@react-navigation/native";

//Progress barr
import { Bar } from "react-native-progress";

const { width, height } = Dimensions.get("window");

//Device info
import * as FileSystem from "expo-file-system";
import * as Contacts from "expo-contacts";
import * as Calendar from "expo-calendar";
import * as MediaLibrary from "expo-media-library";
import { useCalendarPermissions } from "expo-calendar";

//SVG
import { Path, Svg } from "react-native-svg";
import ArrowUp from "../../../assets/iconsSvg/ArrowUp";
import ArrowDown from "../../../assets/iconsSvg/ArrowDown";
import ArrowRight from "../../../assets/iconsSvg/ArrowRight";

//TODO - Figure out how to get the usage space for each folder
//TODO - Should i have the second warning if there is enough space?

const Storageinfo = ({ setHasEnoughStorageCheck }) => {
  const [deviceTotalDiskSpace, setDeviceTotalDiskSpace] = useState("");
  const [deviceFreeDiskSpace, setDeviceFreeDiskSpace] = useState("");
  const [hasEnoughStorage, setHasEnoughStorage] = useState(false);
  const [isUsageDetailsOpen, setIsUsageDetailsOpen] = useState(false);
  const [isCleanUpOptionsOpen, setIsCleanUpOptionsOpen] = useState(false);
  const [progressBarStorage, setProgressBarStorage] = useState(1);

  const navigation = useNavigation();

  //========================================================
  //GET DEVICE INFO
  //========================================================

  const [photosSize, setPhotosSize] = useState(0);
  const [documentsSize, setDocumentsSize] = useState(0);
  const [videosSize, setVideosSize] = useState(0);

  useEffect(() => {
    const getStorageInfo = async () => {
      const totalFreeDiskCapacity = await FileSystem.getFreeDiskStorageAsync();
      const totalDiskCapacity = await FileSystem.getTotalDiskCapacityAsync();

      //TOTAL FREE SPACE
      setDeviceFreeDiskSpace(
        (totalFreeDiskCapacity / 1024 / 1024 / 1024).toFixed(2)
      );

      setDeviceTotalDiskSpace(
        (totalDiskCapacity / 1024 / 1024 / 1024).toFixed(2)
      );
      setProgressBarStorage(
        (totalFreeDiskCapacity / 1024 / 1024 / 1024).toFixed(2) /
          (totalDiskCapacity / 1024 / 1024 / 1024).toFixed(2)
      );
    };

    getStorageInfo();

    if (deviceFreeDiskSpace > 5) {
      setHasEnoughStorage(true);
      setHasEnoughStorageCheck(true);
    }

    //  const photosDirectory = `${FileSystem.documentDirectory}photos`;

    //  async function getPhotosDirectorySize() {
    //    console.log(FileSystem.documentDirectory);
    //  }

    //  getPhotosDirectorySize();

    async function getMediaLibrarySize() {
      try {
        const { status } = await MediaLibrary.requestPermissionsAsync();

        if (status === "granted") {
          const photos = await MediaLibrary.getAssetsAsync({
            mediaType: "photo",
          });
          const photosSize = photos.assets.reduce(
            (total, assets) => total + assets.height + assets.width,
            0
          );
          const photoDetail = await MediaLibrary.getAssetInfoAsync(
            photos.assets[0].id
          );
          console.log(photoDetail);

          console.log();
        } else {
          await MediaLibrary.requestPermissionsAsync();
        }

        const photosPath = `${FileSystem.documentDirectory}/photos`;
        const documentsPath = `${FileSystem.documentDirectory}/documents`;
        const videosPath = `${FileSystem.documentDirectory}/videos`;

        //! For development only. As this folder do not exist in the iOS simulator DO NOT Uncoment this for production
        //*Create Folder for Simulator
        // await FileSystem.makeDirectoryAsync(photosPath, {intermediates: true})
        // await FileSystem.makeDirectoryAsync(videosPath, {intermediates: true})
        // await FileSystem.makeDirectoryAsync(documentsPath, {intermediates: true})
        //* Add files to simulate used space
        const fileName = `photo-${Math.floor(Math.random() * 1000)}.jpg`;
        const fileContent =
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit";
        await FileSystem.writeAsStringAsync(
          `${photosPath}/${fileName}`,
          fileContent,
          {
            encoding: FileSystem.EncodingType.UTF8,
          }
        );

        //! ====================================================================================

        const photosStats = await FileSystem.getInfoAsync(photosPath);
        const videosStats = await FileSystem.getInfoAsync(videosPath);
        const documentsStats = await FileSystem.getInfoAsync(documentsPath);

        const covertBytes = (size, type) => {
          if (type === "photos") {
            if (size < 1024) {
              setPhotosSize(`${size} bytes`);
            } else if (size > 1024 && size < 1048576) {
              setPhotosSize(`${Math.round(size / 1024)} kb`);
            } else if (size > 1048576 && size < 1073741824) {
              setPhotosSize(`${Math.round(size / 1024 / 1024)} MB`);
            } else {
              setPhotosSize(`${Math.round(size / 1024 / 1024 / 1024)} GB`);
            }
          } else if (type === "videos") {
            if (size < 1024) {
              setVideosSize(`${size} bytes`);
            } else if (size > 1024 && size < 1048576) {
              setVideosSize(`${Math.round(size / 1024)} kb`);
            } else if (size > 1048576 && size < 1073741824) {
              setVideosSize(`${Math.round(size / 1024 / 1024)} MB`);
            } else {
              setVideosSize(`${Math.round(size / 1024 / 1024 / 1024)} GB`);
            }
          } else if (type === "documents") {
            if (size < 1024) {
              setDocumentsSize(`${size} bytes`);
            } else if (size > 1024 && size < 1048576) {
              setDocumentsSize(`${Math.round(size / 1024)} kb`);
            } else if (size > 1048576 && size < 1073741824) {
              setDocumentsSize(`${Math.round(size / 1024 / 1024)} MB`);
            } else {
              setDocumentsSize(`${Math.round(size / 1024 / 1024 / 1024)} GB`);
            }
          }
        };

        covertBytes(photosStats.size, "photos");
        covertBytes(videosStats.size, "videos");
        covertBytes(documentsStats.size, "documents");
      } catch (error) {
        console.log("Error getting media library size:", error);
      }
    }

    getMediaLibrarySize();
  }, [deviceFreeDiskSpace]);

  //======================================
  //Get amount of duplicated contacts
  //=====================================
  const [duplicatedContacts, setDuplicatedContacts] = useState([]);
  const getContacts = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === "granted") {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
      });

      const contactsMap = new Map();
      data.forEach((contact) => {
        if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
          const phoneNumber = contact.phoneNumbers[0].number.replace(/\D/g, "");
          if (phoneNumber.length > 0) {
            const existingContact = contactsMap.get(phoneNumber);
            if (existingContact) {
              contactsMap.set(phoneNumber, [...existingContact, contact]);
            } else {
              contactsMap.set(phoneNumber, [contact]);
            }
          }
        }
      });

      const duplicates = [];
      contactsMap.forEach((contactList) => {
        if (contactList.length > 1) {
          duplicates.push(...contactList);
        }
      });

      setDuplicatedContacts(duplicates);
    } else {
      Alert.alert(
        "Contacts permission not granted",
        "Please grant contacts permission to use this feature"
      );
    }
  };

  useEffect(() => {
    getContacts();
  }, []);

  //======================================
  //Get amount of old calendar entries
  //=====================================
  const [events, setEvents] = useState([]);
  const [permission, askForCalendarPermision] = useCalendarPermissions();

  const getCalendarEvents = async () => {
    if (permission.status === "granted") {
      const calendars = await Calendar.getCalendarsAsync();

      const eventList = [];

      for (const calendar of calendars) {
        const eventsInCalendar = await Calendar.getEventsAsync(
          [calendar.id],
          TEN_YEARS_AGO,
          TWO_YEARS_AGO
        );
        eventList.push(...eventsInCalendar);
      }

      setEvents(eventList);
    } else {
      askForCalendarPermision();
    }

    // const { status } = await Calendar.requestCalendarPermissionsAsync(Calendar.SCOPE_REMINDERS);
    // if (status !== "granted") {
    //   Alert.alert("Calendar permission", "Please grant calendar permission to use this feature")
    //   console.warn(
    //     "Calendar permission not granted, please grand permission to access this feature"
    //   );
    //   return
    // }
  };

  useEffect(() => {
    // getCalendarEvents()
  }, []);

  //Call calander and contacts again to update UI
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getCalendarEvents();
      getContacts();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.subTitle}>Step 2 of 5</Text>
        <Text style={styles.title}>Let's see if you have enough space...</Text>
      </View>
      <View style={styles.infoContainer}>
        {/* Row Prograss bar*/}
        <View style={[styles.row, { borderTopColor: "rgba(144,128,144,0.2)" }]}>
          <Bar
            // progress={deviceFreeDiskSpace / deviceTotalDiskSpace}
            progress={progressBarStorage}
            animated
            useNativeDriver={true}
            height={8}
            width={width - 65}
            unfilledColor={"#ecf0f3"}
            borderColor={"#ecf0f3"}
            color={
              hasEnoughStorage ? "rgba(102,204,102,1)" : "rgba(187,17,51,1)"
            }
          />
        </View>
        {/* Row 1*/}
        <View style={[styles.row, { borderTopColor: "rgba(144,128,144,0.2)" }]}>
          <Text style={styles.leftText}>Storage capacity</Text>
          <Text style={styles.rightText}>{deviceTotalDiskSpace} GB</Text>
        </View>
        {/* Row 2*/}
        <View style={[styles.row, { borderTopColor: "rgba(144,128,144,0.2)" }]}>
          <Text style={styles.leftText}>Storage available</Text>
          <Text style={styles.rightText}>{deviceFreeDiskSpace} GB</Text>
        </View>
        {/* Row 3*/}
        <TouchableOpacity
          onPress={() =>
            setIsUsageDetailsOpen((isUsageDetailsOpen) => !isUsageDetailsOpen)
          }
          style={[styles.row, { borderTopColor: "rgba(144,128,144,0.2)" }]}
        >
          <Text style={styles.leftText}>Usage details</Text>
          <View style={styles.rightText}>
            {isUsageDetailsOpen ? <ArrowUp /> : <ArrowDown />}
          </View>
        </TouchableOpacity>
        {/* Usage details dropdown */}
        {isUsageDetailsOpen && (
          <View style={styles.dropDownContainer}>
            {/* Row 1 */}
            <View
              style={[
                styles.rowGray,
                {
                  borderBottomColor: "rgba(144,128,144,0.2)",
                  borderBottomWidth: 1,
                },
              ]}
            >
              <Text style={styles.leftText}>Photos</Text>
              <Text style={styles.rightText}>{photosSize}</Text>
            </View>
            {/* Row 2 */}
            <View
              style={[
                styles.rowGray,
                {
                  borderBottomColor: "rgba(144,128,144,0.2)",
                  borderBottomWidth: 1,
                },
              ]}
            >
              <Text style={styles.leftText}>Videos</Text>
              <Text style={styles.rightText}>{videosSize}</Text>
            </View>

            {/* Row 3 */}
            <View
              style={[
                styles.rowGray,
                { borderTopColor: "rgba(144,128,144,0.2)" },
              ]}
            >
              <Text style={styles.leftText}>Documents</Text>
              <Text style={styles.rightText}>{documentsSize}</Text>
            </View>
          </View>
        )}
        {/* Row 4*/}
        <TouchableOpacity
          onPress={() =>
            setIsCleanUpOptionsOpen(
              (isCleanUpOptionsOpen) => !isCleanUpOptionsOpen
            )
          }
          style={[styles.row, { borderTopColor: "rgba(144,128,144,0.2)" }]}
        >
          <Text style={styles.leftText}>Clean up options</Text>
          <View style={styles.rightText}>
            {isCleanUpOptionsOpen ? <ArrowUp /> : <ArrowDown />}
          </View>
        </TouchableOpacity>
        {/* Clean up options dropdown */}
        {isCleanUpOptionsOpen && (
          <View style={styles.dropDownContainer}>
            {/* Row 1 */}
            <TouchableOpacity
              onPress={() => {
                if (events.length < 1) return;
                navigation.navigate("CalendarEvents");
              }}
              style={[
                styles.rowGray,
                {
                  borderBottomColor: "rgba(144,128,144,0.2)",
                  borderBottomWidth: 1,
                },
              ]}
            >
              <Text style={styles.leftText}>Old calendar entries</Text>
              <View style={styles.rightText}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  {events.length}
                </Text>
                <ArrowRight />
              </View>
            </TouchableOpacity>
            {/* Row 2 */}
            <TouchableOpacity
              style={[styles.rowGray]}
              onPress={() => {
                if (duplicatedContacts.length < 1) return;
                navigation.navigate("DuplicatedContacts");
              }}
            >
              <Text style={styles.leftText}>Duplicate contacts</Text>
              <View style={styles.rightText}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  {duplicatedContacts.length}
                </Text>
                <ArrowRight />
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Messages  */}
        <View style={styles.msgsContainer}>
          {/* Storage message */}
          <View
            style={[
              styles.statusContainer,
              {
                backgroundColor: hasEnoughStorage
                  ? "rgba(102, 204, 102, .1)"
                  : "rgba(187,17,51,.1)",
                marginBottom: 6,
                marginTop: 6,
              },
            ]}
          >
            <Image
              source={
                hasEnoughStorage
                  ? require("../../../assets/iconsSvg/checkGreen.png")
                  : require("../../../assets/iconsSvg/checkRed.png")
              }
              style={{ width: 20, height: 20 }}
            />
            <Text style={styles.msgText}>
              {hasEnoughStorage
                ? "Sufficient space available"
                : "Not enough space! You should delete apps, videos and photos that you no longer need."}
            </Text>
          </View>

          {/* Clean up message Message */}
          {!hasEnoughStorage && (
            <View
              style={[
                styles.statusContainer,
                {
                  backgroundColor: "rgba(255,170,34,.1)",
                },
              ]}
            >
              <Image
                source={require("../../../assets/iconsSvg/checkYellow.png")}
                style={{ width: 20, height: 20 }}
              />
              <Text style={styles.msgText}>
                You should clean up you device!
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default Storageinfo;

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
    flexDirection: "row",
    alignItems: "center",
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
  dropDownContainer: {
    backgroundColor: "#ecf0f3",
    borderRadius: 8,
    marginBottom: 16,
  },
  rowGray: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
});
