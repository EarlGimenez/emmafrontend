"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Picker } from "@react-native-picker/picker"
import * as ImagePicker from "expo-image-picker"
import { colors, commonStyles } from "../../styles/commonStyles"

const ParentVerificationScreen = ({ navigation, route }: any) => {
  const { parentData } = route.params
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
    const completeParentData = {
      ...parentData,
      primaryIdType,
      uploadedImage,
    }
    navigation.navigate("OTP", { parentData: completeParentData })
  }

  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={commonStyles.mainThemeBackground}>
      <View style={commonStyles.container}>
        <TouchableOpacity style={commonStyles.backButton} onPress={() => navigation.goBack()}>
          <Text style={commonStyles.backButtonText}>← Registration</Text>
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

export default ParentVerificationScreen
