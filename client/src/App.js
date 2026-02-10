import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";

import UserSOSPage from "./pages/UserSOS";
import TrustedCircle from "./pages/TrustedCircle";
import IncidentReport from "./pages/IncidentReporting";

function App() {
  return (
    <BrowserRouter>
      <Navbar />  { }

      <Routes>
        <Route path="/" element={<UserSOSPage />} />
        <Route path="/report" element={<IncidentReport />} />
        <Route path="/trusted" element={<TrustedCircle />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
