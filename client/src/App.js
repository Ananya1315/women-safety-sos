import { BrowserRouter, Routes, Route } from "react-router-dom";

import UserSOSPage from "./pages/UserSOS";
import TrustedCircle from "./pages/TrustedCircle";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserSOSPage />} />
        <Route path="/trusted" element={<TrustedCircle />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
