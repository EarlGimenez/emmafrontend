"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from "react-native"

import { colors, commonStyles } from "../../styles/commonStyles"
import { WebView } from "react-native-webview"
import { API_URLS } from "@/config/api"
import { fetcher } from "../../utils/fetcher"
import RegistrationHeader from "../../components/screen_components/RegistrationHeader"

// Match RegistrationHeader geometry EXACTLY (no bonus pixels)
const HEADER_HEIGHT = 140
const DIP_HEIGHT = 24
const DIP_OVERLAP = 24
const HEADER_OFFSET = HEADER_HEIGHT + (DIP_HEIGHT - DIP_OVERLAP)
const SCROLL_BOTTOM_SPACING = 140

const LocationDetailsScreen = ({ navigation, route }: any) => {
  const [homeAddress, setHomeAddress] = useState("")
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState("")
  const webViewRef = useRef<any>(null)
  const lastSearchRef = useRef<string>("")
  const isSettingFromMapRef = useRef(false)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const mapHTML = `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/><style>html,body,#map{height:100%;margin:0}</style></head>
  <body><div id="map"></div><script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
  const map=L.map('map').setView([14.5995,120.9842],13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'&copy; OpenStreetMap contributors'}).addTo(map);
  let m=null;map.on('click',e=>{const {lat,lng}=e.latlng;if(m){map.removeLayer(m);}m=L.marker([lat,lng]).addTo(map);
  window.ReactNativeWebView.postMessage(JSON.stringify({type:'locationSelected',lat,lng}));});
  document.addEventListener('DOMContentLoaded',()=>{window.ReactNativeWebView.postMessage(JSON.stringify({type:'mapReady'}));});
  function setMapLocation(lat,lng){if(m){map.removeLayer(m);}m=L.marker([lat,lng]).addTo(map);map.setView([lat,lng],15);
  window.ReactNativeWebView.postMessage(JSON.stringify({type:'locationSelected',lat,lng}));}
  </script></body></html>`

  const handleWebViewMessage = useCallback(async (event: any) => {
    const message = JSON.parse(event.nativeEvent.data)
    if (message.type === "locationSelected") {
      const { lat, lng } = message
      setSelectedLocation({ lat, lng })
      if (!isSettingFromMapRef.current) {
        fetchAddressFromCoordinates(lat, lng)
      }
      isSettingFromMapRef.current = false
    }
  }, [])

  const handleAddressSearch = useCallback(async () => {
    if (!homeAddress.trim() || homeAddress === lastSearchRef.current) return
    setIsSearching(true)
    setError("")
    lastSearchRef.current = homeAddress
    try {
      const response = await fetcher(API_URLS.mapGeoCode.geocode, { params: { address: homeAddress } })
      if (response?.error) {
        // ✅ FIX: proper template literal (no escaped backticks)
        setError(response.error + (response.message ? `: ${response.message}` : ""))
        return
      }
      if (response && response.length > 0) {
        const first = response[0]
        const lat = parseFloat(first.lat)
        const lng = parseFloat(first.lon)
        isSettingFromMapRef.current = true
        if (webViewRef.current) {
          webViewRef.current.injectJavaScript(`setMapLocation(${lat}, ${lng}); true;`)
        }
        setSelectedLocation({ lat, lng })
        const displayName = first.display_name || homeAddress
        setHomeAddress(displayName)
        lastSearchRef.current = displayName
      } else {
        setError("Address not found")
      }
    } catch (err: any) {
      setError(err?.message || "Error searching address")
    } finally {
      setIsSearching(false)
    }
  }, [homeAddress])

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    if (homeAddress.trim() && homeAddress !== lastSearchRef.current) {
      debounceTimerRef.current = setTimeout(() => {
        handleAddressSearch()
      }, 2000)
    }
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
    }
  }, [homeAddress, handleAddressSearch])

  const fetchAddressFromCoordinates = useCallback(async (lat: number, lng: number) => {
    setIsLoading(true)
    setError("")
    try {
      const response = await fetcher(API_URLS.mapGeoCode.reverse_geocode, { params: { lat: String(lat), lng: String(lng) } })
      if (response?.display_name) {
        setHomeAddress(response.display_name)
        lastSearchRef.current = response.display_name
      } else if (response?.error) {
        setError(response.error)
      } else {
        setError("Address not found")
      }
    } catch (err: any) {
      setError(err?.message || "Error fetching address")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleConfirm = useCallback(() => {
    if (!selectedLocation || !homeAddress) return
    const locationData = {
      address: homeAddress,
      coordinates: { lat: selectedLocation.lat, lng: selectedLocation.lng },
      timestamp: new Date().toISOString(),
    }
    navigation.navigate("EvacuationCenter", {
      locationData,
      userData: { ...route.params?.userData, locationDetails: locationData },
    })
  }, [selectedLocation, homeAddress, navigation, route.params?.userData])

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingTop: HEADER_OFFSET, paddingBottom: SCROLL_BOTTOM_SPACING }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sheet}>
          <Text style={[commonStyles.title, styles.centerTitle]}>Location & Evacuation Details</Text>

          <View style={commonStyles.fieldContainer}>
            <Text style={commonStyles.fieldLabel}>Home Address</Text>
            <View style={styles.searchRow}>
              <TextInput
                style={[commonStyles.input, { flex: 1, marginRight: 10 }]}
                placeholder="Enter your home address"
                value={homeAddress}
                onChangeText={setHomeAddress}
                returnKeyType="search"
                onSubmitEditing={handleAddressSearch}
              />
              <TouchableOpacity style={styles.searchBtn} onPress={handleAddressSearch} disabled={isSearching}>
                {isSearching ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.searchTxt}>Search</Text>}
              </TouchableOpacity>
            </View>
            {isLoading && <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 8 }} />}
            {!!error && <Text style={styles.errorText}>{error}</Text>}
            <Text style={styles.note}>Start typing to search. The map will update automatically.</Text>
          </View>

          <Text style={styles.mapLabel}>Tap on the map to pin your location</Text>
          <View style={styles.mapContainer}>
            <WebView
              ref={webViewRef}
              source={{ html: mapHTML }}
              style={styles.map}
              javaScriptEnabled
              domStorageEnabled
              onMessage={handleWebViewMessage}
              startInLoadingState
              renderLoading={() => (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator size="large" color={colors.primary} />
                </View>
              )}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[commonStyles.button, (!homeAddress || !selectedLocation) && { opacity: 0.5 }]}
          onPress={handleConfirm}
          disabled={!homeAddress || !selectedLocation}
        >
          <Text style={commonStyles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      </View>

      <RegistrationHeader title="Location" onBackPress={() => navigation.goBack()} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scroll: { flex: 1 },

  centerTitle: { textAlign: "center" },

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

  searchRow: { flexDirection: "row", alignItems: "center" },
  searchBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 88,
    alignItems: "center",
    justifyContent: "center",
  },
  searchTxt: { color: "#fff", fontWeight: "600" },

  mapLabel: { fontSize: 14, color: colors.primary, marginBottom: 10, fontWeight: "500", textAlign: "center" },
  mapContainer: {
    width: "100%",
    height: 300,
    marginBottom: 20,
    borderRadius: 15,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: colors.primary,
  },
  map: { width: "100%", height: "100%" },
  loadingOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.7)",
  },

  errorText: { color: "#d32f2f", marginTop: 6, fontSize: 12, textAlign: "center" },
  note: { fontSize: 12, color: "#666", marginTop: 5, fontStyle: "italic" },

  bottomBar: { position: "absolute", left: 16, right: 16, bottom: 24 },
})

export default LocationDetailsScreen
