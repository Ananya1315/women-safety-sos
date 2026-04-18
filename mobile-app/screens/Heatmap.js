import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Circle } from "react-native-maps";

export default function HeatmapScreen() {

  const [points, setPoints] = useState([]);

  useEffect(() => {
    fetch("http://10.244.135.145:5000/api/heatmap")
      .then((res) => res.json())
      .then((data) => {
        console.log("HEAT DATA:", data);

        const formatted = data.map((item) => ({
          latitude: item.lat,
          longitude: item.lng,
          weight: item.weight || 1,
        }));

        setPoints(formatted);
      })
      .catch((err) => console.log("HEATMAP ERROR:", err));
  }, []);

  // 🎨 Color based on severity
  const getColor = (weight) => {
    if (weight >= 2) return "rgba(255,0,0,0.6)";     // 🔴 High risk
    if (weight === 1) return "rgba(255,165,0,0.5)";   // 🟠 Medium
    return "rgba(255,255,0,0.4)";                     // 🟡 Low
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 13.0827,
          longitude: 80.2707,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >

        {points.map((point, index) => (
          <Circle
            key={index}
            center={{
              latitude: point.latitude,
              longitude: point.longitude,
            }}
            radius={point.weight * 60} // 🔥 bigger = more intense
            fillColor={getColor(point.weight)}
            strokeColor="rgba(255,0,0,0.7)"
          />
        ))}

      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});