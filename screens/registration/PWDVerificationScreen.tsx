"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView } from "react-native"
import * as ImagePicker from "expo-image-picker"
import { colors, commonStyles } from "../../styles/commonStyles"
import RegistrationHeader from "../../components/screen_components/RegistrationHeader"

const HEADER_HEIGHT = 140
const DIP_HEIGHT = 24
const DIP_OVERLAP = 24
const HEADER_OFFSET = HEADER_HEIGHT + (DIP_HEIGHT - DIP_OVERLAP) + 12
const SCROLL_BOTTOM_SPACING = 140

const PWDVerificationScreen = ({ navigation, route }: any) => {
  const { userData } = route.params
  const [pwdIdNumber, setPwdIdNumber] = useState("")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "success" | "failed" | "processing">("idle")
  const [verificationMessage, setVerificationMessage] = useState("")
  const [showValidationRules, setShowValidationRules] = useState(false)

  const validatePWDIdNumber = (idNumber: string): boolean => {
    const cleanedNumber = idNumber.replace(/\D/g, "")
    return cleanedNumber.length === 12 && /^\d+$/.test(cleanedNumber)
  }

  const validateImage = (uri: string): boolean => {
    if (!uri) return false
    try {
      const ext = uri.split(".").pop()?.toLowerCase() || ""
      return ["jpg", "jpeg", "png", "gif"].includes(ext)
    } catch {
      return false
    }
  }

  const verifyPWDId = async () => {
    if (!pwdIdNumber || !uploadedImage) {
      setVerificationMessage("Please fill all required fields")
      setVerificationStatus("success")
      return
    }

    try {
      setVerificationStatus("success")
      setVerificationMessage("Validating ID...")
      await new Promise((r) => setTimeout(r, 2000))

      const isValidId = validatePWDIdNumber(pwdIdNumber)
      const isValidImage = validateImage(uploadedImage)

      if (isValidId && isValidImage) {
        setVerificationStatus("success")
        setVerificationMessage("ID Verified Successfully!")
      } else {
        setVerificationStatus("failed")
        setVerificationMessage("ID could not be verified")
      }
    } catch {
      setVerificationStatus("failed")
      setVerificationMessage("Verification failed. Please try again.")
    }
  }

  const handleImageUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })
    if (!result.canceled) {
      setUploadedImage(result.assets[0].uri)
      verifyPWDId()
    }
  }

  const handleNext = () => {
    if (verificationStatus === "success") {
      const verifiedUserData = {
        ...userData,
        verificationDetails: {
          idType: pwdIdNumber ? "PWD" : undefined,
          idNumber: pwdIdNumber,
          verificationImage: uploadedImage,
          verifiedAt: new Date().toISOString(),
          status: "verified",
        },
      }
      navigation.navigate("AdditionalInfo", { userData: verifiedUserData })
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={[styles.scroll, { marginTop: HEADER_OFFSET }]}
        contentContainerStyle={{ paddingBottom: SCROLL_BOTTOM_SPACING }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sheet}>
          <Text style={commonStyles.title}>PWD Identity Verification</Text>
          <Text style={[commonStyles.subtitle, { textAlign: "center", paddingHorizontal: 20 }]}>
            Pro People with Disability documentation
          </Text>

          <View style={commonStyles.fieldContainer}>
            <Text style={commonStyles.fieldLabel}>PWD ID Number</Text>
            <TextInput
              style={commonStyles.input}
              placeholder="PWD ID Number"
              value={pwdIdNumber}
              onChangeText={setPwdIdNumber}
              keyboardType="numeric"
            />

            {showValidationRules && (
              <Text style={{ fontSize: 12, color: "#666", marginVertical: 5 }}>
                PWD IDs are typically 12-digit numbers from the Philippine Charity Act (PCA) database.
              </Text>
            )}

            <TouchableOpacity onPress={() => setShowValidationRules(!showValidationRules)}>
              <Text style={{ fontSize: 13, color: colors.primary, marginTop: 5 }}>
                {showValidationRules ? "Hide rules" : "Show ID rules"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.uploadSection}>
            <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
              <Text style={styles.uploadButtonText}>Upload PWD ID</Text>
            </TouchableOpacity>
          </View>

          {uploadedImage && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: uploadedImage }} style={styles.previewImage} />
              <Text style={{ textAlign: "center", marginTop: 10, color: "#666" }}>Image uploaded</Text>
            </View>
          )}

          {verificationStatus !== "idle" && (
            <View style={styles.verificationStatus}>
              {verificationStatus === "processing" && (
                <Text style={styles.statusTextProcessing}>Verifying your ID... Please wait</Text>
              )}
              {verificationStatus === "success" && <Text style={styles.statusTextSuccess}>✅ {verificationMessage}</Text>}
              {verificationStatus === "failed" && <Text style={styles.statusTextError}>❌ {verificationMessage}</Text>}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[commonStyles.button, verificationStatus === "success" ? {} : { opacity: 0.8 }]}
          onPress={handleNext}
          disabled={verificationStatus !== "success"}
        >
          <Text style={commonStyles.buttonText}>
            {verificationStatus === "processing" ? "Processing..." : verificationStatus === "success" ? "Verification Complete" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>

      <RegistrationHeader title="Registration" onBackPress={() => navigation.goBack()} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { flex: 1 },
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
  uploadSection: { width: "100%", alignItems: "flex-start", marginBottom: 20 },
  uploadButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 15,
    alignItems: "center",
    maxHeight: 40,
    justifyContent: "center",
    width: 140,
  },
  uploadButtonText: { color: colors.white, fontSize: 14, fontWeight: "600" },
  imageContainer: { width: "100%", marginBottom: 20 },
  previewImage: { width: "100%", height: 200, borderRadius: 15, resizeMode: "cover", borderWidth: 2, borderColor: colors.primary },
  verificationStatus: {
    marginTop: 15,
    padding: 10,
    backgroundColor: colors.fieldBg,
    borderRadius: 10,
    width: "90%",
    alignSelf: "center",
  },
  statusTextProcessing: { color: colors.primary, fontWeight: "500", textAlign: "center", padding: 10 },
  statusTextSuccess: { color: "#28a745", fontWeight: "500", textAlign: "center", padding: 10 },
  statusTextError: { color: "#dc3545", fontWeight: "500", textAlign: "center", padding: 10 },
  bottomBar: { position: "absolute", left: 16, right: 16, bottom: 24 },
})

export default PWDVerificationScreen
