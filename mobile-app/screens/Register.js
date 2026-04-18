import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert
} from 'react-native';

export default function Register({ navigation }) {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [role, setRole] = useState("user");

  const handleRegister = async () => {

    if (
      !name || !email || !password ||
      !mobileNumber || !emergencyName || !emergencyContact
    ) {
      Alert.alert("Fill all fields");
      return;
    }

    if (mobileNumber === emergencyContact) {
      Alert.alert("Mobile & emergency contact cannot be same");
      return;
    }

    try {
      const res = await fetch("http://10.244.135.145:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          password,
          mobileNumber,
          emergencyName,
          emergencyContact,
          role, // 🔥 IMPORTANT
        }),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert("Registered Successfully 🎉");
        navigation.replace("Login");
      } else {
        Alert.alert(data.message || "Registration failed");
      }

    } catch (err) {
      console.log("REGISTER ERROR:", err);
      Alert.alert("Server error");
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Register</Text>

      <TextInput placeholder="Full Name" style={styles.input} onChangeText={setName} />
      <TextInput placeholder="Mobile Number" style={styles.input} onChangeText={setMobileNumber} />
      <TextInput placeholder="Emergency Contact Name" style={styles.input} onChangeText={setEmergencyName} />
      <TextInput placeholder="Emergency Contact Number" style={styles.input} onChangeText={setEmergencyContact} />
      <TextInput placeholder="Email" style={styles.input} onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry style={styles.input} onChangeText={setPassword} />

      {/* ROLE SELECTION */}
      <View style={styles.roleContainer}>
        <Text>Select Role:</Text>

        <TouchableOpacity onPress={() => setRole("user")}>
          <Text style={role === "user" ? styles.selected : styles.option}>User</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setRole("official")}>
          <Text style={role === "official" ? styles.selected : styles.option}>Official</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={{ marginTop: 15 }}>Already have an account? Login</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
    borderRadius: 6,
  },
  button: {
    backgroundColor: '#e63946',
    padding: 15,
    borderRadius: 6,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  roleContainer: {
    marginBottom: 15,
  },
  option: {
    padding: 8,
    color: 'gray',
  },
  selected: {
    padding: 8,
    color: 'white',
    backgroundColor: '#1d3557',
    borderRadius: 5,
    marginVertical: 2,
  },
});