import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import LocalChatbot from '../components/LocalChatbot';

/**
 * Demo screen showing how to integrate the LocalChatbot component
 * This is an example of how to use the offline disaster relief chatbot
 * in your React Native application.
 */
const DisasterReliefChatScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Optional header - you can customize this */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Emergency Assistant</Text>
        <Text style={styles.subHeaderText}>Offline Disaster Relief Support</Text>
      </View>
      
      {/* The main chatbot component */}
      <LocalChatbot />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subHeaderText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
});

export default DisasterReliefChatScreen;
