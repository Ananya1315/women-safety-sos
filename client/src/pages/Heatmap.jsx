import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import { useEffect } from "react";
import L from "leaflet";

const HeatLayer = () => {
  const map = useMap();

  useEffect(() => {
    fetch("http://localhost:5000/api/incident_reporting")
      .then((res) => res.json())
      .then((data) => {
        console.log("DATA:", data);

        const heatData = data.map((item) => [
          item.lat,
          item.lng,
          1,
        ]);
        console.log("HEAT DATA:", heatData); 
        const heat = L.heatLayer(heatData, {
          radius: 25,
          blur: 15,
          maxZoom: 17,
          gradient: {
            0.2: "yellow",
            0.5: "orange",
            1.0: "red",
          },
        });

        heat.addTo(map);
      });
  }, [map]);

  return null;
};

const HeatmapPage = () => {
  return (
    <MapContainer
      center={[13.0827, 80.2707]}
      zoom={13}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <HeatLayer />
    </MapContainer>
  );
};

export default HeatmapPage;