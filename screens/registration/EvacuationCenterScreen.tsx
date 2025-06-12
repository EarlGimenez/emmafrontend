"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { colors, commonStyles } from "../../styles/commonStyles"

const EvacuationCenterScreen = ({ navigation }: any) => {
  const [selectedCenter, setSelectedCenter] = useState<string | null>(null)

  const evacuationCenters = [
    { id: "1", name: "City Sports Complex", distance: "2.5 km", time: "8 mins" },
    { id: "2", name: "Community Center Hall", distance: "1.8 km", time: "6 mins" },
    { id: "3", name: "Elementary School Gym", distance: "3.2 km", time: "12 mins" },
    { id: "4", name: "Municipal Building", distance: "4.1 km", time: "15 mins" },
  ]

  const handleCenterSelect = (centerId: string) => {
    setSelectedCenter(centerId)
    const center = evacuationCenters.find((c) => c.id === centerId)

    console.log("Evacuation center selected:", {
      centerId,
      centerName: center?.name,
      distance: center?.distance,
      estimatedTime: center?.time,
      timestamp: new Date().toISOString(),
    })

    navigation.navigate("EvacuationDetails", { center })
  }

  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={commonStyles.mainThemeBackground}>
      <View style={commonStyles.container}>
        <TouchableOpacity style={commonStyles.backButton} onPress={() => navigation.goBack()}>
          <Text style={commonStyles.backButtonText}>← Evacuation Centers</Text>
        </TouchableOpacity>

        <View style={commonStyles.whiteContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={commonStyles.title}>Suggested Evacuation Centers</Text>

            <View style={styles.contentContainer}>
              <Text style={styles.description}>
                Evacuation center suggestions are based on factors like accessibility and proximity from the information
                you provided.
                {"\n\n"}
                Select your preferred evacuation center and view details and routes.
              </Text>

              <View style={styles.centersList}>
                {evacuationCenters.map((center) => (
                  <TouchableOpacity
                    key={center.id}
                    style={styles.centerButton}
                    onPress={() => handleCenterSelect(center.id)}
                  >
                    <View style={styles.centerInfo}>
                      <Text style={styles.centerName}>{center.name}</Text>
                      <View style={styles.centerDetails}>
                        <Text style={styles.centerDistance}>{center.distance}</Text>
                        <Text style={styles.centerTime}>• {center.time}</Text>
                      </View>
                    </View>
                    <Text style={styles.centerArrow}>→</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 30,
    textAlign: "center",
  },
  centersList: {
    gap: 15,
  },
  centerButton: {
    backgroundColor: colors.secondary,
    padding: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  centerInfo: {
    flex: 1,
  },
  centerName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
    marginBottom: 5,
  },
  centerDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  centerDistance: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
  },
  centerTime: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
    marginLeft: 5,
  },
  centerArrow: {
    fontSize: 20,
    color: colors.white,
    fontWeight: "bold",
  },
})

export default EvacuationCenterScreen
