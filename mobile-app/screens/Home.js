import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Accelerometer } from 'expo-sensors';
import { useEffect, useRef, useState } from 'react';

export default function Home({ navigation, refreshAuth }) {

  const [role, setRole] = useState("");
useEffect(() => {
  const loadRole = async () => {
    const storedRole = await AsyncStorage.getItem("role");
    setRole(storedRole);
  };
  loadRole();
}, []);
  // 🧠 LOAD ROLE
  useEffect(() => {
  const checkSOS = async () => {
    const token = await AsyncStorage.getItem("token");

    const res = await fetch("http://10.244.135.145:5000/api/sos", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    const mySOS = data.find(item => item.status === "help coming");

    if (mySOS) {
      Alert.alert(
        "🚑 Help is on the way!",
        "Is this a false alarm?",
        [
          {
            text: "Yes",
            onPress: async () => {
              await fetch(`http://10.244.135.145:5000/api/sos/${mySOS._id}`, {
                method: "DELETE",
              });
            }
          },
          {
            text: "No",
            style: "cancel"
          }
        ]
      );
    }
  };

  const interval = setInterval(checkSOS, 5000);

  return () => clearInterval(interval);
}, []);

  // 🧠 SHAKE TRACKING
  const shakeCount = useRef(0);
  const lastShakeTime = useRef(0);

  const handleSOS = async (silent = false) => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      if (!silent) Alert.alert('Permission denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});

    const lat = location.coords.latitude;
    const lng = location.coords.longitude;

    const utcTime = new Date().toISOString();
    const istTime = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });

    const token = await AsyncStorage.getItem("token");

    try {
      const res = await fetch('http://10.244.135.145:5000/api/sos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          lat,
          lng,
          utcTime,
          istTime,
          triggerType: silent ? "silent" : "mobile",
          method: "app",
          status: "pending",
        }),
      });

      if (res.ok) 
        {
        if (!silent) Alert.alert("SOS Sent ");
      } 
      else 
        {
        if (!silent) Alert.alert("Failed to send SOS");
      }

    } catch (err) {
      if (!silent) Alert.alert("Server error");
    }
  };

 useEffect(() => {
  Accelerometer.setUpdateInterval(200);

  let last = { x: 0, y: 0, z: 0 };

  const subscription = Accelerometer.addListener(data => {
    const { x, y, z } = data;

    // 🔥 change detection
    const delta =
      Math.abs(x - last.x) +
      Math.abs(y - last.y) +
      Math.abs(z - last.z);

   // console.log("DELTA:", delta);

    last = { x, y, z };

    if (delta > 1.8) { 
      const now = Date.now();

      if (now - lastShakeTime.current > 600) {
        shakeCount.current += 1;
        lastShakeTime.current = now;

        console.log("Shake detected:", shakeCount.current);
      }

      if (shakeCount.current >= 3) {
        shakeCount.current = 0;

        console.log("Silent SOS Triggered");
        handleSOS(true);
      }
    }
  });

  return () => subscription.remove();
}, []);
  const handleLogout = async () => {
    await AsyncStorage.clear();
    //navigation.replace("Login");
     refreshAuth();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Women Safety Platform</Text>

      {/* 🚨 SOS */}
      <TouchableOpacity style={styles.sosButton} onPress={() => handleSOS(false)}>
        <Text style={styles.sosText}>SOS</Text>
      </TouchableOpacity>

      {/* 📝 Report */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Report")}>
        <Text style={styles.buttonText}>Report Incident</Text>
      </TouchableOpacity>

      {/* 🔥 Heatmap */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Heatmap")}>
        <Text style={styles.buttonText}>View Heatmap</Text>
      </TouchableOpacity>

      {/* 🗺️ Safe Route */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("SafeRoute")}>
        <Text style={styles.buttonText}>Safe Route</Text>
      </TouchableOpacity>

      {/* 👥 Trusted Circle (ONLY OFFICIAL) */}
      {role === "official" && (
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("OfficialAuth")}>
          <Text style={styles.buttonText}>Trusted Circle</Text>
        </TouchableOpacity>
      )}

      {/* 🚪 Logout */}
      <TouchableOpacity onPress={handleLogout}>
        <Text style={styles.logout}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
  },
  sosButton: {
    backgroundColor: 'red',
    padding: 40,
    borderRadius: 100,
    marginBottom: 20,
  },
  sosText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#1d3557',
    padding: 12,
    borderRadius: 6,
    width: "80%",
    marginVertical: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  logout: {
    marginTop: 20,
    color: 'red',
  },
});