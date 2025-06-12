"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { colors, commonStyles } from "../../styles/commonStyles"

const { height } = Dimensions.get("window")

const EvacuationDetailsScreen = ({ navigation, route }: any) => {
  const { center } = route.params
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSetPreferred = () => {
    console.log("Preferred evacuation center set:", {
      centerName: center.name,
      distance: center.distance,
      estimatedTime: center.time,
      timestamp: new Date().toISOString(),
    })

    setShowSuccess(true)
  }

  const handleNext = () => {
    console.log("Proceeding to account setup from evacuation center selection")
    navigation.navigate("AccountSetup")
  }

  const handleBack = () => {
    navigation.goBack()
  }

  if (showSuccess) {
    return (
      <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={commonStyles.mainThemeBackground}>
        <View style={styles.mapContainer}>
          <Text style={styles.mapPlaceholder}>🗺️ Map View</Text>
        </View>

        <View style={styles.successContainer}>
          <View style={styles.successContent}>
            <Text style={styles.checkMark}>✓</Text>
            <Text style={styles.successMessage}>Preferred center set</Text>

            <View style={commonStyles.bottomButton}>
              <TouchableOpacity style={commonStyles.button} onPress={handleNext}>
                <Text style={commonStyles.buttonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    )
  }

  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={commonStyles.mainThemeBackground}>
      <View style={styles.mapContainer}>
        <Text style={styles.mapPlaceholder}>🗺️ Map with Route</Text>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.detailsTitle}>Evacuation Center Details</Text>

        <View style={styles.detailsContent}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Name:</Text>
            <Text style={styles.detailValue}>{center.name}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Location:</Text>
            <Text style={styles.detailValue}>123 Center Street, City</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Distance:</Text>
            <Text style={styles.detailValue}>{center.distance}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Estimated Time:</Text>
            <Text style={styles.detailValue}>{center.time}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Route:</Text>
            <Text style={styles.detailValue}>Via Main Street → Center Ave</Text>
          </View>

          <View style={styles.warningContainer}>
            <Text style={styles.warningTitle}>⚠️ Warning</Text>
            <Text style={styles.warningText}>
              Real-time information about evacuation centers – including capacity, current occupancy, and operational
              status – will be available during a disaster.
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.preferredButton} onPress={handleSetPreferred}>
            <Text style={commonStyles.buttonText}>Set as Preferred Center</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  mapContainer: {
    height: height * 0.4,
    backgroundColor: "#e9ecef",
    justifyContent: "center",
    alignItems: "center",
  },
  mapPlaceholder: {
    fontSize: 24,
    color: colors.primary,
  },
  detailsContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flex: 1,
    paddingTop: 20,
  },
  detailsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    textAlign: "center",
    marginBottom: 20,
  },
  detailsContent: {
    paddingHorizontal: 20,
    flex: 1,
  },
  detailItem: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "flex-start",
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
    width: 120,
  },
  detailValue: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  warningContainer: {
    backgroundColor: "#fff3cd",
    borderRadius: 15,
    padding: 15,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#ffeaa7",
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#856404",
    marginBottom: 10,
  },
  warningText: {
    fontSize: 14,
    color: "#856404",
    lineHeight: 18,
  },
  buttonContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 10,
  },
  backButton: {
    backgroundColor: "#6c757d",
    padding: 12,
    borderRadius: 15,
    alignItems: "center",
    maxHeight: 40,
    justifyContent: "center",
    flex: 1,
  },
  backButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  preferredButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 15,
    alignItems: "center",
    maxHeight: 40,
    justifyContent: "center",
    flex: 2,
  },
  successContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flex: 1,
  },
  successContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  checkMark: {
    fontSize: 80,
    color: "#4CAF50",
    marginBottom: 20,
  },
  successMessage: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    textAlign: "center",
    marginBottom: 40,
  },
})

export default EvacuationDetailsScreen
