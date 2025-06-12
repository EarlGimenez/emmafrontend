"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Picker } from "@react-native-picker/picker"
import * as ImagePicker from "expo-image-picker"
import { colors, commonStyles } from "../../styles/commonStyles"

const GeneralVerificationScreen = ({ navigation, route }: any) => {
  const { userData } = route.params
  const [primaryIdType, setPrimaryIdType] = useState("")
  const [secondaryIdType, setSecondaryIdType] = useState("")
  const [primaryImage, setPrimaryImage] = useState<string | null>(null)
  const [secondaryImage, setSecondaryImage] = useState<string | null>(null)

  const idTypes = ["Driver's License", "Passport", "National ID", "SSS ID", "PhilHealth ID", "TIN ID", "Voter's ID"]

  const handleImageUpload = async (type: "primary" | "secondary") => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      if (type === "primary") {
        setPrimaryImage(result.assets[0].uri)
      } else {
        setSecondaryImage(result.assets[0].uri)
      }
    }
  }

  const handleNext = () => {
    const completeUserData = {
      ...userData,
      primaryIdType,
      secondaryIdType,
      primaryImage: primaryImage ? "Primary image uploaded" : "No primary image",
      secondaryImage: secondaryImage ? "Secondary image uploaded" : "No secondary image",
      verificationType: userData.accountType === "parent" ? "Parent/Guardian" : "General User",
      timestamp: new Date().toISOString(),
    }

    console.log("Identity verification completed:", completeUserData)

    navigation.navigate("AdditionalInfo", { userData: completeUserData })
  }

  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={commonStyles.mainThemeBackground}>
      <View style={commonStyles.container}>
        <TouchableOpacity style={commonStyles.backButton} onPress={() => navigation.goBack()}>
          <Text style={commonStyles.backButtonText}>← Verification</Text>
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
              <TouchableOpacity style={styles.uploadButton} onPress={() => handleImageUpload("primary")}>
                <Text style={styles.uploadButtonText}>Upload Primary ID</Text>
              </TouchableOpacity>
            </View>

            {primaryImage && (
              <View style={styles.imageContainer}>
                <Image source={{ uri: primaryImage }} style={styles.previewImage} />
              </View>
            )}

            <View style={styles.pickerContainer}>
              <Text style={styles.label}>Secondary Government-issued ID Type (Optional)</Text>
              <Picker selectedValue={secondaryIdType} onValueChange={setSecondaryIdType} style={styles.picker}>
                <Picker.Item label="Select ID Type" value="" />
                {idTypes.map((type) => (
                  <Picker.Item key={type} label={type} value={type} />
                ))}
              </Picker>
            </View>

            <View style={styles.uploadSection}>
              <TouchableOpacity style={styles.uploadButton} onPress={() => handleImageUpload("secondary")}>
                <Text style={styles.uploadButtonText}>Upload Secondary ID</Text>
              </TouchableOpacity>
            </View>

            {secondaryImage && (
              <View style={styles.imageContainer}>
                <Image source={{ uri: secondaryImage }} style={styles.previewImage} />
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
    width: 140,
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

export default GeneralVerificationScreen
