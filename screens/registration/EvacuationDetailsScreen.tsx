"use client"

import { useState, useRef, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator, ScrollView } from "react-native"
import { WebView } from "react-native-webview"
import { colors, commonStyles } from "../../styles/commonStyles"

const { height } = Dimensions.get("window")

// Map HTML factory (fixed OSRM template literals)
const createMapHTML = (userLat: number, userLng: number, centerLat: number, centerLng: number) => `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <style>html,body,#map{height:100%;margin:0}</style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    const map = L.map('map');
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap contributors'}).addTo(map);

    const userMarker = L.marker([${userLat}, ${userLng}]).addTo(map).bindPopup('Your Location');
    const centerMarker = L.marker([${centerLat}, ${centerLng}]).addTo(map).bindPopup('Evacuation Center');

    fetch('https://router.project-osrm.org/route/v1/driving/${userLng},${userLat};${centerLng},${centerLat}?overview=full&geometries=geojson')
      .then(r=>r.json())
      .then(data=>{
        const route = L.geoJSON(data.routes[0].geometry,{style:{color:'#0074D9',weight:5,opacity:0.6}}).addTo(map);
        map.fitBounds(route.getBounds(),{padding:[50,50]});
        const distance=(data.routes[0].distance/1000).toFixed(2);
        const duration=Math.round(data.routes[0].duration/60);
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({type:'routeInfo',distance,duration}));
      })
      .catch(_e=>{
        map.fitBounds(L.latLngBounds([userMarker.getLatLng(), centerMarker.getLatLng()]));
      });
  </script>
</body>
</html>
`

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

const SHEET_RADIUS = 20

const EvacuationDetailsScreen = ({ navigation, route }: any) => {
  const center: Center = route.params?.center
  const userLocation = route.params?.userLocation
  const [showSuccess, setShowSuccess] = useState(false)
  const [isMapLoading, setIsMapLoading] = useState(true)
  const [routeInfo, setRouteInfo] = useState({ distance: 0, duration: 0 })
  const webViewRef = useRef<any>(null)

  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data)
      if (data.type === "routeInfo") {
        setRouteInfo({ distance: parseFloat(data.distance), duration: data.duration })
      }
    } catch {}
  }

  useEffect(() => {
    // keep logs if you need; otherwise silence
  }, [userLocation, center, isMapLoading])

  const handleSetPreferred = () => {
    setShowSuccess(true)
  }

  const handleNext = () => {
    const updatedUserData = {
      ...route.params?.userData,
      preferredCenter: {
        id: center.id,
        name: center.name,
        coordinates: { latitude: center.latitude, longitude: center.longitude },
      },
    }
    navigation.navigate("AccountSetup", { userData: updatedUserData })
  }

  if (!center) {
    return (
      <View style={[styles.container, styles.centerAll]}>
        <Text style={styles.errorText}>Error: No evacuation center data provided</Text>
        <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={() => navigation.goBack()}>
          <Text style={styles.btnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const MapBlock = (
    <View style={styles.mapContainer}>
      <WebView
        ref={webViewRef}
        source={{
          html: createMapHTML(
            userLocation?.latitude || 14.5995,
            userLocation?.longitude || 120.9842,
            center.latitude,
            center.longitude
          ),
        }}
        style={styles.map}
        onLoadEnd={() => setIsMapLoading(false)}
        onMessage={handleWebViewMessage}
        javaScriptEnabled
        domStorageEnabled
        originWhitelist={["*"]}
      />
      {isMapLoading && (
        <View style={styles.mapLoading}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </View>
  )

  if (showSuccess) {
    // ✅ Success path also scrolls (just in case text grows or small screens)
    return (
      <View style={styles.container}>
        {MapBlock}
        <ScrollView style={styles.sheetScroll} contentContainerStyle={{ paddingBottom: 24 }}>
          <View style={[styles.sheetTop, styles.centerAll, { paddingHorizontal: 20 }]}>
            <Text style={styles.checkMark}>✓</Text>
            <Text style={styles.successTitle}>{center.name}</Text>
            <Text style={styles.successMessage}>has been set as your preferred evacuation center.</Text>
            <TouchableOpacity style={[styles.btn, styles.btnPrimary, { width: "100%" }]} onPress={handleNext}>
              <Text style={commonStyles.buttonText}>Continue to Account Setup</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {MapBlock}

      {/* ✅ Details now scroll */}
      <ScrollView style={styles.sheetScroll} contentContainerStyle={{ paddingBottom: 28 }}>
        <View style={styles.sheetTop}>
          <Text style={styles.title}>Evacuation Center Details</Text>

          {(routeInfo.distance || routeInfo.duration) ? (
            <View style={styles.pillRow}>
              <Text style={styles.pill}>≈ {routeInfo.distance.toFixed(1)} km</Text>
              <Text style={styles.pill}>• {routeInfo.duration} min</Text>
            </View>
          ) : null}

          <View style={styles.rows}>
            <Row label="Name" value={center.name} />
            {center.description ? <Row label="Description" value={center.description} /> : null}
            <Row label="Location" value={`Lat: ${center.latitude}\nLng: ${center.longitude}`} />
            <Row label="Distance" value={`${center.distance.toFixed(1)} km`} />
            <Row label="Est. Time" value={center.time} />
            <Row label="Category" value={center.category} />
          </View>

          <View style={styles.notice}>
            <Text style={styles.noticeTitle}>⚠️  Warning</Text>
            <Text style={styles.noticeText}>
              Real-time evacuation data (capacity, occupancy, open/closed status) will be available during a disaster.
            </Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={() => navigation.goBack()}>
              <Text style={styles.btnText}>Back</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.btn, styles.btnPrimary, { flex: 2 }]} onPress={handleSetPreferred}>
              <Text style={commonStyles.buttonText}>Set as Preferred Center</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const Row = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
)

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  centerAll: { justifyContent: "center", alignItems: "center" },

  mapContainer: {
    height: height * 0.42,
    width: "100%",
    backgroundColor: "#e9ecef",
    overflow: "hidden",
  },
  map: { flex: 1, width: "100%", height: "100%" },
  mapLoading: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.85)",
  },

  // ✅ Scroll wrapper for the bottom sheet
  sheetScroll: { flex: 1, backgroundColor: "#fff" },

  // ⬇️ Removed `flex: 1` so the content can be measured by the ScrollView
  sheetTop: {
    backgroundColor: "#fff",
    borderTopLeftRadius: SHEET_RADIUS,
    borderTopRightRadius: SHEET_RADIUS,
    paddingTop: 18,
    paddingBottom: 24,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },

  title: { fontSize: 22, fontWeight: "700", color: colors.primary, textAlign: "center", marginBottom: 14 },

  pillRow: { flexDirection: "row", justifyContent: "center", marginBottom: 10 },
  pill: {
    fontSize: 12,
    color: colors.primary,
    backgroundColor: "#f2f7ff",
    borderWidth: 1,
    borderColor: "#d8e8ff",
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginHorizontal: 4,
  },

  rows: { marginTop: 4, marginBottom: 12 },
  row: { flexDirection: "row", alignItems: "flex-start", marginBottom: 10 },
  label: { width: 110, fontSize: 15, fontWeight: "600", color: colors.primary },
  value: { flex: 1, fontSize: 15, color: "#333", lineHeight: 20 },

  notice: {
    backgroundColor: "#fff7e6",
    borderColor: "#ffe1a6",
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  noticeTitle: { fontSize: 15, fontWeight: "700", color: "#8a6100", marginBottom: 6 },
  noticeText: { fontSize: 13, color: "#8a6100", lineHeight: 18 },

  actions: { flexDirection: "row", gap: 10, paddingTop: 6 },

  btn: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    maxHeight: 50,
    flex: 1,
  },
  btnPrimary: { backgroundColor: colors.primary },
  btnSecondary: { backgroundColor: "#6c757d" },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },

  checkMark: { fontSize: 80, color: "#4CAF50", marginBottom: 14 },
  successTitle: { fontSize: 20, fontWeight: "700", color: colors.primary, marginBottom: 6, textAlign: "center" },
  successMessage: { fontSize: 15, color: "#333", marginBottom: 18, textAlign: "center" },
  errorText: { fontSize: 16, color: "#d32f2f", textAlign: "center", marginBottom: 20 },
})

export default EvacuationDetailsScreen
