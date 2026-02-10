import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{
      display: "flex",
      gap: "20px",
      padding: "15px",
      backgroundColor: "#111",
      color: "white"
    }}>
      <Link to="/" style={{ color: "white", textDecoration: "none" }}>
         SOS
      </Link>

      <Link to="/report" style={{ color: "white", textDecoration: "none" }}>
         Report Incident
      </Link>

      <Link to="/trusted" style={{ color: "white", textDecoration: "none" }}>
         Trusted Circle
      </Link>
    </nav>
  );
}

export default Navbar;
