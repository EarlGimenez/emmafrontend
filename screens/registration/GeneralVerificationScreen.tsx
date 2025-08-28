"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from "react-native"
import { Picker } from "@react-native-picker/picker"
import * as ImagePicker from "expo-image-picker"

import { colors, commonStyles } from "../../styles/commonStyles"
import RegistrationHeader from "../../components/screen_components/RegistrationHeader"

// Match your RegistrationHeader geometry EXACTLY (no extra pixels)
const HEADER_HEIGHT = 140
const DIP_HEIGHT = 24
const DIP_OVERLAP = 24
const HEADER_OFFSET = HEADER_HEIGHT + (DIP_HEIGHT - DIP_OVERLAP)
const SCROLL_BOTTOM_SPACING = 140
const SHEET_RADIUS = 16

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
      const uri = result.assets[0].uri
      type === "primary" ? setPrimaryImage(uri) : setSecondaryImage(uri)
    }
  }

  const handleNext = () => {
    if (!primaryIdType || !primaryImage) {
      alert("Please upload at least a primary ID")
      return
    }

    const verifiedUserData = {
      ...userData,
      verificationDetails: {
        primaryId: { type: primaryIdType, image: primaryImage },
        secondaryId: secondaryIdType ? { type: secondaryIdType, image: secondaryImage } : undefined,
        verificationStatus: "verified",
        verifiedAt: new Date().toISOString(),
      },
    }

    navigation.navigate("AdditionalInfo", { userData: verifiedUserData })
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingTop: HEADER_OFFSET, paddingBottom: SCROLL_BOTTOM_SPACING }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sheet}>
          <Text style={[commonStyles.title, styles.centerText]}>User Identity Verification</Text>
          <Text style={[commonStyles.subtitle, styles.centerText, { paddingHorizontal: 20 }]}>
            Upload a clear photo of the ID(s)
          </Text>

          {/* Primary ID */}
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

          {/* Secondary ID (optional) */}
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
      </ScrollView>

      {/* Fixed bottom bar so the button never gets clipped */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={commonStyles.button} onPress={handleNext}>
          <Text style={commonStyles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>

      <RegistrationHeader title="Verification" onBackPress={() => navigation.goBack()} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { flex: 1 },
  centerText: { textAlign: "center" },

  sheet: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: SHEET_RADIUS,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 6 },
    // shadowOpacity: 0.08,
    // shadowRadius: 12,
    elevation: 4,
  },

  pickerContainer: { marginBottom: 15, width: "100%" },
  label: { fontSize: 14, color: colors.primary, marginBottom: 5, fontWeight: "500" },
  picker: { backgroundColor: colors.fieldBg, borderRadius: 15, borderWidth: 1, borderColor: colors.primary },

  uploadSection: { width: "100%", alignItems: "flex-start", marginBottom: 20 },
  uploadButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 15,
    alignItems: "center",
    maxHeight: 40,
    justifyContent: "center",
    width: 160,
  },
  uploadButtonText: { color: colors.white, fontSize: 14, fontWeight: "600" },

  imageContainer: { width: "100%", marginBottom: 20 },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 15,
    resizeMode: "cover",
    borderWidth: 2,
    borderColor: colors.primary,
  },

  bottomBar: { position: "absolute", left: 16, right: 16, bottom: 24 },
})

export default GeneralVerificationScreen
