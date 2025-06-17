import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox'; // Import Checkbox component

// Install expo-checkbox if you haven't: npx expo install expo-checkbox

export default function DataPrivacyConsentScreen() {
  const navigation = useNavigation<any>();
  const [isChecked, setChecked] = useState(false);

  const handleConfirm = () => {
    if (!isChecked) {
      Alert.alert('Consent Required', 'Please confirm that you have read and understood the Data Privacy Notice.');
      return;
    }
    // Logic to confirm consent (e.g., update user's consent status in backend)
    // For now, navigate to the next step in the volunteer application
    navigation.navigate('VolunteerExperience');
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Volunteer Application</Text>
      </View>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Text style={styles.title}>Volunteer Application:</Text>
          <Text style={styles.subtitle}>Data Privacy and Consent</Text>

          <Text style={styles.paragraph}>
            At E.M.M.A. we are committed to protecting your privacy and personal information. This
            Data Privacy Notice explains how we collect, use, and protect your data as part of the
            volunteer application process. By applying to be a volunteer, you agree to the terms
            outlined in this notice.
          </Text>

          <Text style={styles.sectionTitle}>What We Collect:</Text>
          <Text style={styles.paragraph}>
            We collect the following information to process your volunteer application:
          </Text>
          <Text style={styles.listItem}>• Full name, date of birth, gender, contact number, email address, and home address.</Text>
          <Text style={styles.listItem}>• Government-issued ID</Text>
          <Text style={styles.listItem}>• Volunteer Experience and Skills</Text>
          <Text style={styles.listItem}>• Background Check Information: Police Clearance or NBI Clearance to ensure your suitability for volunteer work.</Text>
          <Text style={styles.listItem}>• Emergency Contact Information</Text>

          <Text style={styles.sectionTitle}>Why We Collect:</Text>
          <Text style={styles.paragraph}>
            Your information is used for the following purposes:
          </Text>
          <Text style={styles.listItem}>• To verify your identity and eligibility as a volunteer.</Text>
          <Text style={styles.listItem}>• To assess your skills and experience for disaster response work.</Text>
          <Text style={styles.listItem}>• To conduct a background check to ensure the safety and integrity of our volunteer program.</Text>
          <Text style={styles.listItem}>• To share your information with the Department of Social Welfare and Development (DSWD) for final approval.</Text>
          <Text style={styles.listItem}>• To contact you in case of emergencies or for volunteer-related updates.</Text>

          <Text style={styles.sectionTitle}>How We Protect Your Data:</Text>
          <Text style={styles.listItem}>• We implement strict security measures to safeguard your information from unauthorized access, disclosure, or misuse.</Text>
          <Text style={styles.listItem}>• Your data is stored securely and only accessible to authorized personnel.</Text>
          <Text style={styles.listItem}>• We will not share your information with third parties without your consent, except as required by law or for the purposes outlined in this notice.</Text>

          <Text style={styles.sectionTitle}>Your Rights:</Text>
          <Text style={styles.paragraph}>
            Under the Data Privacy Act of 2012, you have the right to:
          </Text>
          <Text style={styles.listItem}>• Access your personal information.</Text>
          <Text style={styles.listItem}>• Correct any inaccurate or incomplete data.</Text>
          <Text style={styles.listItem}>• Request the deletion of your data (subject to legal and operational requirements).</Text>
          <Text style={styles.listItem}>• You may withdraw your consent at any time by contacting us at emma@gmail.com</Text>

          <View style={styles.consentSection}>
            <Text style={styles.consentHeading}>Consent:</Text>
            <Text style={styles.consentParagraph}>
              By proceeding with your application, you consent to the collection, use, and sharing of your information as described in this notice.
            </Text>
            <View style={styles.checkboxContainer}>
              <Checkbox
                style={styles.checkbox}
                value={isChecked}
                onValueChange={setChecked}
                color={isChecked ? '#4630EB' : undefined}
              />
              <Text style={styles.checkboxLabel}>
                I have read and understood the Data Privacy Notice and agree to the collection, use, and sharing of my information as described.
              </Text>
            </View>
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#34495e', // Dark header background
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#34495e',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    paddingTop: 30,
  },
  scrollViewContent: {
    paddingBottom: 20, // Add some padding at the bottom of the scroll view
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  paragraph: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginBottom: 10, // Reduced margin for continuous text
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 10,
  },
  listItem: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginBottom: 5,
    paddingLeft: 10,
  },
  consentSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  consentHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  consentParagraph: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginBottom: 15,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Align items to the start for multi-line text
    marginBottom: 20,
  },
  checkbox: {
    marginRight: 10,
    marginTop: 3, // Adjust vertical alignment with text
  },
  checkboxLabel: {
    flex: 1, // Allow text to wrap
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  confirmButton: {
    width: '100%',
    backgroundColor: '#34495e', // Blue button
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
