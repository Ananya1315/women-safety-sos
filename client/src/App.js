import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import UserSOSPage from "./pages/UserSOS";
import TrustedCircle from "./pages/TrustedCircle";
import IncidentReport from "./pages/IncidentReporting";
import Heatmap from "./pages/Heatmap";
import SafeMap from "./pages/SafeMap";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
}

function App() {
  return (
    <Router>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/sos" element={<ProtectedRoute><UserSOSPage /></ProtectedRoute>} />
        <Route path="/report" element={<IncidentReport />} />
        <Route path="/trusted" element={<TrustedCircle />} />
        <Route path="/heatmap" element={<Heatmap/>}/>
        <Route path="/safe-map" element={<SafeMap />} />
        
      </Routes>
    </Router>
  );
}

export default App;
