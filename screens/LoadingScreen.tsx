"use client"

import { useEffect } from "react"
import { View, Text, StyleSheet } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { colors } from "../styles/commonStyles"

const LoadingScreen = ({ navigation }: any) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Login")
    }, 3000)

    return () => clearTimeout(timer)
  }, [navigation])

  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "bold",
  },
})

export default LoadingScreen
