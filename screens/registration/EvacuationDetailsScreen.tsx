"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { colors, commonStyles } from "../../styles/commonStyles"

const { height } = Dimensions.get("window")

interface Center {
  id: number
  name: string
  description?: string
  latitude: number
  longitude: number
  distance: number
  time: string
  category: string
}

const EvacuationDetailsScreen = ({ navigation, route }: any) => {
  const center: Center = route.params?.center
  const [showSuccess, setShowSuccess] = useState(false)

  // Guard against undefined center
  if (!center) {
    return (
      <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={commonStyles.mainThemeBackground}>
        <View style={commonStyles.container}>
          <Text style={styles.errorText}>Error: No evacuation center data provided</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    )
  }

  const handleSetPreferred = () => {
    // Log with actual data from center
    console.log("Preferred evacuation center set:", {
      centerId: center.id,
      centerName: center.name,
      distance: center.distance,
      estimatedTime: center.time,
      coordinates: {
        latitude: center.latitude,
        longitude: center.longitude
      },
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
          <Text style={styles.mapPlaceholder}>
            <Text>🗺️</Text> Map View
          </Text>                
          <Text style={styles.coordinates}>
            ({center.latitude}, {center.longitude})
          </Text>
        </View>

        <View style={styles.successContainer}>
          <View style={styles.successContent}>
            <Text style={styles.checkMark}>✓</Text>
            <Text style={styles.successMessage}>
              {center.name} has been set as your preferred evacuation center
            </Text>
            <TouchableOpacity 
              style={[styles.preferredButton, { width: '100%' }]} 
              onPress={handleNext}
            >
              <Text style={commonStyles.buttonText}>Continue to Account Setup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    )
  }

  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={commonStyles.mainThemeBackground}>
      <View style={styles.mapContainer}>
        <Text style={styles.mapPlaceholder}>
          <Text>🗺️</Text> Map with Route
        </Text>        
        <Text style={styles.coordinates}>
          ({center.latitude}, {center.longitude})
        </Text>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.detailsTitle}>Evacuation Center Details</Text>

        <View style={styles.detailsContent}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Name:</Text>
            <Text style={styles.detailValue}>{center.name}</Text>
          </View>

          {center.description && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Description:</Text>
              <Text style={styles.detailValue}>{center.description}</Text>
            </View>
          )}

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Location:</Text>
            <Text style={styles.detailValue}>
              Lat: {center.latitude}
              {'\n'}
              Lng: {center.longitude}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Distance:</Text>
            <Text style={styles.detailValue}>{center.distance.toFixed(1)} km</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Est. Time:</Text>
            <Text style={styles.detailValue}>{center.time}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Category:</Text>
            <Text style={styles.detailValue}>{center.category}</Text>
          </View>

          <View style={styles.warningContainer}>
              <Text style={styles.warningTitle}>
                <Text>⚠️</Text> Warning
              </Text>
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
  errorText: {
    color: colors.white,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  coordinates: {
    position: 'absolute',
    bottom: 10,
    color: colors.primary,
    fontSize: 12,
  },
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
    maxHeight: 50,
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
    maxHeight: 50,
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
