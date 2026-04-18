import { useEffect, useState } from "react";
import {
  View, Text, StyleSheet,
  FlatList, TouchableOpacity, ScrollView
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TrustedCircle() {

  const [sosList, setSOSList] = useState([]);
  const [incidents, setIncidents] = useState([]);

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      // 🚨 SOS
      const sosRes = await fetch("http://10.244.135.145:5000/api/sos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sosData = await sosRes.json();
      setSOSList(sosData);

      // 📝 INCIDENTS
      const incRes = await fetch("http://10.244.135.145:5000/api/incident_reporting", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const incData = await incRes.json();
      setIncidents(incData);

    } catch (err) {
      console.log("FETCH ERROR:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🚨 UPDATE SOS
  const updateSOS = async (id, status) => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (status === "false alarm") {
      //  DELETE FROM DB
      await fetch(`http://10.244.135.145:5000/api/sos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      // remove from UI
      setSOSList(prev => prev.filter(item => item._id !== id));
    }

    else {
      // update status
      await fetch(`http://10.244.135.145:5000/api/sos/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (status === "resolved") {
        // remove from UI ONLY
        setSOSList(prev => prev.filter(item => item._id !== id));
      } else {
        fetchData(); // keep showing
      }
    }

  } catch (err) {
    console.log("SOS UPDATE ERROR:", err);
  }
};

  // 📝 UPDATE INCIDENT
  const updateIncident = async (id, status) => {
    const token = await AsyncStorage.getItem("token");

    await fetch(`http://10.244.135.145:5000/api/incident_reporting/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    fetchData();
  };

  return (
    <ScrollView style={styles.container}>

      {/* 🚨 SOS ALERTS */}
      <Text style={styles.header}>SOS Alerts</Text>

      {sosList.map((item) => (
        <View key={item._id} style={styles.cardRed}>
          <Text>Latitude: {item.lat}</Text>
          <Text>Longitude: {item.lng}</Text>
          <Text>Time: {item.istTime}</Text>
          <Text>Status: {item.status}</Text>

          <View style={styles.row}>
            <TouchableOpacity
              style={styles.grayBtn}
              onPress={() => updateSOS(item._id, "help coming")}
            >
              <Text>Help Coming</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.grayBtn}
              onPress={() => updateSOS(item._id, "resolved")}
            >
              <Text>Resolved</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.grayBtn}
              onPress={() => updateSOS(item._id, "false alarm")}
            >
              <Text>False Alarm</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* 📝 INCIDENTS */}
      <Text style={styles.header}>Reported Incidents</Text>

      {incidents.map((item) => (
        <View key={item._id} style={styles.card}>
          <Text>Category: {item.category}</Text>
          <Text>Description: {item.description}</Text>
          <Text>Location: {item.lat}, {item.lng}</Text>
          <Text>Time: {item.reportedAtIST}</Text>
          <Text>Status: {item.status}</Text>

          <View style={styles.row}>
            <TouchableOpacity
              style={styles.grayBtn}
              onPress={() => updateIncident(item._id, "investigating")}
            >
              <Text>Investigating</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.grayBtn}
              onPress={() => updateIncident(item._id, "resolved")}
            >
              <Text>Resolved</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },

  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },

  cardRed: {
    borderWidth: 1,
    borderColor: "red",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },

  card: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    marginTop: 10,
    flexWrap: "wrap",
  },

  grayBtn: {
    backgroundColor: "#ddd",
    padding: 8,
    marginRight: 8,
    marginBottom: 5,
    borderRadius: 5,
  },
});