"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Dimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { colors, commonStyles } from "../../styles/commonStyles"
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { fetcher } from "@/utils/fetcher"
import { API_URLS } from "@/config/api"
import { Alert } from "react-native"

const { width } = Dimensions.get("window")

const CheckFamilyScreen = ({ navigation, route }: any) => {
  const [facing, setFacing] = useState<CameraType>('back');
  const [scanning, setScanning] = useState(false);
  const [familyCode, setFamilyCode] = useState("");
  const [permission, requestPermission] = useCameraPermissions();

  // Handle permission states
  if (!permission) {
    return (
      <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.container}>
        <View style={styles.mainWhiteContainer}>
          <Text style={styles.loadingText}>Loading camera permissions...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (!permission.granted) {
    return (
      <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.container}>
        <View style={styles.mainWhiteContainer}>
          <Text style={styles.message}>Camera permission is required to scan QR codes</Text>
          <TouchableOpacity 
            style={commonStyles.button} 
            onPress={requestPermission}
          >
            <Text style={commonStyles.buttonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  const handleScanQR = async () => {
    const { status } = await requestPermission();
    if (status === 'granted') {
      setScanning(true);
    } else {
      Alert.alert('Permission Required', 'Camera permission is needed to scan QR codes');
    }
  };

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
  setScanning(false);
  try {
    const qrData = JSON.parse(data);
    if (!qrData.familyId) throw new Error('Invalid QR code');

    const response = await fetcher(API_URLS.family.join, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        familyId: qrData.familyId,
        joinCode: qrData.joinCode // If your QR includes a join code
      })
    });

    if (response.success) {
      Alert.alert('Success', 'Successfully joined family', [{
        text: 'OK',
        onPress: () => navigation.replace("MyFamily")
      }]);
    } else {
      throw new Error(response.message || 'Failed to join family');
    }
  } catch (error: any) {
    Alert.alert('Error', error.message);
    setScanning(true);
  }
};


  const handleUploadQR = () => {
    console.log("Upload QR pressed - placeholder")
  }

  const handleEnterCode = async () => {
  if (!familyCode.trim()) {
    Alert.alert('Error', 'Please enter a family code');
    return;
  }

  try {
    const response = await fetcher(API_URLS.family.joinByCode, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code: familyCode.trim() })
    });

    if (response.success) {
      Alert.alert('Success', 'Successfully joined family', [{
        text: 'OK',
        onPress: () => navigation.replace("MyFamily")
      }]);
    } else {
      Alert.alert('Error', response.message || 'Failed to join family');
    }
  } catch (error: any) {
    Alert.alert('Error', error.message || 'Failed to join family');
  }
};

  const handleCreateFamily = () => {
    console.log("Create Family pressed")
    navigation.navigate("CreateFamily")
  }

  const handleMenu = () => {
    console.log("Menu pressed")
  }

  const handleNotifications = () => {
    console.log("Notifications pressed")
  }

  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={handleMenu}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.notificationButton} onPress={handleNotifications}>
          <Text style={styles.notificationIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mainWhiteContainer}>
        <Text style={styles.title}>Join Family</Text>

        {scanning && permission?.granted ? (
          <CameraView
            style={styles.camera}
            facing={facing}
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
            onBarcodeScanned={handleBarCodeScanned}
          />
        ) : (
          <TouchableOpacity style={styles.cameraContainer} onPress={handleScanQR}>
          <View style={styles.cameraBox}>
            <Text style={styles.cameraIcon}>📷</Text>
            <Text style={styles.cameraText}>Tap to scan QR code</Text>
          </View>
        </TouchableOpacity>
        )}

        <View style={styles.bottomSection}>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.uploadButton} onPress={handleUploadQR}>
              <Text style={styles.uploadButtonText}>Upload QR</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.createButton} onPress={handleCreateFamily}>
              <Text style={styles.createButtonText}>Create Family</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.codeSection}>
            <Text style={styles.codeLabel}>Enter family code</Text>
            <View style={styles.codeInputContainer}>
              <TextInput
                style={styles.codeInput}
                placeholder="Family Code"
                value={familyCode}
                onChangeText={setFamilyCode}
                placeholderTextColor="#999"
              />
              <TouchableOpacity style={styles.arrowButton} onPress={handleEnterCode}>
                <Text style={styles.arrowText}>→</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
   camera: {
    flex: 1,
    width: '100%',
    height: width * 0.8,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    padding: 20,
  },
  flipButton: {
    alignSelf: 'center',
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 5,
  },
  flipText: {
    color: 'white',
    fontSize: 16,
  },
  scanText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 5,
  },
  message: {
    textAlign: 'center',
    fontSize: 16,
    color: colors.primary,
    marginBottom: 20,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: colors.primary,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  menuButton: {
    padding: 10,
  },
  menuIcon: {
    fontSize: 24,
    color: colors.white,
    fontWeight: "bold",
  },
  notificationButton: {
    padding: 10,
  },
  notificationIcon: {
    fontSize: 24,
    color: colors.white,
  },
  mainWhiteContainer: {
    backgroundColor: colors.white,
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.primary,
    textAlign: "center",
    marginTop: 40,
    marginBottom: 40,
  },
  cameraContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 40,
  },
  cameraBox: {
    width: width,
    height: 300,
    backgroundColor: "#f0f0f0",
    borderWidth: 3,
    borderColor: colors.primary,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  cameraText: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: "600",
  },
  bottomSection: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "flex-end",
    paddingBottom: 40,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 30,
  },
  uploadButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    flex: 1,
  },
  uploadButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  createButton: {
    backgroundColor: colors.secondary,
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    flex: 1,
  },
  createButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  codeSection: {
    marginBottom: 20,
  },
  codeLabel: {
    fontSize: 16,
    color: colors.primary,
    marginBottom: 10,
    fontWeight: "500",
  },
  codeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  codeInput: {
    backgroundColor: colors.fieldBg,
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    flex: 1,
    color: colors.primary,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  arrowButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 15,
    minWidth: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  arrowText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "bold",
  },
})

export default CheckFamilyScreen
