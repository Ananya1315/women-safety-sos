import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import UserSOSPage from "./pages/UserSOS";
import TrustedCircle from "./pages/TrustedCircle";
import IncidentReport from "./pages/IncidentReporting";
import Heatmap from "./pages/Heatmap";
import SafeMap from "./pages/SafeMap";

// 🔐 Normal login protection
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
}

// 🔐 Trusted Circle protection (NEW)
function ProtectedTrustedRoute({ children }) {
  const token = localStorage.getItem("token");
  const hasAccess = localStorage.getItem("trustedAccess");

  if (!token) {
    return <Navigate to="/" />;
  }

  if (!hasAccess) {
    return <h2 style={{ textAlign: "center", marginTop: "100px" }}>Access Denied</h2>;
  }

  return children;
}

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route
          path="/sos"
          element={
            <ProtectedRoute>
              <UserSOSPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/report"
          element={
            <ProtectedRoute>
              <IncidentReport />
            </ProtectedRoute>
          }
        />

        {/* 🔥 FIXED ROUTE */}
        <Route
          path="/trusted"
          element={
            <ProtectedTrustedRoute>
              <TrustedCircle />
            </ProtectedTrustedRoute>
          }
        />

        <Route
          path="/heatmap"
          element={
            <ProtectedRoute>
              <Heatmap />
            </ProtectedRoute>
          }
        />

        <Route
          path="/safe-map"
          element={
            <ProtectedRoute>
              <SafeMap />
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;