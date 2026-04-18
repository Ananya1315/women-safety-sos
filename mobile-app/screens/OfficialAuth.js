import { useState } from "react";
import {
  View, Text, TextInput,
  TouchableOpacity, StyleSheet, Alert
} from "react-native";

export default function OfficialAuth({ navigation }) {

  const [email, setEmail] = useState("");
  const [passcode, setPasscode] = useState("");

  const handleVerify = async () => {
    if (!email || !passcode) {
      Alert.alert("Fill all fields");
      return;
    }

    try {
      const res = await fetch("http://10.244.135.145:5000/api/official/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, passcode }),
      });

      const data = await res.json();

      if (res.ok) {
        navigation.replace("TrustedCircle");
      } else {
        Alert.alert("Invalid credentials");
      }

    } catch (err) {
      console.log(err);
      Alert.alert("Server error");
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Official Verification</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="4-digit Passcode"
        style={styles.input}
        secureTextEntry
        keyboardType="numeric"
        maxLength={4}
        onChangeText={setPasscode}
      />

      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 15,
    borderRadius: 6,
  },
  button: {
    backgroundColor: "#1d3557",
    padding: 15,
    borderRadius: 6,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
});