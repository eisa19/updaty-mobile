import React, { useEffect, useState } from "react";
import {
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  View,
  Alert,
  Dimensions,
  ActivityIndicator,
} from "react-native";

import ArrowSvg from "../../assets/iconsSvg/ArrowSvg";

const { width, height } = Dimensions.get("window");

//Device info
import * as Contacts from "expo-contacts";

//Navigation
import { useNavigation } from "@react-navigation/native";

function App({route}) {
  const [duplicatedContacts, setDuplicatedContacts] = useState([]);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getContacts = async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
        });

        const contactsMap = new Map();
        data.forEach((contact) => {
          if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
            const phoneNumber = contact.phoneNumbers[0].number.replace(
              /\D/g,
              ""
            );
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
        setLoading(false);
      } else {
        Alert.alert(
          "Contacts permission not granted",
          "Please grant contacts permission to use this feature"
        );
      }
    };

    getContacts();
  }, []);

  const deleteContact = async (contactId) => {
    try {
      await Contacts.removeContactAsync(contactId);
      setDuplicatedContacts((prevState) =>
        prevState.filter((contact) => contact.id !== contactId)
      );
    } catch (error) {
      Alert.alert(
        "Permission",
        "It looks like you do not have permission to delete contacts, please go to your phone app and delete the contacts there."
      );
      console.log("Error deleting contact: ", error);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View
        style={[styles.row, { borderBottomColor: "rgba(144,128,144,0.2)" }]}
      >
        <View>
          <Text style={styles.leftText}>{item.name}</Text>
          <Text style={styles.rightText}>{item.phoneNumbers[0].number}</Text>
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteContact(item.id)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, height: height, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.titleContainer}
        onPress={() => navigation.goBack()}
      >
        <ArrowSvg />

        <Text style={styles.title}>Delete duplicate contacts</Text>
      </TouchableOpacity>

      <View style={styles.cardContainer}>
        {duplicatedContacts.length < 1 ? (
          <View style={styles.noEntriesContainer}>
            <Text style={{ textAlign: "center", paddingHorizontal: 30 }}>
            🎉It looks like you do not have any duplicate contacts, good job in keeping
              your contacts tidy
            </Text>
          </View>
        ) : (
          <FlatList
            data={duplicatedContacts}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={() => <Text>No duplicated contacts found</Text>}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  deleteButton: {
    backgroundColor: "#d72c16",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginRight: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  contactName: {
    flex: 1,
    fontWeight: "bold",
  },
  contactPhone: {
    flex: 2,
  },

  row: {
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
    paddingBottom: 100,
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
  noEntriesContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});

export default App;
