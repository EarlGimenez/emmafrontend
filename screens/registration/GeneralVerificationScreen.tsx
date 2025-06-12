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
          <Text style={commonStyles.backButtonText}>← User Identity Verification</Text>
        </TouchableOpacity>

        <View style={commonStyles.whiteContainer}>
          <Text style={commonStyles.title}>User Identity Verification</Text>
          <Text style={commonStyles.subtitle}>Upload a clear photo of the ID(s)</Text>

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Primary Government-issued ID Type</Text>
            <Picker selectedValue={primaryIdType} onValueChange={setPrimaryIdType} style={styles.picker}>
              <Picker.Item label="Select ID Type" value="" />
              {idTypes.map((type) => (
                <Picker.Item key={type} label={type} value={type} />
              ))}
            </Picker>
          </View>

          <View style={styles.uploadContainer}>
            <TouchableOpacity style={styles.uploadButton} onPress={() => handleImageUpload("primary")}>
              <Text style={styles.uploadButtonText}>Upload</Text>
            </TouchableOpacity>

            {primaryImage && <Image source={{ uri: primaryImage }} style={styles.previewImage} />}
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Secondary Government-issued ID Type (Optional)</Text>
            <Picker selectedValue={secondaryIdType} onValueChange={setSecondaryIdType} style={styles.picker}>
              <Picker.Item label="Select ID Type" value="" />
              {idTypes.map((type) => (
                <Picker.Item key={type} label={type} value={type} />
              ))}
            </Picker>
          </View>

          <View style={styles.uploadContainer}>
            <TouchableOpacity style={styles.uploadButton} onPress={() => handleImageUpload("secondary")}>
              <Text style={styles.uploadButtonText}>Upload</Text>
            </TouchableOpacity>

            {secondaryImage && <Image source={{ uri: secondaryImage }} style={styles.previewImage} />}
          </View>

          <TouchableOpacity style={commonStyles.button} onPress={handleNext}>
            <Text style={commonStyles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  pickerContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 5,
  },
  picker: {
    backgroundColor: colors.fieldBg,
    borderRadius: 8,
  },
  uploadContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 8,
    width: 100,
    alignItems: "center",
    marginRight: 15,
  },
  uploadButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  previewImage: {
    width: 100,
    height: 80,
    borderRadius: 8,
    resizeMode: "cover",
  },
})

export default GeneralVerificationScreen
