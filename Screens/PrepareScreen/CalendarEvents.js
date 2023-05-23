import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";

import ArrowSvg from "../../assets/iconsSvg/ArrowSvg";

const { width, height } = Dimensions.get("window");

import * as Calendar from "expo-calendar";

//Navigation
import { useNavigation } from "@react-navigation/native";

const endingDate = 2; //CHANGE RANGE
const startingData = 10;

const TWO_YEARS_AGO = new Date(
  Date.now() - endingDate * 365 * 24 * 60 * 60 * 1000
); // 2 years ago
const TEN_YEARS_AGO = new Date(
  Date.now() - startingData * 365 * 24 * 60 * 60 * 1000
); // 2 years ago

export default function CalendarEvents() {
  const [events, setEvents] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      await askCalendarPermission();

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
    })();
  }, []);

  async function deleteEvent(eventId) {
    await Calendar.deleteEventAsync(eventId);
    setEvents(events.filter((event) => event.id !== eventId));
  }

  async function deleteAllEvents() {
    for (const event of events) {
      await Calendar.deleteEventAsync(event.id);
    }
    setEvents([]);
  }

  async function askCalendarPermission() {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== "granted") {
      console.warn("Calendar permission not granted");
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  console.log(events.length);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => deleteEvent(item.id)}
      style={{ padding: 5, margin: 5, borderWidth: 1 }}
    >
      <View style={[styles.row, { borderTopColor: "rgba(144,128,144,0.2)" }]}>
        <Text style={styles.leftText}>{item.title}</Text>
        <Text>{formatDate(item.endDate)}</Text>
        <Text style={styles.rightText}>{deviceFreeDiskSpace} Delete</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.titleContainer}
        onPress={() => navigation.goBack()}
      >
        <ArrowSvg />

        <Text style={styles.title}>Delete old calendar entries</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={deleteAllEvents}
        style={styles.deleteAllContainer}
      >
        <Text style={{ color: "white" }}>Delete All</Text>
      </TouchableOpacity>

      <View style={styles.cardContainer}>
        {events.length < 1 ? (
          <View style={styles.noEntriesContainer}>
            <Text
              style={{
                textAlign: "center",
                paddingHorizontal: 30,
                fontSize: 20,
              }}
            >
              🎉 It looks like you do not have any old entries. Good job in
              keeping your calendar tidy.
            </Text>
          </View>
        ) : (
          <FlatList
            data={events}
            renderItem={renderItem}
            keyExtractor={(item, index) => index}
          />
        )}
      </View>
    </View>
  );
}

//TODO - Test calendar entries on iOS

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf0f3",
    paddingTop: height / 15,
    height: height,
  },
  scrollView: { flex: 1 },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 20,
    paddingLeft: 10,
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 6,
  },
  cardContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 50,
  },

  cardContainer: {
    borderRadius: 12,
    width: width - 20,
    backgroundColor: "#FFF",
    marginHorizontal: 10,
    marginTop: 20,
    minHeight: height / 2,
    padding: 20,
    marginBottom: width / 3,
  },
  deleteAllContainer: {
    borderRadius: 12,
    width: width - 20,
    backgroundColor: "#FFF",
    marginHorizontal: 10,
    marginTop: 10,
    padding: 10,
    alignItems: "center",
    backgroundColor: "#d72c16",
  },
  noEntriesContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});
