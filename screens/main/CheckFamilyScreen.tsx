"use client";

import * as ImagePicker from 'expo-image-picker';
import { getUserId } from '@/utils/storage';
import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Dimensions, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../styles/commonStyles";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { fetcher } from "@/utils/fetcher";
import { API_URLS } from "@/config/api";
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';

const { width } = Dimensions.get("window");

const CheckFamilyScreen = ({ navigation }: any) => {
  const [facing, setFacing] = useState<CameraType>("back");
  const [scanning, setScanning] = useState(false);
  const [familyCode, setFamilyCode] = useState("");
  const [permission, requestPermission] = useCameraPermissions();
  const [familyName, setFamilyName] = useState('');

  // Check if the user is already part of a family
useEffect(() => {
  const checkFamilyStatus = async () => {
    try {
      const userId = await getUserId();
      if (!userId) {
        Alert.alert("Error", "User ID is required to check family status");
        return;
      }
      
      // Make sure we're using the correct endpoint
      const response = await fetcher(API_URLS.family.current, {
        params: { userId }
      });

      console.log("Family status response:", response);
      
      if (response.success && response.familyName) {
        navigation.replace("MyFamily");
      }
    } catch (error) {
      console.error("Error checking family status:", error);
      Alert.alert("Error", "Failed to check family status");
    }
  };

  // Add navigation listener to re-check on focus
  const unsubscribe = navigation.addListener('focus', checkFamilyStatus);
  
  // Check immediately
  checkFamilyStatus();
  
  return unsubscribe;
}, [navigation]);

  const handleScanQR = async () => {
    const { status } = await requestPermission();
    if (status === "granted") {
      setScanning(true);
    } else {
      Alert.alert("Permission Required", "Camera permission is needed to scan QR codes");
    }
  };

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    setScanning(false);
    try {
      const userId = await getUserId();
      if (!userId) {
        Alert.alert("Error", "User ID is required to join a family");
        return;
      }

      const qrData = JSON.parse(data);
      if (!qrData.familyId) {
        throw new Error("QR code does not contain a valid family ID");
      }

      // Don't send userId in body since backend expects query param
      const response = await fetcher(API_URLS.family.join, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          familyId: qrData.familyId,
          joinCode: qrData.joinCode ?? null
        }),
        // Add userId as query parameter
        params: {userId}
      });

      if (response.success) {
        navigation.replace("MyFamily");
      } else {
        throw new Error(response.message || "Failed to join family");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "An error occurred");
      setScanning(true);
    }
  };


const handleUploadQR = async () => {
  try {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please allow access to your photos to upload QR code');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      // Create form data with proper typing
      const formData = new FormData();
      const fileUri = result.assets[0].uri;
      const fileName = fileUri.split('/').pop() || 'qr-code.jpg';
      
      // @ts-ignore - React Native's FormData implementation accepts additional properties
      formData.append('qrImage', {
        uri: fileUri,
        type: 'image/jpeg',
        name: fileName,
      });

      const userId = await getUserId();
      if (userId) {
        formData.append('userId', userId);
      }

      const response = await fetcher(API_URLS.family.uploadQR, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (response.success) {
        Alert.alert('Success', 'QR code processed successfully', [
          { text: 'OK', onPress: () => navigation.replace('MyFamily') }
        ]);
      } else {
        Alert.alert('Error', response.message || 'Failed to process QR code');
      }
    }
  } catch (error) {
    console.error('Error uploading QR:', error);
    Alert.alert('Error', 'Failed to upload QR code');
  }
};

const handleJoinWithCode = async () => {
  try {
    if (!familyCode.trim()) {
      Alert.alert('Error', 'Please enter a family code');
      return;
    }

    const userId = await getUserId();
    if (!userId) {
      Alert.alert('Error', 'User ID not found');
      return;
    }

    const response = await fetcher(API_URLS.family.joinByCode, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: familyCode,
        userId: userId
      }),
    });

    if (response.success) {
      Alert.alert('Success', 'Successfully joined family!', [
        { text: 'OK', onPress: () => navigation.replace('MyFamily') }
      ]);
    } else {
      Alert.alert('Error', response.message || 'Failed to join family');
    }
  } catch (error) {
    console.error('Error joining family:', error);
    Alert.alert('Error', 'Failed to join family');
  }
};

  const handleCreateFamily = () => {
    console.log("Create Family pressed");
    navigation.navigate("CreateFamily");
  };

  const handleMenu = () => {
    console.log("Menu pressed");
  };

  const handleNotifications = () => {
    console.log("Notifications pressed");
  };

  return (
    <View
          style={[styles.container, {backgroundColor: colors.primary}]}
        >
          <View style={styles.header}>
                  <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())} style={styles.menuIcon}>
                    <Ionicons name="menu" size={30} color={colors.white} />
                  </TouchableOpacity>
          
                  <TouchableOpacity
                    style={styles.notificationButton}
                    onPress={handleNotifications}
                  >
                    <TouchableOpacity onPress={() => console.log('Notification Bell Pressed')} style={styles.notificationBell}>
                    <Ionicons name="notifications" size={26} color={colors.white} />
                  </TouchableOpacity>
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
              <TouchableOpacity style={styles.arrowButton} onPress={handleJoinWithCode}>
                <Text style={styles.arrowText}>→</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

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
    padding: 5,
  },
  notificationButton: {
    padding: 10,
  },
  notificationBell: {
    padding: 5,
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
