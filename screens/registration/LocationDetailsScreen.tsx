"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator, Platform } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { colors, commonStyles } from "../../styles/commonStyles"
import { WebView } from "react-native-webview"
import { API_URLS } from "@/config/api"
import { fetcher } from "../../utils/fetcher"

// const { width } = Dimensions.get("window")

const LocationDetailsScreen = ({ navigation, route }: any) => {
  const [homeAddress, setHomeAddress] = useState("")
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState("")
  const webViewRef = useRef<any>(null)
  const lastSearchRef = useRef<string>("")
  const isSettingFromMapRef = useRef(false)
  const debounceTimerRef = useRef<number | null>(null)
  
  // HTML template for our OpenStreetMap implementation
  const mapHTML = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>OpenStreetMap</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <style>
      body, html { margin: 0; padding: 0; height: 100%; }
      #map { height: 100%; width: 100%; }
    </style>
  </head>
  <body>
    <div id="map"></div>
    
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script>
      // Initialize the map
      const map = L.map('map').setView([51.505, -0.09], 13);
      
      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      // Add click event handler
      let marker = null;
      map.on('click', function(e) {
        const { lat, lng } = e.latlng;
        
        // Remove previous marker if exists
        if (marker) {
          map.removeLayer(marker);
        }
        
        // Add new marker
        marker = L.marker([lat, lng]).addTo(map);
        
        // Send coordinates to React Native
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'locationSelected',
          lat: lat,
          lng: lng
        }));
      });
      
      // Handle device ready event
      document.addEventListener('DOMContentLoaded', function() {
        // Notify React Native that the map is ready
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'mapReady'
        }));
      });
      
      // Function to set location from external call
      function setMapLocation(lat, lng) {
        if (marker) {
          map.removeLayer(marker);
        }
        marker = L.marker([lat, lng]).addTo(map);
        map.setView([lat, lng], 15);
        
        // Notify React Native about the new location
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'locationSelected',
          lat: lat,
          lng: lng
        }));
      }
    </script>
  </body>
  </html>
  `

  const handleWebViewMessage = useCallback(async (event: any) => {
    const message = JSON.parse(event.nativeEvent.data)
    
    if (message.type === 'locationSelected') {
      const { lat, lng } = message
      setSelectedLocation({ lat, lng })
      
      // Only reverse geocode if this came from a direct map interaction
      if (!isSettingFromMapRef.current) {
        fetchAddressFromCoordinates(lat, lng)
      }
      isSettingFromMapRef.current = false
    }
  }, [])

 const handleAddressSearch = useCallback(async () => {
    if (!homeAddress.trim() || homeAddress === lastSearchRef.current) return;
    
    setIsSearching(true);
    setError("");
    lastSearchRef.current = homeAddress;
    
    try {
      console.log("Searching for address:", homeAddress);

      // Use fetcher instead of axios
      const response = await fetcher(API_URLS.mapGeoCode.geocode, {
        params: { address: homeAddress }
      });

      console.log("Geocode response:", response);

      if (response.error) {
        setError(response.error + (response.message ? `: ${response.message}` : ''));
        return;
      }

      if (response && response.length > 0) {
        const firstResult = response[0];
        const lat = parseFloat(firstResult.lat);
        const lng = parseFloat(firstResult.lon);

        // Set flag to prevent reverse geocode
        isSettingFromMapRef.current = true;

        // Update map location
        if (webViewRef.current) {
          webViewRef.current.injectJavaScript(`
            setMapLocation(${lat}, ${lng});
            true;
          `);
        }

        setSelectedLocation({ lat, lng });

        // UPDATE: Set the address to the full display name
        const displayName = firstResult.display_name || homeAddress;
        setHomeAddress(displayName);
        lastSearchRef.current = displayName;
      } else {
        setError("Address not found");
      }
    } catch (err: any) {
      console.error('Geocoding error:', err);

      let errorMsg = "Error searching address";
      if (err.message) {
        errorMsg = err.message;
      }
      setError(errorMsg);
    } finally {
      setIsSearching(false);
    }
  }, [homeAddress]);

  // Debounced search with proper cleanup
  useEffect(() => {
    // Clear any existing timeout
    if (debounceTimerRef.current !== null) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Only search if we have text and it's changed
    if (homeAddress.trim() && homeAddress !== lastSearchRef.current) {
      // Set new timeout with type assertion
      debounceTimerRef.current = setTimeout(() => {
        handleAddressSearch();
      }, 2000) as unknown as number;
    }
    
    // Cleanup function
    return () => {
      if (debounceTimerRef.current !== null) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [homeAddress, handleAddressSearch]);

  const fetchAddressFromCoordinates = useCallback(async (lat: number, lng: number) => {
    setIsLoading(true);
    setError("");

    try {
      // Use fetcher instead of axios
      const response = await fetcher(API_URLS.mapGeoCode.reverse_geocode, {
        params: { lat: String(lat), lng: String(lng) }
      });

      if (response.display_name) {
        setHomeAddress(response.display_name);
        lastSearchRef.current = response.display_name;
      } else if (response.error) {
        setError(response.error);
      } else {
        setError("Address not found");
      }
    } catch (err: any) {
      let errorMsg = "Error fetching address";
      if (err.message) {
        errorMsg = err.message;
      }
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);


const handleConfirm = useCallback(() => {
  if (!selectedLocation || !homeAddress) return;

  // Update locationData structure to include address explicitly
  const locationData = {
    address: homeAddress,         // Changed from homeAddress to match backend expectations
    coordinates: {
      lat: selectedLocation.lat,  // Explicitly structure coordinates
      lng: selectedLocation.lng
    },
    timestamp: new Date().toISOString()
  };

  // Pass both locationData and existing userData
  navigation.navigate("EvacuationCenter", { 
    locationData,
    userData: {
      ...route.params?.userData,
      locationDetails: locationData  // Add location to userData for final submission
    }
  });
}, [selectedLocation, homeAddress, navigation, route.params?.userData]);

  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={commonStyles.mainThemeBackground}>
      <View style={commonStyles.container}>
        <TouchableOpacity style={commonStyles.backButton} onPress={() => navigation.goBack()}>
          <Text style={commonStyles.backArrow}>←</Text>
          <Text style={commonStyles.backButtonText}>Location Details</Text>
        </TouchableOpacity>
        <View style={commonStyles.whiteContainer}>
          <Text style={commonStyles.title}>Location and Evacuation Details</Text>

          <View style={styles.contentContainer}>
            <View style={commonStyles.fieldContainer}>
              <Text style={commonStyles.fieldLabel}>Home Address</Text>
              <View style={styles.searchContainer}>
                <TextInput
                  style={[commonStyles.input, styles.searchInput]}
                  placeholder="Enter your home address"
                  value={homeAddress}
                  onChangeText={setHomeAddress}
                  returnKeyType="search"
                  onSubmitEditing={handleAddressSearch}
                />
                <TouchableOpacity 
                  style={styles.searchButton} 
                  onPress={handleAddressSearch}
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                  ) : (
                    <Text style={styles.searchIcon}></Text>
                  )}
                </TouchableOpacity>
              </View>
              {isLoading && <ActivityIndicator size="small" color={colors.primary} />}
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              <Text style={styles.note}>
                Start typing to search. The map will update automatically.
              </Text>
            </View>

            <Text style={styles.mapLabel}>Tap on the map to pin your location</Text>

            <View style={styles.mapContainer}>
              <WebView
                ref={webViewRef}
                source={{ html: mapHTML }}
                style={styles.map}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                onMessage={handleWebViewMessage}
                startInLoadingState={true}
                renderLoading={() => (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                  </View>
                )}
              />
            </View>
          </View>

          <View style={commonStyles.bottomButton}>
            <TouchableOpacity
              style={[commonStyles.button, (!homeAddress || !selectedLocation) && styles.disabledButton]}
              onPress={handleConfirm}
              disabled={!homeAddress || !selectedLocation}
            >
              <Text style={commonStyles.buttonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    marginRight: 10,
  },
  searchButton: {
    padding: 10,

    borderRadius: 5,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    fontSize: 20,
  },
  mapLabel: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 10,
    fontWeight: "500",
  },
  mapContainer: {
    width: "100%",
    height: 300,
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  loadingContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
    fontSize: 12,
  },
  disabledButton: {
    opacity: 0.5,
  },
  note: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    fontStyle: 'italic',
  },
})

export default LocationDetailsScreen