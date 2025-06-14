"use client"

import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { colors, commonStyles } from "../../styles/commonStyles"
import { fetcher } from "../../utils/fetcher"
import { API_URLS } from "@/config/api"

interface Center {
  id: number
  name: string
  description?: string
  latitude: number
  longitude: number
  distance: number  // in km, provided by backend
  category: string
}

const EvacuationCenterScreen = ({ navigation, route }: any) => {
  const [selectedCenter, setSelectedCenter] = useState<number | null>(null)
  const [centers, setCenters] = useState<Center[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

const { locationData } = route.params || {}
  const coordinates = locationData?.coordinates

useEffect(() => {
    if (coordinates) {
      setLoading(true)
      setError(null)

      try {
        const fetchData = async () => {
          const response = await fetcher(API_URLS.mapGeoCode.nearest, {
            method: 'GET',
            params: {
              latitude: String(coordinates.lat),
              longitude: String(coordinates.lng)
            }
          })

          if (response) {
            setCenters(response.map((center: any) => ({
              ...center,
              distance: center.distance,
              time: computeEstimatedTime(center.distance)
            })))
          }
        }

        // Set timeout for 5 seconds
        const timeoutId = setTimeout(() => {
          if (loading) {
            setError('Request took too long (5 seconds)')
            setLoading(false)
          }
        }, 5000)

        fetchData().catch(error => {
          setError(error.message)
        }).finally(() => {
          clearTimeout(timeoutId)
          setLoading(false)
        })

      } catch (error: any) {
        setError(error.message)
        setLoading(false)
      }
    }
  }, [coordinates])
  
  const computeEstimatedTime = (distanceKm: number): string => {
    const walkingSpeedKmph = 5  // 5 km/h (avg walking speed)
    const timeHours = distanceKm / walkingSpeedKmph
    const timeMinutes = Math.round(timeHours * 60)
    return `${timeMinutes} mins`
  }

  const handleCenterSelect = (centerId: number) => {
    const center = centers.find(c => c.id === centerId)
    console.log("Evacuation center selected:", {
      centerId,
      centerName: center?.name,
      distance: center?.distance,
      // estimatedTime: center?.time,
      timestamp: new Date().toISOString()
    })
    navigation.navigate("EvacuationDetails", { center })
  }

  if (loading) {
    return (
      <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={commonStyles.mainThemeBackground}>
        <View style={commonStyles.container}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </LinearGradient>
    )
  }

  if (error) {
    return (
      <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={commonStyles.mainThemeBackground}>
        <View style={commonStyles.container}>
          <Text>Error: {error}</Text>
        </View>
      </LinearGradient>
    )
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
                Evacuation center suggestions are based on factors like accessibility and proximity from the information you provided.
                {"\n\n"}
                Select your preferred evacuation center and view details and routes.
              </Text>

              <View style={styles.centersList}>
                {centers.map(center => (
                  <TouchableOpacity
                    key={center.id}
                    style={styles.centerButton}
                    onPress={() => handleCenterSelect(center.id)}
                  >
                    <View style={styles.centerInfo}>
                      <Text style={styles.centerName}>{center.name}</Text>
                      <View style={styles.centerDetails}>
                        <Text style={styles.centerDistance}>{center.distance.toFixed(1)} km</Text>
                        <Text style={styles.centerTime}>• {computeEstimatedTime(center.distance)}</Text>
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
