"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Picker } from "@react-native-picker/picker"
import * as ImagePicker from "expo-image-picker"
import { colors, commonStyles } from "../../styles/commonStyles"

const ParentVerificationScreen = ({ navigation, route }: any) => {
const { userData } = route.params
  const [verificationStatus, setVerificationStatus] = useState("pending")
  const [primaryIdType, setPrimaryIdType] = useState("")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const idTypes = ["Driver's License", "Passport", "National ID", "SSS ID", "PhilHealth ID", "TIN ID", "Voter's ID"]

  const handleImageUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      setUploadedImage(result.assets[0].uri)
    }
  }

  const handleNext = () => {
      if (!primaryIdType || !uploadedImage) {
        alert("Please select an ID type and upload an image")
        return
      }

      const verifiedUserData = {
        ...userData,
        verificationDetails: {
          idType: primaryIdType,
          verificationImage: uploadedImage,
          verificationStatus: "verified",
          verifiedAt: new Date().toISOString()
        }
      }

      // For parent verification, we go to OTP screen first
      navigation.navigate("OTP", { 
        userData: verifiedUserData,
        fromScreen: "ParentVerification"
      })
    }

  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={commonStyles.mainThemeBackground}>
      <View style={commonStyles.container}>
        <TouchableOpacity style={commonStyles.backButton} onPress={() => navigation.goBack()}>
          <Text style={commonStyles.backButtonText}>← Registration</Text>
        </TouchableOpacity>

        <View style={commonStyles.whiteContainer}>
          <Text style={commonStyles.title}>User Identity Verification</Text>
          <Text style={[commonStyles.subtitle, { textAlign: "center", paddingHorizontal: 20 }]}>
            Upload a clear photo of the ID(s)
          </Text>

          <View style={commonStyles.centeredContent}>
            <View style={styles.pickerContainer}>
              <Text style={styles.label}>Primary Government-issued ID Type</Text>
              <Picker selectedValue={primaryIdType} onValueChange={setPrimaryIdType} style={styles.picker}>
                <Picker.Item label="Select ID Type" value="" />
                {idTypes.map((type) => (
                  <Picker.Item key={type} label={type} value={type} />
                ))}
              </Picker>
            </View>

            <View style={styles.uploadSection}>
              <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
                <Text style={styles.uploadButtonText}>Upload ID</Text>
              </TouchableOpacity>
            </View>

            {uploadedImage && (
              <View style={styles.imageContainer}>
                <Image source={{ uri: uploadedImage }} style={styles.previewImage} />
              </View>
            )}
          </View>

          <View style={commonStyles.bottomButton}>
            <TouchableOpacity style={commonStyles.button} onPress={handleNext}>
              <Text style={commonStyles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  pickerContainer: {
    marginBottom: 15,
    width: "100%",
  },
  label: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 5,
    fontWeight: "500",
  },
  picker: {
    backgroundColor: colors.fieldBg,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  uploadSection: {
    width: "100%",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 15,
    alignItems: "center",
    maxHeight: 40,
    justifyContent: "center",
    width: 100,
  },
  uploadButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  imageContainer: {
    width: "100%",
    marginBottom: 20,
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 15,
    resizeMode: "cover",
    borderWidth: 2,
    borderColor: colors.primary,
  },
})

export default ParentVerificationScreen
