import { useState } from "react";
import {
  View, TextInput, TouchableOpacity,
  Text, StyleSheet, Alert,
  KeyboardAvoidingView, Platform, ScrollView
} from "react-native";
import MapView, { Polyline, Circle } from "react-native-maps";

export default function SafeRoute() {

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [routes, setRoutes] = useState([]);
  const [bestRoute, setBestRoute] = useState([]);
  const [routeDetails, setRouteDetails] = useState([]);

  const getLatLng = async (address) => {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;

    const res = await fetch(url, {
      headers: { "User-Agent": "SafeMapApp" },
    });

    const data = await res.json();

    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }
    return null;
  };

  const getRoute = async () => {
    if (!start || !end) {
      Alert.alert("Enter both locations");
      return;
    }

    try {
      const startCoords = await getLatLng(start);
      const endCoords = await getLatLng(end);

      if (!startCoords || !endCoords) {
        Alert.alert("Invalid address");
        return;
      }

      const res = await fetch("http://10.244.135.145:5000/safe-route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start: startCoords,
          end: endCoords,
        }),
      });

      const data = await res.json();

      setRoutes(data.allRoutes || []);
      setRouteDetails(data.routeDetails || []);
      setBestRoute(data.bestRoute || []);

    } catch (err) {
      console.log("ROUTE ERROR:", err);
      Alert.alert("Error fetching route");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>

          {/* INPUT SECTION */}
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Start Location"
              style={styles.input}
              value={start}
              onChangeText={setStart}
            />

            <TextInput
              placeholder="Destination"
              style={styles.input}
              value={end}
              onChangeText={setEnd}
            />

            <TouchableOpacity style={styles.button} onPress={getRoute}>
              <Text style={styles.buttonText}>Find Safe Route</Text>
            </TouchableOpacity>
          </View>

          {/* MAP */}
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 13.0827,
              longitude: 80.2707,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}
          >

            {/* ROUTES */}
            {routes.map((route, i) => {
              const risk = routeDetails[i]?.risk || 0;
console.log("ROUTE DETAILS:", routeDetails);
              let color = "green";
              if (risk > 120) color = "red";
              else if (risk > 60) color = "orange";

              return (
                <Polyline
                  key={i}
                  coordinates={route.map(p => ({
                    latitude: p[0],
                    longitude: p[1],
                  }))}
                  strokeColor={color}
                  strokeWidth={4}
                />
              );
            })}

            {/* BEST ROUTE */}
            {bestRoute.length > 0 && (
              <Polyline
                coordinates={bestRoute.map(p => ({
                  latitude: p[0],
                  longitude: p[1],
                }))}
                strokeColor="blue"
                strokeWidth={6}
              />
            )}

          </MapView>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  inputContainer: {
    paddingTop: 60, // 🔥 FIXES TOP OVERLAP
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },

  input: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
    borderRadius: 6,
  },

  button: {
    backgroundColor: "#1d3557",
    padding: 15,
    borderRadius: 6,
    marginBottom: 10,
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },

  map: {
    flex: 1,
  },
});