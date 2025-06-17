import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const API_BASE_URL = 'http://127.0.0.1:8000/api'; // IMPORTANT: Replace with your actual Laravel API URL

type RootStackParamList = {
  VolunteerExperienceScreen: undefined;
  VolunteerBackgroundCheck: undefined;
  // Add other screens here as needed
};

export default function VolunteerExperienceScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [experience, setExperience] = useState('');
  const [skills, setSkills] = useState('');
  const [certificationUri, setCertificationUri] = useState<string | null>(null);
  const [certificationFileName, setCertificationFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickCertification = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All, // Allow images and videos
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      setCertificationUri(selectedAsset.uri);
      const fileName = selectedAsset.uri.split('/').pop() || `certification_${Date.now()}.jpg`;
      setCertificationFileName(fileName);
    }
  };

  const handleNext = async () => {
    if (!experience && !skills && !certificationUri) {
      Alert.alert('Missing Information', 'Please provide at least some volunteer experience, skills, or upload a certification.');
      return;
    }

    setLoading(true);

    try {
      // Assuming you have a user profile update endpoint or a dedicated volunteer application endpoint
      // For now, we'll simulate sending data and uploading the document separately.

      // 1. Update user's volunteer experience and skills (via UserController@updateProfile or similar)
      const authToken = 'YOUR_AUTH_TOKEN'; // <<< IMPORTANT: Replace with actual token
      const userUpdatePayload = {
        volunteer_experience: experience, // Assuming you add these fields to your User model's fillable
        relevant_skills: skills,
      };

      const userUpdateResponse = await fetch(`${API_BASE_URL}/user`, {
        method: 'PUT', // Use PUT for updating an existing resource
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(userUpdatePayload),
      });

      const userUpdateData = await userUpdateResponse.json();

      if (!userUpdateResponse.ok) {
        throw new Error(userUpdateData.message || 'Failed to update volunteer profile.');
      }

      // 2. Upload certification document (via DocumentController@upload)
      if (certificationUri) {
        const formData = new FormData();
        formData.append('document_type', 'Volunteer Certification');
        formData.append('description', 'User volunteer certification');
        formData.append('document', {
          uri: certificationUri,
          name: certificationFileName || 'certification.jpg',
          type: 'image/jpeg', // Adjust type based on actual file
        } as any);

        const uploadResponse = await fetch(`${API_BASE_URL}/upload-document`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          body: formData,
        });

        const uploadData = await uploadResponse.json();
        if (!uploadResponse.ok) {
          throw new Error(uploadData.message || 'Failed to upload certification document.');
        }
      }

      Alert.alert('Success', 'Volunteer experience and skills saved!');
      navigation.navigate('VolunteerBackgroundCheck');
    } catch (error: any) {
      console.error('Error saving volunteer data:', error);
      Alert.alert('Error', error.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
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
          <Text style={styles.sectionTitle}>Volunteer Applicant Information</Text>
          <Text style={styles.infoText}>
            The information you submitted upon app registration will be used for the application. Fill up the following to proceed.
          </Text>

          <Text style={styles.subHeading}>Volunteer Experience and Skills</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Previous volunteer experience"
            value={experience}
            onChangeText={setExperience}
            multiline
            numberOfLines={4}
            placeholderTextColor="#666"
          />
          <TextInput
            style={styles.textArea}
            placeholder="Relevant skills"
            value={skills}
            onChangeText={setSkills}
            multiline
            numberOfLines={4}
            placeholderTextColor="#666"
          />

          <Text style={styles.subHeading}>Certifications</Text>
          <TouchableOpacity style={styles.uploadButton} onPress={pickCertification} disabled={loading}>
            <Text style={styles.uploadButtonText}>
              {certificationUri ? 'Change Uploaded File' : 'Upload Certifications'}
            </Text>
          </TouchableOpacity>
          {certificationUri && <Text style={styles.fileName}>File selected: {certificationFileName}</Text>}

        </ScrollView>

        <TouchableOpacity style={styles.nextButton} onPress={() => navigation.navigate('VolunteerBackgroundCheck')} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.nextButtonText}>Next</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#34495e',
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
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  subHeading: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    marginTop: 15,
  },
  textArea: {
    width: '100%',
    height: '20%',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
    textAlignVertical: 'top',
  },
  uploadButton: {
    backgroundColor: '#34495e',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  fileName: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  nextButton: {
    width: '100%',
    backgroundColor: '#34495e',
    padding: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
