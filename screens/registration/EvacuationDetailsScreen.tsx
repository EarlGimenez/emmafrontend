"use client"

import { useState, useRef, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from "react-native"
import { WebView } from 'react-native-webview'
import { LinearGradient } from "expo-linear-gradient"
import { colors, commonStyles } from "../../styles/commonStyles"

// Add this constant after your imports
const createMapHTML = (userLat: number, userLng: number, centerLat: number, centerLng: number) => `
<!DOCTYPE html>
<html>
<head>
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
        const map = L.map('map');
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        const userMarker = L.marker([${userLat}, ${userLng}])
            .addTo(map)
            .bindPopup('Your Location');

        const centerMarker = L.marker([${centerLat}, ${centerLng}])
            .addTo(map)
            .bindPopup('Evacuation Center');

        // Fetch route from OSRM
        fetch(\`https://router.project-osrm.org/route/v1/driving/\${${userLng}},\${${userLat}};\${${centerLng}},\${${centerLat}}?overview=full&geometries=geojson\`)
            .then(response => response.json())
            .then(data => {
                const route = L.geoJSON(data.routes[0].geometry, {
                    style: {
                        color: '#0074D9',
                        weight: 5,
                        opacity: 0.6
                    }
                }).addTo(map);

                // Fit map to show entire route
                map.fitBounds(route.getBounds(), { padding: [50, 50] });

                // Calculate distance and duration
                const distance = (data.routes[0].distance / 1000).toFixed(2);
                const duration = Math.round(data.routes[0].duration / 60);
                
                window.ReactNativeWebView?.postMessage(JSON.stringify({
                    type: 'routeInfo',
                    distance: distance,
                    duration: duration
                }));
            })
            .catch(error => {
                console.error('Routing error:', error);
                map.fitBounds(L.latLngBounds([userMarker.getLatLng(), centerMarker.getLatLng()]));
            });
    </script>
</body>
</html>
`
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
  const userLocation = route.params?.userLocation // Make sure to pass this from previous screen
  const [showSuccess, setShowSuccess] = useState(false)
  const [isMapLoading, setIsMapLoading] = useState(true)
  const [routeInfo, setRouteInfo] = useState({ distance: 0, duration: 0 })
  const webViewRef = useRef(null)

  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data)
      if (data.type === 'routeInfo') {
        setRouteInfo({
          distance: parseFloat(data.distance),
          duration: data.duration
        })
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error)
    }
  }

useEffect(() => {
    console.log('User Location:', userLocation)
    console.log('Center Data:', center)
    console.log('Map Loading:', isMapLoading)
  }, [userLocation, center, isMapLoading])

  const renderMap = () => {
    console.log('Rendering map with coords:', {
      userLat: userLocation?.latitude || 14.5995,
      userLng: userLocation?.longitude || 120.9842,
      centerLat: center?.latitude,
      centerLng: center?.longitude
    })

    return (
      <View style={styles.mapContainer}>
        <WebView
          ref={webViewRef}
          source={{ 
            html: createMapHTML(
              userLocation?.latitude || 14.5995,
              userLocation?.longitude || 120.9842,
              center.latitude,
              center.longitude
            )
          }}
          style={styles.map}
          onLoadEnd={() => {
            console.log('WebView loaded')
            setIsMapLoading(false)
          }}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('WebView error: ', nativeEvent);
          }}
          onMessage={handleWebViewMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          originWhitelist={['*']}
        />
        {isMapLoading && (
          <View style={styles.mapLoading}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
      </View>
    )
  }

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
  const updatedUserData = {
    ...route.params?.userData,
    preferredCenter: {
      id: center.id,
      name: center.name,
      coordinates: {
        latitude: center.latitude,
        longitude: center.longitude
      }
    }
  };

  navigation.navigate("AccountSetup", { userData: updatedUserData });
};

  const handleBack = () => {
    navigation.goBack()
  }

  if (showSuccess) {
    return (
      <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={commonStyles.mainThemeBackground}>
        {renderMap()}

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
      {renderMap()}

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
  mapLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
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
    width: '100%', // Add this
    backgroundColor: "#e9ecef",
    overflow: 'hidden', // Add this
  },
  map: {
    flex: 1,
    width: '100%', // Add this
    height: '100%', // Add this
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
