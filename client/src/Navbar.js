import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav style={styles.navbar}>
      
      <div style={styles.logo}>
        Women Safety Platform
      </div>

      {token && (
        <div style={styles.rightSection}>
          
          <Link to="/sos" style={styles.link}>SOS</Link>
          <Link to="/report" style={styles.link}>Report</Link>
          <Link to="/trusted" style={styles.link}>Trusted Circle</Link>
          <Link to="/heatmap" style={styles.link}>Safety map</Link>

          <span style={styles.user}>
            {name}
          </span>

          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>

        </div>
      )}
    </nav>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    backgroundColor: "#1d3557",
    color: "white",
  },
  logo: {
    fontSize: "18px",
    fontWeight: "bold",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  link: {
    textDecoration: "none",
    color: "white",
    fontSize: "15px",
  },
  user: {
    fontSize: "14px",
    opacity: 0.9,
  },
  logoutBtn: {
    padding: "6px 12px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#e63946",
    color: "white",
    cursor: "pointer",
  },
};

export default Navbar;
