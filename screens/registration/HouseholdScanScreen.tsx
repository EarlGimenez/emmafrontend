"use client"
import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from "react-native"
import { CameraView, CameraType, useCameraPermissions } from "expo-camera"
import { LinearGradient } from "expo-linear-gradient"
import { colors, commonStyles } from "../../styles/commonStyles"

const { width } = Dimensions.get("window")

const HouseholdScanScreen = ({ navigation }: any) => {
  const [permission, requestPermission] = useCameraPermissions()
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [facing, setFacing] = useState<CameraType>('back')

  // Check permission and start scanning on mount
  useEffect(() => {
    const checkAndStartScanning = async () => {
      if (!permission?.granted) {
        const result = await requestPermission()
        if (result.granted) {
          setScanning(true)
        }
      } else {
        setScanning(true)
      }
    }
    checkAndStartScanning()
  }, [permission?.granted])

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanning(false)
    navigation.navigate("HouseholdInfo", { householdName: data })
  }

  const handleStartScan = async () => {
    if (!permission?.granted) {
      const result = await requestPermission()
      if (!result.granted) {
        setError("Camera permission denied")
        return
      }
    }
    setScanning(true)
  }

  const handleSkip = () => {
    navigation.navigate("LocationDetails")
  }

  if (!permission) {
    return (
      <View style={[commonStyles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 16 }}>Checking camera permissions...</Text>
      </View>
    )
  }

  if (!permission.granted) {
    return (
      <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={commonStyles.mainThemeBackground}>
        <View style={[commonStyles.container, { justifyContent: "center", padding: 20 }]}>
          <Text style={styles.instructionText}>We need your permission to scan QR codes</Text>
          <TouchableOpacity 
            style={styles.skipButton} 
            onPress={requestPermission}
          >
            <Text style={commonStyles.buttonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    )
  }

 return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={commonStyles.mainThemeBackground}>
      <View style={commonStyles.container}>
        <TouchableOpacity style={commonStyles.backButton} onPress={() => navigation.goBack()}>
          <Text style={commonStyles.backArrow}>←</Text>
          <Text style={commonStyles.backButtonText}>Household Information</Text>
        </TouchableOpacity>

        <View style={commonStyles.whiteContainer}>
          <Text style={commonStyles.title}>Household Information</Text>

          <View style={styles.contentContainer}>
            <Text style={styles.instructionText}>Scan a household QR code to join</Text>

            <View style={styles.scannerContainer}>
              <View style={styles.scannerBox}>
                {permission?.granted ? (
                  <CameraView
                    style={styles.camera}
                    facing={facing}
                    barcodeScannerSettings={{
                      barcodeTypes: ["qr"],
                    }}
                    onBarcodeScanned={handleBarCodeScanned}
                  />
                ) : (
                  <TouchableOpacity onPress={handleStartScan}>
                    <View style={styles.scannerFrame}>
                      <Text style={styles.scannerIcon}>📷</Text>
                      <Text style={styles.scannerText}>Tap to scan QR code</Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <Text style={styles.noteText}>Note: A household QR code can be generated from parent/guardian account</Text>
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>

          <View style={commonStyles.bottomButton}>
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={commonStyles.buttonText}>Skip</Text>
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
    alignItems: "center",
  },
  instructionText: {
    fontSize: 18,
    color: colors.primary,
    textAlign: "center",
    marginBottom: 40,
  },
  scannerContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 30,
  },
  scannerBox: {
    width: width * 0.8,
    height: width * 0.8,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    borderWidth: 3,
    borderColor: colors.primary,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  scannerFrame: {
    alignItems: "center",
  },
  scannerIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  scannerText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "600",
  },
  noteText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
    paddingHorizontal: 20,
  },
  skipButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 15,
    alignItems: "center",
    maxHeight: 50,
    justifyContent: "center",
  },
  cameraContainer: {
    width: width * 0.9,
    height: width * 1.1,
    borderRadius: 20,
    overflow: "hidden",
    alignSelf: "center",
    marginVertical: 30,
  },
  camera: {
    width: "100%",
    height: "100%",
    borderRadius: 17
  },
  cancelButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    alignSelf: "center",
    width: 120,
  },
  errorText: {
    color: "#ff0000",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
})

export default HouseholdScanScreen