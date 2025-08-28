"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet } from "react-native"
import { colors, commonStyles } from "../../styles/commonStyles"
import RegistrationHeader from "../../components/screen_components/RegistrationHeader"
import { fetcher } from "@/utils/fetcher"
import { API_URLS } from "@/config/api"

// Match your RegistrationHeader geometry exactly
const HEADER_HEIGHT = 140
const DIP_HEIGHT = 56
const DIP_OVERLAP = 24
const HEADER_OFFSET = HEADER_HEIGHT + (DIP_HEIGHT - DIP_OVERLAP)
const SCROLL_BOTTOM_SPACING = 140

type AnyObj = Record<string, any>

function parseUserId(obj: AnyObj | undefined): string | number | undefined {
  if (!obj) return undefined
  return (
    obj.user_id ??
    obj.id ??
    obj.user?.id ??
    obj.data?.user_id ??
    obj.data?.id ??
    obj.data?.user?.id
  )
}

function parseAccessToken(obj: AnyObj | undefined): string | undefined {
  if (!obj) return undefined
  return (
    obj.access_token ??
    obj.token ??
    obj.data?.access_token ??
    obj.data?.token
  )
}

function isOk(res: AnyObj) {
  return (
    res?.success === true ||
    res?.status === "success" ||
    res?.status === 200 ||
    res?.status === 201 ||
    !!res?.user ||
    !!res?.data ||
    !!res?.token ||
    !!res?.access_token
  )
}

const AccountSetupScreen = ({ navigation, route }: any) => {
  const existingUserData = route.params?.userData || {}
  const [email, setEmail] = useState(existingUserData.emailAddress || "")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const proceed = (payload: { userId?: string | number; accessToken?: string }) => {
    const updatedUserData = {
      ...existingUserData,
      userId: payload.userId ?? existingUserData.userId,
      account: { email, timestamp: new Date().toISOString() },
    }
    // Continue the same flow you already had
    navigation.navigate("FinalReminders", {
      userData: updatedUserData,
      userToken: payload.accessToken, // can be undefined if your API doesn’t return it yet
    })
    // If you want to go straight home instead, do:
    // navigation.reset({ index: 0, routes: [{ name: "Home" }] })
  }

  const tryLoginFallback = async () => {
    try {
      const loginRes = await fetcher(API_URLS.auth.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const token = parseAccessToken(loginRes)
      const userId = parseUserId(loginRes)
      if (token || userId) {
        proceed({ userId, accessToken: token })
        return true
      }
      return false
    } catch (e) {
      // login really failed
      return false
    }
  }

  const handleNext = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Password and Confirm Password do not match.")
      return
    }

    setLoading(true)
    try {
      const registrationPayload = {
        fullName: existingUserData.fullName,
        emailAddress: email,
        password,
        password_confirmation: confirmPassword,
        dateOfBirth: existingUserData.dateOfBirth,
        contactNumber: existingUserData.contactNumber,
      }

      console.log("Register payload:", registrationPayload)

      // Normal register call (your fetcher throws on non-2xx)
      const res = await fetcher(API_URLS.auth.register, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationPayload),
      })

      console.log("Register response:", res)

      if (isOk(res)) {
        proceed({ userId: parseUserId(res), accessToken: parseAccessToken(res) })
      } else {
        // Unlikely with 2xx, but handled
        Alert.alert("Registration Error", res?.message || "Registration failed. Please try again.")
      }
    } catch (err: any) {
      // ❗ Register returned 4xx/5xx or network error
      console.warn("Register failed, attempting login fallback…", err?.message || err)

      const loggedIn = await tryLoginFallback()
      if (!loggedIn) {
        Alert.alert(
          "Registration Error",
          err?.message || "An error occurred during registration. Please try again."
        )
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingTop: HEADER_OFFSET, paddingBottom: SCROLL_BOTTOM_SPACING }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sheet}>
          <Text style={commonStyles.title}>Account Setup</Text>

          <View style={commonStyles.fieldContainer}>
            <Text style={commonStyles.fieldLabel}>Mobile Number</Text>
            <TextInput
              style={commonStyles.input}
              placeholder="Mobile Number"
              value={existingUserData.contactNumber}
              editable={true}
            />
          </View>

          <View style={commonStyles.fieldContainer}>
            <Text style={commonStyles.fieldLabel}>Email Address</Text>
            <TextInput
              style={commonStyles.input}
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={commonStyles.fieldContainer}>
            <Text style={commonStyles.fieldLabel}>Password</Text>
            <TextInput
              style={commonStyles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View style={commonStyles.fieldContainer}>
            <Text style={commonStyles.fieldLabel}>Confirm Password</Text>
            <TextInput
              style={commonStyles.input}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={commonStyles.button} onPress={handleNext} disabled={loading}>
          <Text style={commonStyles.buttonText}>{loading ? "Registering..." : "Register"}</Text>
        </TouchableOpacity>
      </View>

      <RegistrationHeader title="Registration" onBackPress={() => navigation.goBack()} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scroll: { flex: 1 },
  sheet: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    elevation: 4,
  },
  bottomBar: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 24,
  },
})

export default AccountSetupScreen
