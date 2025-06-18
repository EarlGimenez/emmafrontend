"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { colors } from "../../styles/commonStyles"

const CreateFamilyScreen = ({ navigation }: any) => {
  const [familyName, setFamilyName] = useState("")
  const [description, setDescription] = useState("")

  const handleCreateFamily = () => {
    if (!familyName.trim()) {
      Alert.alert("Error", "Please enter a family name")
      return
    }

    const familyData = {
      familyName: familyName.trim(),
      description: description.trim(),
      createdAt: new Date().toISOString(),
      familyCode: Math.random().toString(36).substring(2, 8).toUpperCase(), // Generate random code
    }

    console.log("Creating family:", familyData)

    Alert.alert("Family Created", `Family "${familyName}" has been created successfully!`, [
      {
        text: "OK",
        onPress: () => navigation.navigate("MyFamily"),
      },
    ])
  }

  const handleCancel = () => {
    navigation.goBack()
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
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Create Family</Text>

          <View style={styles.noticeContainer}>
            <Text style={styles.noticeTitle}>📋 Notice</Text>
            <Text style={styles.noticeText}>
              Creating a family will generate a unique family code and QR code that other family members can use to join
              your family group. You will become the family administrator.
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Family Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter family name (e.g., Smith Family)"
                value={familyName}
                onChangeText={setFamilyName}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Description (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add a message or description for your family..."
                value={description}
                onChangeText={setDescription}
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.noteContainer}>
              <Text style={styles.noteTitle}>💡 Note</Text>
              <Text style={styles.noteText}>
                • Family members can join using the family code or QR code • You can manage family members and settings
                after creation • The family code can be shared securely with trusted family members
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomSection}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.createButton} onPress={handleCreateFamily}>
              <Text style={styles.createButtonText}>Create Family</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.primary,
    textAlign: "center",
    marginBottom: 30,
  },
  noticeContainer: {
    backgroundColor: "#e3f2fd",
    borderRadius: 15,
    padding: 15,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#bbdefb",
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 8,
  },
  noticeText: {
    fontSize: 14,
    color: "#1565c0",
    lineHeight: 20,
  },
  formContainer: {
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    color: colors.primary,
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    backgroundColor: colors.fieldBg,
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    color: colors.primary,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  textArea: {
    height: 100,
    paddingTop: 15,
  },
  noteContainer: {
    backgroundColor: "#fff3e0",
    borderRadius: 15,
    padding: 15,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ffcc02",
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#f57c00",
    marginBottom: 8,
  },
  noteText: {
    fontSize: 14,
    color: "#ef6c00",
    lineHeight: 20,
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 15,
  },
  cancelButton: {
    backgroundColor: "#6c757d",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    flex: 1,
  },
  cancelButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  createButton: {
    backgroundColor: colors.primary,
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
})

export default CreateFamilyScreen
