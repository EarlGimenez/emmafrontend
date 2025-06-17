"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import * as ImagePicker from "expo-image-picker"
import { colors, commonStyles } from "../../styles/commonStyles"

const SeniorVerificationScreen = ({ navigation, route }: any) => {
  const { userData } = route.params
  const [seniorIdNumber, setSeniorIdNumber] = useState("")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "success" | "failed" | "processing">("idle")
  const [verificationMessage, setVerificationMessage] = useState("")
  const [showValidationRules, setShowValidationRules] = useState(false)

  const validateSeniorIdNumber = (idNumber: string): boolean => {
    // Common Senior Citizen ID formats:
    // - SSS Number (11 digits)
    // - TIN Number (12 digits)
    const cleanedNumber = idNumber.replace(/\D/g, '')
    
    // Validate SSS-like format (11 digits) or TIN-like (12 digits)
    return (cleanedNumber.length === 11 && /^\d+$/.test(cleanedNumber)) || 
          (cleanedNumber.length === 12 && /^\d+$/.test(cleanedNumber))
  }

  const validateImage = (uri: string): boolean => {
    // Basic image validation
    if (!uri) return false
    
    try {
      // Check URI format is likely a valid image
      const fileExtension = uri.split('.').pop()?.toLowerCase() || ''
      const validExtensions = ['jpg', 'jpeg', 'png', 'gif']
      return validExtensions.includes(fileExtension)
    } catch (error) {
      return false
    }
  }

  const verifySeniorId = async () => {
    if (!seniorIdNumber || !uploadedImage) {
      setVerificationMessage("Please fill all required fields")
      setVerificationStatus("failed")
      return
    }

    try {
      setVerificationStatus("processing")
      setVerificationMessage("Validating ID...")

      // Simulate network request to verification service
      await new Promise(resolve => setTimeout(resolve, 2000))

      const isValidId = validateSeniorIdNumber(seniorIdNumber)
      const isValidImage = validateImage(uploadedImage)

      if (isValidId && isValidImage) {
        setVerificationStatus("success")
        setVerificationMessage("ID Verified Successfully!")
        
        // In a real app, this would be an API call
        // const response = await fetch('/api/verify-senior-id', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     idNumber: seniorIdNumber,
        //     idType: "Senior Citizen",
        //     image: uploadedImage
        //   })
        // })
        
        // Handle successful response and navigation
      } else {
        setVerificationStatus("failed")
        setVerificationMessage("ID could not be verified")
      }
    } catch (error) {
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
      
      // Auto-verify after image upload
      verifySeniorId()
    }
  }

  const handleNext = () => {
  if (verificationStatus === "success") {
    const verifiedUserData = {
      ...userData,
      verificationDetails: {
        idType: seniorIdNumber ? 'Senior Citizen' : undefined,
        idNumber: seniorIdNumber,
        verificationImage: uploadedImage,
        verifiedAt: new Date().toISOString(),
        status: 'verified'
      }
    };

    navigation.navigate("AdditionalInfo", { userData: verifiedUserData });
  }
};

  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={commonStyles.mainThemeBackground}>
      <View style={commonStyles.container}>
        <TouchableOpacity style={commonStyles.backButton} onPress={() => navigation.goBack()}>
          <Text style={commonStyles.backButtonText}>← Verification</Text>
        </TouchableOpacity>

        <View style={commonStyles.whiteContainer}>
          <Text style={commonStyles.title}>Senior Citizen Identity Verification</Text>
          <Text style={[commonStyles.subtitle, { textAlign: "center", paddingHorizontal: 20 }]}>
            For citizens 65 years and above
          </Text>

          <View style={commonStyles.centeredContent}>
            <View style={commonStyles.fieldContainer}>
              <Text style={commonStyles.fieldLabel}>Senior Citizen ID Number</Text>
              <TextInput
                style={commonStyles.input}
                placeholder="Senior ID Number"
                value={seniorIdNumber}
                onChangeText={setSeniorIdNumber}
                keyboardType="numeric"
              />
              
              {showValidationRules && (
                <Text style={{ fontSize: 12, color: '#666', marginVertical: 5 }}>
                  Senior Citizen IDs are typically 11 or 12-digit numbers from the Social Security System (SSS) or Bureau of Internal Revenue (BIR).
                </Text>
              )}
              
              <TouchableOpacity onPress={() => setShowValidationRules(!showValidationRules)}>
                <Text style={{ fontSize: 13, color: colors.primary, marginTop: 5 }}>
                  {showValidationRules ? 'Hide rules' : 'Show ID rules'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.uploadSection}>
              <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
                <Text style={styles.uploadButtonText}>Upload Senior ID</Text>
              </TouchableOpacity>
            </View>

            {uploadedImage && (
              <View style={styles.imageContainer}>
                <Image source={{ uri: uploadedImage }} style={styles.previewImage} />
                <Text style={{ textAlign: 'center', marginTop: 10, color: '#666' }}>Image uploaded</Text>
              </View>
            )}

            {verificationStatus !== "idle" && (
              <View style={styles.verificationStatus}>
                {verificationStatus === "processing" && (
                  <Text style={styles.statusTextProcessing}>Verifying your ID... Please wait</Text>
                )}
                {verificationStatus === "success" && (
                  <Text style={styles.statusTextSuccess}>✅ {verificationMessage}</Text>
                )}
                {verificationStatus === "failed" && (
                  <Text style={styles.statusTextError}>❌ {verificationMessage}</Text>
                )}
              </View>
            )}
          </View>

          <View style={commonStyles.bottomButton}>
            <TouchableOpacity 
              style={[commonStyles.button, verificationStatus === "success" ? { } : { opacity: 0.8 }]} 
              onPress={handleNext}
              disabled={verificationStatus !== "success"}
            >
              <Text style={commonStyles.buttonText}>
                {verificationStatus === "processing" ? "Processing..." : 
                verificationStatus === "success" ? "Verification Complete" : "Next"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
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
  verificationStatus: {
    marginTop: 15,
    padding: 10,
    backgroundColor: colors.fieldBg,
    borderRadius: 10,
    width: "90%",
    alignSelf: "center",
  },
  statusTextProcessing: {
    color: colors.primary,
    fontWeight: "500",
    textAlign: "center",
    padding: 10,
  },
  statusTextSuccess: {
    color: "#28a745",
    fontWeight: "500",
    textAlign: "center",
    padding: 10,
  },
  statusTextError: {
    color: "#dc3545",
    fontWeight: "500",
    textAlign: "center",
    padding: 10,
  },
})

export default SeniorVerificationScreen
