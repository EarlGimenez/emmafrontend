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
});

export default DisasterReliefChatScreen;
