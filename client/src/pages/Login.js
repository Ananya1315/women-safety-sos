import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // NEW STATES
  const [mobileNumber, setMobileNumber] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Frontend validation (extra safety)
    if (!isLogin && mobileNumber === emergencyContact) {
      setError("Mobile number and emergency contact cannot be the same");
      return;
    }

    setLoading(true);

    const url = isLogin
      ? "http://localhost:5000/api/auth/login"
      : "http://localhost:5000/api/auth/register";

    const bodyData = isLogin
      ? { email, password }
      : { name, email, password, mobileNumber, emergencyName, emergencyContact };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        setLoading(false);
        return;
      }

      if (isLogin) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("name", data.name);
        navigate("/sos");
      } else {
        setIsLogin(true);
        setError("Registration successful! Please login.");
      }

    } catch (err) {
      setError("Server unreachable");
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>

        <form onSubmit={handleSubmit}>

          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                onChange={(e) => setName(e.target.value)}
                required
                style={styles.input}
              />

              <input
                type="text"
                placeholder="Mobile Number"
                onChange={(e) => setMobileNumber(e.target.value)}
                required
                style={styles.input}
              />

              <input
                type="text"
                placeholder="Emergency Contact Name"
                onChange={(e) => setEmergencyName(e.target.value)}
                required
                style={styles.input}
              />

              <input
                type="text"
                placeholder="Emergency Contact Number"
                onChange={(e) => setEmergencyContact(e.target.value)}
                required
                style={styles.input}
              />
            </>
          )}

          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              backgroundColor: loading ? "#999" : "#e63946"
            }}
          >
            {loading
              ? "Processing..."
              : isLogin
              ? "Login"
              : "Register"}
          </button>
        </form>

        {error && <p style={styles.error}>{error}</p>}

        <p
          onClick={() => {
            setIsLogin(!isLogin);
            setError("");
          }}
          style={styles.toggle}
        >
          {isLogin
            ? "New user? Create an account"
            : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  card: {
    width: "350px",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0px 5px 15px rgba(0,0,0,0.1)",
    backgroundColor: "white",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "5px",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginTop: "10px",
  },
  toggle: {
    marginTop: "15px",
    color: "#0077b6",
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default Login;
