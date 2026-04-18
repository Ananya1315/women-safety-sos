import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert
} from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Report({ navigation }) {

  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {

    if (!category || !description) {
      Alert.alert("Please fill all fields");
      return;
    }

    // 📍 Location
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert("Location permission denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});

    const lat = location.coords.latitude;
    const lng = location.coords.longitude;

    const token = await AsyncStorage.getItem("token");

    try {
      console.log("Sending incident...");

      const res = await fetch("http://10.244.135.145:5000/api/incident_reporting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          lat,
          lng,
          category,      
          description,   
        }),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert("Report Submitted ✅");

        setCategory("");
        setDescription("");

        navigation.goBack();
      } else {
        console.log("BACKEND ERROR:", data);
        Alert.alert(data.message || "Failed to submit report");
      }

    } catch (err) {
      console.log("REPORT ERROR:", err);
      Alert.alert("Server error");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Report Incident</Text>

      {/* 📂 CATEGORY */}
      <TextInput
        placeholder="Category (e.g. Harassment, Theft)"
        style={styles.input}
        value={category}
        onChangeText={setCategory}
      />

      {/* 📝 DESCRIPTION */}
      <TextInput
        placeholder="Describe what happened..."
        style={[styles.input, { height: 100 }]}
        multiline
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Report</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 15,
    borderRadius: 6,
  },
  button: {
    backgroundColor: '#1d3557',
    padding: 15,
    borderRadius: 6,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});