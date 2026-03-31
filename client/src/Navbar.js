import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // 🔐 Trusted Circle Access
  const handleTrustedAccess = async () => {
  const enteredEmail = prompt("Enter official email:");
  const passcode = prompt("Enter 4-digit passcode:");

  const loggedInEmail = localStorage.getItem("email"); // 👈 IMPORTANT

  // 🔒 CHECK: email must match logged-in user
  if (enteredEmail !== loggedInEmail) {
    alert("You can only use your own official credentials");
    return;
  }

  if (!enteredEmail || !passcode) {
    alert("All fields required");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/official/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: enteredEmail, passcode }),
    });

    const data = await res.json();

    if (res.ok) {
      navigate("/trusted");
    } else {
      alert(data.message || "Access denied");
    }

  } catch (err) {
    alert("Server error");
  }
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

          {/* 🔐 Only for officials */}
          {role === "official" && (
            <button onClick={handleTrustedAccess} style={styles.buttonLink}>
              Trusted Circle
            </button>
          )}

          <Link to="/heatmap" style={styles.link}>Safety Map</Link>

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
  buttonLink: {
    background: "none",
    border: "none",
    color: "white",
    fontSize: "15px",
    cursor: "pointer",
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