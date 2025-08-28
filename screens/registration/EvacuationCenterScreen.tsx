"use client"

import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native"

import { colors, commonStyles } from "../../styles/commonStyles"
import RegistrationHeader from "../../components/screen_components/RegistrationHeader"
import { fetcher } from "../../utils/fetcher"
import { API_URLS } from "@/config/api"

interface Center {
  id: number
  name: string
  description?: string
  latitude: number
  longitude: number
  distance: number  // km
  category: string
}

const HEADER_HEIGHT = 140
const DIP_HEIGHT = 56
const DIP_OVERLAP = 24
const HEADER_OFFSET = HEADER_HEIGHT + (DIP_HEIGHT - DIP_OVERLAP) + 12
const SCROLL_BOTTOM_SPACING = 80

const EvacuationCenterScreen = ({ navigation, route }: any) => {
  const [centers, setCenters] = useState<Center[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const coordinates = route.params?.locationData?.coordinates

  const computeEstimatedTime = (distanceKm: number): string => {
    const walkingSpeedKmph = 5
    const timeMinutes = Math.round((distanceKm / walkingSpeedKmph) * 60)
    return `${timeMinutes} mins`
  }

  useEffect(() => {
    if (!coordinates) return
    let timeoutId: any

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetcher(API_URLS.mapGeoCode.nearest, {
          method: "GET",
          params: { latitude: String(coordinates.lat), longitude: String(coordinates.lng) },
        })

        if (response?.error) {
          setError(response.message || "Failed to fetch centers")
          return
        }

        if (Array.isArray(response)) {
          setCenters(
            response.map((c: any) => ({
              ...c,
              distance: c.distance,
            }))
          )
        } else {
          setError("Invalid response format")
        }
      } catch (e: any) {
        setError(e?.message || "Something went wrong")
      } finally {
        clearTimeout(timeoutId)
        setLoading(false)
      }
    }

    timeoutId = setTimeout(() => {
      if (loading) {
        setError("Request took too long (5 seconds)")
        setLoading(false)
      }
    }, 5000)

    fetchData()
    return () => clearTimeout(timeoutId)
  }, [coordinates])

  const handleCenterSelect = (centerId: number) => {
    const center = centers.find((c) => c.id === centerId)
    if (!center) return

    navigation.navigate("EvacuationDetails", {
      center,
      userLocation: { latitude: coordinates.lat, longitude: coordinates.lng },
      userData: route.params?.userData,
    })
  }

  // Loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <ScrollView style={{ marginTop: HEADER_OFFSET }} contentContainerStyle={styles.centerWrap}>
          <View style={styles.sheetCenter}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Finding nearby evacuation centers...</Text>
          </View>
        </ScrollView>
        <RegistrationHeader title="Evacuation Centers" onBackPress={() => navigation.goBack()} />
      </View>
    )
  }

  // Error state
  if (error) {
    return (
      <View style={styles.container}>
        <ScrollView style={{ marginTop: HEADER_OFFSET }} contentContainerStyle={styles.centerWrap}>
          <View style={styles.sheetCenter}>
            <Text style={styles.errorText}>Error: {error}</Text>
            <TouchableOpacity
              style={[commonStyles.button, { marginTop: 12 }]}
              onPress={() => {
                setError(null)
                setLoading(true)
              }}
            >
              <Text style={commonStyles.buttonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <RegistrationHeader title="Evacuation Centers" onBackPress={() => navigation.goBack()} />
      </View>
    )
  }

  // Normal
  return (
    <View style={styles.container}>
      <ScrollView
        style={{ marginTop: HEADER_OFFSET }}
        contentContainerStyle={{ paddingBottom: SCROLL_BOTTOM_SPACING }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sheet}>
          <Text style={commonStyles.title}>Suggested Evacuation Centers</Text>
          <Text style={styles.description}>
            Suggestions are based on accessibility and proximity from the location you provided. Select a center to view
            details and routes.
          </Text>

          <View style={{ gap: 12 }}>
            {centers.map((center) => (
              <TouchableOpacity key={center.id} style={styles.centerButton} onPress={() => handleCenterSelect(center.id)}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.centerName}>{center.name}</Text>
                  <View style={styles.centerDetails}>
                    <Text style={styles.centerMeta}>{center.distance.toFixed(1)} km</Text>
                    <Text style={styles.centerMeta}> • {computeEstimatedTime(center.distance)}</Text>
                  </View>
                </View>
                <Text style={styles.centerArrow}>→</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <RegistrationHeader title="Evacuation Centers" onBackPress={() => navigation.goBack()} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  sheet: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 6 },
    // shadowOpacity: 0.08,
    // shadowRadius: 12,
    elevation: 4,
  },
  sheetCenter: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  centerWrap: { paddingBottom: 80, justifyContent: "center", alignItems: "stretch", flexGrow: 1 },
  description: { fontSize: 14, color: "#666", lineHeight: 20, marginBottom: 12, textAlign: "center" },
  centerButton: {
    backgroundColor: colors.secondary,
    padding: 16,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  centerName: { fontSize: 16, fontWeight: "700", color: colors.white, marginBottom: 4 },
  centerDetails: { flexDirection: "row", alignItems: "center" },
  centerMeta: { fontSize: 14, color: colors.white, opacity: 0.9 },
  centerArrow: { fontSize: 20, color: colors.white, fontWeight: "bold", marginLeft: 10 },
  loadingText: { fontSize: 16, color: colors.primary, marginTop: 16, textAlign: "center" },
  errorText: { fontSize: 16, color: "#d32f2f", textAlign: "center" },
})

export default EvacuationCenterScreen
