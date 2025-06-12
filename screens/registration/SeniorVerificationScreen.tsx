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
    const completeUserData = {
      ...userData,
      seniorIdNumber,
      uploadedImage,
    }
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

          <TextInput
            style={commonStyles.input}
            placeholder="Senior ID Number"
            value={seniorIdNumber}
            onChangeText={setSeniorIdNumber}
          />

          <View style={styles.uploadContainer}>
            <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
              <Text style={styles.uploadButtonText}>Upload</Text>
            </TouchableOpacity>

            {uploadedImage && <Image source={{ uri: uploadedImage }} style={styles.previewImage} />}
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

export default SeniorVerificationScreen
