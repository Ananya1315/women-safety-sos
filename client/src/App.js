import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import UserSOSPage from "./pages/UserSOS";
import TrustedCircle from "./pages/TrustedCircle";
import IncidentReport from "./pages/IncidentReporting";

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
      </Routes>
    </Router>
  );
}

export default App;
