"use client";

import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../styles/commonStyles";
import { fetcher } from "@/utils/fetcher";
import { API_URLS } from "@/config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetcher(API_URLS.auth.login, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (response.success && response.access_token && response.user) {
        await AsyncStorage.setItem("userToken", response.access_token);
        await AsyncStorage.setItem("userData", JSON.stringify(response.user));
        
        Alert.alert("Success", "Logged in successfully!");
        // --- FIX: Navigate to MainAppDrawer instead of Home ---
        navigation.replace("MainAppDrawer"); 
        // --- END FIX ---
      } else {
        throw new Error(response.message || "Login failed. Please check your credentials.");
      }
    } catch (error: any) {
      console.error("Login error in component:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigation.navigate("DataPrivacy");
  };

  return (
    <View style={styles.container}>
      <View style={styles.circleContainer}>
        <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.circle}>
          <View style={styles.welcomeContainer}>
            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>📱</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.welcomeText}>Welcome to</Text>
              <Text style={styles.emmaText}>E.M.M.A</Text>
              <Text style={styles.subtitleText}>Evacuation Management and{"\n"}Monitoring Assistant</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.fieldContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.fieldContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Logging In..." : "Login"}</Text>
        </TouchableOpacity>

        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.rememberContainer} onPress={() => setRememberMe(!rememberMe)}>
            <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]} />
            <Text style={styles.rememberText}>Remember me</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.oauthContainer}>
          <TouchableOpacity style={styles.oauthButton}>
            <Text style={styles.oauthText}>G</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.oauthButton}>
            <Text style={styles.oauthText}>f</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  circleContainer: {
    height: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    width: 650,
    height: 650,
    borderRadius: 600,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeContainer: {
    paddingTop: 200,
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    marginRight: 15,
  },
  iconText: {
    fontSize: 40,
  },
  textContainer: {
    alignItems: "flex-start",
  },
  welcomeText: {
    fontSize: 18,
    color: colors.white,
    marginBottom: 5,
  },
  emmaText: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 5,
  },
  subtitleText: {
    fontSize: 12,
    color: colors.white,
    textAlign: "left",
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 40,
    justifyContent: "flex-start",
    paddingTop: 320,
  },
  fieldContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  fieldLabel: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 8,
    fontWeight: "500",
    alignSelf: "flex-start",
    width: 300,
  },
  input: {
    backgroundColor: colors.fieldBg,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    width: 300,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    width: 300,
    alignSelf: "center",
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: colors.primary,
    marginRight: 8,
    borderRadius: 3,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
  },
  rememberText: {
    fontSize: 10,
    color: colors.primary,
  },
  forgotText: {
    fontSize: 10,
    color: colors.primary,
  },
  loginButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 20,
    width: 300,
    alignSelf: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  oauthContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  oauthButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.fieldBg,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  oauthText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
  },
  registerButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 15,
    alignItems: "center",
    width: 300,
    alignSelf: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 30,
    left: 50,
    right: 40,
  },
});

export default LoginScreen;
