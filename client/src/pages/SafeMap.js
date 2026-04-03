import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Circle, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "../Navbar";

function SafeMap() {
  const [sosPoints, setSOSPoints] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [bestRoute, setBestRoute] = useState([]);
  const [routeDetails, setRouteDetails] = useState([]);
  const [bestRouteIndex, setBestRouteIndex] = useState(null); 
  const [startInput, setStartInput] = useState("");
  const [endInput, setEndInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchSOS();
  }, []);

  const fetchSOS = async () => {
    try {
      const res = await fetch("http://localhost:5000/get-sos");
      const data = await res.json();
      setSOSPoints(data);
    } catch (err) {
      console.error(err);
    }
  };

  const getLatLng = async (address) => {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
    try {
      const response = await fetch(url, {
        headers: { "User-Agent": "SafeMapApp" },
      });
      const data = await response.json();

      if (data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const getRoute = async () => {
    if (!startInput.trim() || !endInput.trim()) {
      alert("Please enter both source and destination.");
      return;
    }

    setIsLoading(true);

    try {
      const [startCoords, endCoords] = await Promise.all([
        getLatLng(startInput),
        getLatLng(endInput),
      ]);

      if (!startCoords || !endCoords) {
        alert("Invalid address");
        setIsLoading(false);
        return;
      }

      const start = { lat: startCoords.lat, lng: startCoords.lon };
      const end = { lat: endCoords.lat, lng: endCoords.lon };

      const res = await fetch("http://localhost:5000/safe-route", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ start, end }),
      });

      const data = await res.json();
      console.log("API:", data);

      if (!data.bestRoute) {
        alert("No route found");
        setIsLoading(false);
        return;
      }

      setRoutes(data.allRoutes);
      setRouteDetails(data.routeDetails);

      
      const bestIndex = data.allRoutes.findIndex(
        (r) => JSON.stringify(r) === JSON.stringify(data.bestRoute)
      );

      setBestRoute(data.bestRoute);
      setBestRouteIndex(bestIndex);

      
      const bestRisk = Number(data.routeDetails[bestIndex]?.risk || 0);
      if (bestRisk > 400) {
        alert("No safe route found! High risk route selected.");
      }

    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <input
        placeholder="Enter source (e.g. Phoenix Mall, Chennai)"
        value={startInput}
        onChange={(e) => setStartInput(e.target.value)}
      />
      <br />

      <input
        placeholder="Enter destination (e.g. Marina Beach, Chennai)"
        value={endInput}
        onChange={(e) => setEndInput(e.target.value)}
      />
      <br />

      <button onClick={getRoute} disabled={isLoading}>
        {isLoading ? "Finding Route..." : "Find Safe Route"}
      </button>

      <MapContainer center={[12.95, 80.22]} zoom={13} style={{ height: "600px" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        
        {sosPoints.map((p, i) => (
          <Circle
            key={i}
            center={[p.lat, p.lng]}
            radius={300}
            pathOptions={{ color: "red" }}
          >
            <Popup>
              SOS <br />
              Time: {p.istTime} <br />
              Status: {p.status}
            </Popup>
          </Circle>
        ))}

        
        {routes.map((r, i) => {
          const risk = Number(routeDetails[i]?.risk || 0);

          let color = "green";
          if (risk > 120) color = "red";
          else if (risk > 60) color = "orange";

          return (
            <Polyline key={i} positions={r} color={color} weight={4}>
              <Popup>
                Route {i + 1} <br />
                Risk: {risk} <br />
                Distance: {routeDetails[i]?.distance} km <br />
                Time: {routeDetails[i]?.duration} min
              </Popup>
            </Polyline>
          );
        })}

        
        {bestRoute.length > 0 && bestRouteIndex !== null && (() => {
          const bestRisk = Number(routeDetails[bestRouteIndex]?.risk || 0);

          return (
            <Polyline
              positions={bestRoute}
              color={bestRisk > 400 ? "red" : "green"}
              weight={7}
            >
              <Popup>
                {bestRisk > 400
                  ? "No Safe Route — High Risk!"
                  : "Safest Route"} <br />
                Risk: {bestRisk}
              </Popup>
            </Polyline>
          );
        })()}

      </MapContainer>
    </div>
  );
}

export default SafeMap;