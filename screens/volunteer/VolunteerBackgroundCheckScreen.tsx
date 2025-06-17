import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator, Platform, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const API_BASE_URL = 'http://127.0.0.1:8000/api'; // IMPORTANT: Replace with your actual Laravel API URL

export default function VolunteerBackgroundCheckScreen() {
  const navigation = useNavigation<any>();

  const [clearanceUri, setClearanceUri] = useState<string | null>(null);
  const [clearanceFileName, setClearanceFileName] = useState<string | null>(null);
  const [dswdFormUri, setDswdFormUri] = useState<string | null>(null);
  const [dswdFormFileName, setDswdFormFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickDocument = async (setUri: React.Dispatch<React.SetStateAction<string | null>>, setFileName: React.Dispatch<React.SetStateAction<string | null>>, documentType: string) => {
    if (Platform.OS === 'ios') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please grant access to your photo library to upload documents.');
        return;
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All, // Allow images and videos, or specifically Images for ID
      quality: 1,
      allowsEditing: true, // You might want to remove this for large documents
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      setUri(selectedAsset.uri);
      const fileName = selectedAsset.uri.split('/').pop() || `${documentType}_${Date.now()}.${selectedAsset.uri.split('.').pop()}`;
      setFileName(fileName);
    }
  };

  const uploadDocument = async (uri: string, fileName: string, documentType: string, description: string) => {
    const formData = new FormData();
    formData.append('document_type', documentType);
    formData.append('description', description);
    formData.append('document', {
      uri: uri,
      name: fileName,
      type: 'application/octet-stream', // Generic type, will be inferred by Laravel
    } as any);

    const authToken = 'YOUR_AUTH_TOKEN'; // <<< IMPORTANT: Replace with actual token

    const response = await fetch(`${API_BASE_URL}/upload-document`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Failed to upload ${documentType}.`);
    }
    return data;
  };

  const handleConfirm = async () => {
    if (!clearanceUri || !dswdFormUri) {
      Alert.alert('Missing Documents', 'Please upload both Police/NBI Clearance and DSWD Volunteer Application Form.');
      return;
    }

    setLoading(true);

    try {
      await uploadDocument(clearanceUri, clearanceFileName!, 'Police/NBI Clearance', 'User Police/NBI Clearance');
      await uploadDocument(dswdFormUri, dswdFormFileName!, 'DSWD Application Form', 'User DSWD Volunteer Application Form');

      Alert.alert('Success', 'All background check documents uploaded successfully!');
      navigation.navigate('VolunteerApplicationSubmitted'); // Navigate to the final confirmation screen
    } catch (error: any) {
      console.error('Error uploading documents:', error);
      Alert.alert('Upload Failed', error.message || 'An unexpected error occurred during document upload.');
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

          <Text style={styles.subHeading}>Background Check Information</Text>
          <Text style={styles.paragraph}>
            Upload a clear photo or scan of Police Clearance or NBI Clearance.
          </Text>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => pickDocument(setClearanceUri, setClearanceFileName, 'Police Clearance')}
            disabled={loading}
          >
            <Text style={styles.uploadButtonText}>
              {clearanceUri ? 'Change Uploaded Clearance' : 'Upload'}
            </Text>
          </TouchableOpacity>
          {clearanceUri && <Text style={styles.fileName}>File selected: {clearanceFileName}</Text>}

          <Text style={styles.subHeading}>DSWD-Specific Requirements</Text>
          <Text style={styles.paragraph}>
            Meet DSWD's criteria for volunteer approval.
          </Text>
          <TouchableOpacity onPress={() => Linking.openURL('https://www.dswd.gov.ph/')} style={styles.downloadLink}>
            <Text style={styles.downloadLinkText}>Download the DSWD Volunteer Application Form [here]</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => pickDocument(setDswdFormUri, setDswdFormFileName, 'DSWD Form')}
            disabled={loading}
          >
            <Text style={styles.uploadButtonText}>
              {dswdFormUri ? 'Change Uploaded DSWD Form' : 'Upload'}
            </Text>
          </TouchableOpacity>
          {dswdFormUri && <Text style={styles.fileName}>File selected: {dswdFormFileName}</Text>}

        </ScrollView>

        <TouchableOpacity style={styles.confirmButton} onPress={() => navigation.navigate('VolunteerApplicationSubmitted')} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.confirmButtonText}>Confirm</Text>
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
  paragraph: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginBottom: 10,
  },
  downloadLink: {
    marginBottom: 10,
  },
  downloadLinkText: {
    color: '#007bff',
    fontSize: 15,
    textDecorationLine: 'underline',
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
  confirmButton: {
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
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
