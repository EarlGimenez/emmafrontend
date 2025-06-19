"use client";

import React, { useState, useMemo, JSX } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert, ActivityIndicator, Modal } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'; // For tabs
import Checkbox from 'expo-checkbox'; // For checkboxes
import { Ionicons } from "@expo/vector-icons";
import { colors, commonStyles } from "@/styles/commonStyles";
import { fetcher } from "@/utils/fetcher"; // Your API fetch utility
import { API_URLS } from "@/config/api"; // Your API endpoint URLs

// --- Tab Components ---

// Step 1: Needs Selection
const NeedsRoute = ({ onUpdate, currentNeeds, otherNeeds, jumpTo }: { onUpdate: (needs: string[], other: string) => void, currentNeeds: string[], otherNeeds: string, jumpTo: (key: string) => void }) => {
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>(currentNeeds);
  const [otherNeedsText, setOtherNeedsText] = useState<string>(otherNeeds);

  const assistanceTypes = [
    "Food Assistance",
    "Medical",
    "Financial",
    "Clothes",
    "Education Resources",
    "Senior Citizen Support",
  ];

  const toggleCheckbox = (type: string) => {
    setSelectedNeeds(prev =>
      prev.includes(type) ? prev.filter(item => item !== type) : [...prev, type]
    );
  };

  const handleNext = () => {
    if (selectedNeeds.length === 0 && !otherNeedsText.trim()) {
      Alert.alert("Selection Required", "Please select at least one type of assistance or specify in 'Others'.");
      return;
    }
    onUpdate(selectedNeeds, otherNeedsText);
    jumpTo('requestDetails'); // Navigate to the next tab
  };

  return (
    <ScrollView contentContainerStyle={styles.tabContentContainer}>
      <Text style={styles.tabSectionTitle}>What do you need?</Text>
      <Text style={styles.tabSectionDescription}>
        Please select the types of assistance you need. We're here to help you through every step!
      </Text>

      <View style={styles.checkboxGroup}>
        {assistanceTypes.map((type) => (
          <View key={type} style={styles.checkboxItem}>
            <Checkbox
              value={selectedNeeds.includes(type)}
              onValueChange={() => toggleCheckbox(type)}
              color={selectedNeeds.includes(type) ? colors.primary : '#ccc'}
              style={styles.checkbox}
            />
            <Text style={styles.checkboxLabel}>{type}</Text>
          </View>
        ))}
        <View style={styles.checkboxItem}>
          <Checkbox
            value={selectedNeeds.includes("Others")}
            onValueChange={() => toggleCheckbox("Others")}
            color={selectedNeeds.includes("Others") ? colors.primary : '#ccc'}
            style={styles.checkbox}
          />
          <Text style={styles.checkboxLabel}>Others:</Text>
          <TextInput
            style={styles.otherNeedsInput}
            placeholder="Please specify"
            value={otherNeedsText}
            onChangeText={setOtherNeedsText}
            editable={selectedNeeds.includes("Others")} // Only editable if "Others" is checked
          />
        </View>
      </View>

      <TouchableOpacity style={commonStyles.button} onPress={handleNext}>
        <Text style={commonStyles.buttonText}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Step 2: Request Details
const RequestDetailsRoute = ({ onUpdate, requestDetails, jumpTo, goBackToNeeds }: { onUpdate: (details: any) => void, requestDetails: any, jumpTo: (key: string) => void, goBackToNeeds: () => void }) => {
  const [needsDetails, setNeedsDetails] = useState(requestDetails.needsDetails || "");
  const [adults, setAdults] = useState(String(requestDetails.adults || ""));
  const [babiesToddlers, setBabiesToddlers] = useState(String(requestDetails.babiesToddlers || ""));
  const [additionalDetails, setAdditionalDetails] = useState(requestDetails.additionalDetails || "");
  const [contactNumber, setContactNumber] = useState(requestDetails.contactNumber || "");

  const handleNext = () => {
    // Basic validation
    if (!needsDetails.trim()) {
      Alert.alert("Missing Details", "Please specify details for your selected needs.");
      return;
    }
    if (isNaN(parseInt(adults)) || parseInt(adults) < 0) {
        Alert.alert("Invalid Input", "Please enter a valid number for Adults.");
        return;
    }
    if (isNaN(parseInt(babiesToddlers)) || parseInt(babiesToddlers) < 0) {
        Alert.alert("Invalid Input", "Please enter a valid number for Babies/Toddlers.");
        return;
    }
    if (!contactNumber.trim()) {
        Alert.alert("Missing Contact", "Please provide a contact number.");
        return;
    }

    onUpdate({
      needsDetails,
      adults: parseInt(adults),
      babiesToddlers: parseInt(babiesToddlers),
      additionalDetails,
      contactNumber,
    });
    jumpTo('submit'); // Navigate to the next tab
  };

  return (
    <ScrollView contentContainerStyle={styles.tabContentContainer}>
      <Text style={styles.tabSectionTitle}>Request Details</Text>

    <View style={{ marginBottom: 20 }}>
      <Text style={{ fontWeight: "bold", color: colors.primary, marginBottom: 8, fontSize: 14 }}>
        Selected Needs: (Please Specify details)
      </Text>
      <TextInput
        style={{
        backgroundColor: colors.fieldBg,
        borderColor: colors.primary,
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        fontSize: 15,
        minHeight: 80,
        textAlignVertical: "top",
        }}
        placeholder="e.g., Medical: Pain relief medication, first aid supplies. Food: Canned goods, rice."
        multiline
        numberOfLines={4}
        value={needsDetails}
        onChangeText={setNeedsDetails}
      />
    </View>

      <View style={commonStyles.fieldContainer}>
        <Text style={commonStyles.fieldLabel}>Number of Family Household:</Text>
        <View style={styles.inlineInputs}>
          <View style={styles.inlineInputWrapper}>
            <Text style={styles.inlineInputLabel}>Adults:</Text>
            <TextInput
              style={[commonStyles.input, styles.smallInput]}
              placeholder="e.g., 2"
              keyboardType="numeric"
              value={adults}
              onChangeText={setAdults}
            />
          </View>
          <View style={styles.inlineInputWrapper}>
            <Text style={styles.inlineInputLabel}>Babies/Toddlers:</Text>
            <TextInput
              style={[commonStyles.input, styles.smallInput]}
              placeholder="e.g., 1"
              keyboardType="numeric"
              value={babiesToddlers}
              onChangeText={setBabiesToddlers}
            />
          </View>
        </View>
      </View>

    <View style={{ marginBottom: 20 }}>
      <Text style={{ fontWeight: "bold", color: colors.primary, marginBottom: 8, fontSize: 16 }}>
        Additional details (optional):
      </Text>
      <TextInput
        style={{
        backgroundColor: colors.fieldBg,
        borderColor: colors.primary,
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        fontSize: 15,
        minHeight: 60,
        textAlignVertical: "top",
        }}
        placeholder="e.g., Child has allergies to certain medications."
        multiline
        numberOfLines={3}
        value={additionalDetails}
        onChangeText={setAdditionalDetails}
      />
    </View>

      <View style={commonStyles.fieldContainer}>
        <Text style={commonStyles.fieldLabel}>Contact number:</Text>
        <TextInput
          style={commonStyles.input}
          placeholder="+639XXXXXXXXX"
          keyboardType="phone-pad"
          value={contactNumber}
          onChangeText={setContactNumber}
        />
      </View>

      <View style={styles.bottomButtons}>
        <TouchableOpacity style={[commonStyles.button, styles.backButton]} onPress={goBackToNeeds}>
          <Text style={commonStyles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[commonStyles.button, styles.nextButton]} onPress={handleNext}>
          <Text style={commonStyles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Step 3: Submit (Overview & Final Submission)
const SubmitRoute = ({ formData, onSubmit, goBackToDetails, navigation }: { formData: any, onSubmit: () => void, goBackToDetails: () => void, navigation: any }) => {
  const [submitting, setSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Structure the data for API
      const requestPayload = {
        needs: formData.selectedNeeds.join(', ') + (formData.otherNeeds ? `, Others: ${formData.otherNeeds}` : ''),
        needs_details: formData.needsDetails,
        adults: formData.adults,
        babies_toddlers: formData.babiesToddlers,
        additional_details: formData.additionalDetails,
        contact_number: formData.contactNumber,
        request_date: new Date().toISOString().split('T')[0], // Current date
        status: 'pending', // Initial status
      };

      // Simulate API call
      // const response = await fetcher(API_URLS.requests.submit, {
      //   method: 'POST',
      //   body: JSON.stringify(requestPayload),
      // });

      // if (response.success) {
      //   setModalVisible(true); // Show success modal
      // } else {
      //   Alert.alert("Submission Failed", response.message || "Failed to submit your request.");
      // }

      // Simulate success
      await new Promise(resolve => setTimeout(resolve, 1500));
      setModalVisible(true); // Show success modal
      console.log("Request submitted successfully (simulated):", requestPayload);

    } catch (error: any) {
      console.error("Submission error:", error.message);
      Alert.alert("Error", "An error occurred during submission. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleModalOk = () => {
    setModalVisible(false);
    navigation.popToTop(); // Clear stack
    navigation.navigate('Home'); // Redirect to Home screen
  };

  // Memoize the needs overview for display
  const needsOverview = useMemo(() => {
    let overview = [];
    if (formData.selectedNeeds.includes("Medical")) overview.push("Medical Assistance");
    if (formData.selectedNeeds.includes("Clothes")) overview.push("Clothing Assistance");
    if (formData.selectedNeeds.includes("Food Assistance")) overview.push("Food Assistance");
    // Add more specific descriptions based on selected needs if possible
    // For now, mapping directly based on assumed logic:
    if (formData.selectedNeeds.includes("Medical") && formData.needsDetails) {
        overview = overview.map(item => item === "Medical Assistance" ? `${item}: ${formData.needsDetails.split(/[,.;]/).filter((d: string) => d.toLowerCase().includes('medical') || d.toLowerCase().includes('pain') || d.toLowerCase().includes('first aid')).join(', ') || 'Please specify'}` : item);
    }
    if (formData.selectedNeeds.includes("Clothes") && formData.needsDetails) {
        overview = overview.map(item => item === "Clothing Assistance" ? `${item}: ${formData.needsDetails.split(/[,.;]/).filter((d: string) => d.toLowerCase().includes('clothes') || d.toLowerCase().includes('clothing') || d.toLowerCase().includes('underwear') || d.toLowerCase().includes('shirts')).join(', ') || 'Please specify'}` : item);
    }
    if (formData.selectedNeeds.includes("Food Assistance") && formData.needsDetails) {
        overview = overview.map(item => item === "Food Assistance" ? `${item}: ${formData.needsDetails.split(/[,.;]/).filter((d: string) => d.toLowerCase().includes('food') || d.toLowerCase().includes('canned goods') || d.toLowerCase().includes('rice') || d.toLowerCase().includes('fruits') || d.toLowerCase().includes('vegetables')).join(', ') || 'Please specify'}` : item);
    }
    // Fallback for general needs not specifically detailed or 'Others'
    if (formData.otherNeeds) {
      overview.push(`Others: ${formData.otherNeeds}`);
    }
    if (overview.length === 0 && formData.needsDetails) { // If nothing specific was picked but details exist
        overview.push(`General Needs: ${formData.needsDetails}`);
    } else if (overview.length === 0) { // If absolutely nothing was put
      overview.push("No specific needs detailed.");
    }
    return overview;
  }, [formData]);


  return (
    <ScrollView contentContainerStyle={styles.tabContentContainer}>
      <Text style={styles.tabSectionTitle}>Overview</Text>

      <View style={styles.overviewCard}>
        <Text style={styles.overviewHeader}>Needs:</Text>
        {needsOverview.map((item, index) => (
          <Text key={index} style={styles.overviewText}>{item}</Text>
        ))}

        <Text style={styles.overviewHeader}>Family Household Details:</Text>
        <Text style={styles.overviewText}>Adults: {formData.adults}</Text>
        <Text style={styles.overviewText}>Babies/Toddlers: {formData.babiesToddlers}</Text>

        {formData.additionalDetails ? (
          <>
            <Text style={styles.overviewHeader}>Additional Details:</Text>
            <Text style={styles.overviewText}>{formData.additionalDetails}</Text>
          </>
        ) : null}

        <Text style={styles.overviewHeader}>Contact Number:</Text>
        <Text style={styles.overviewText}>{formData.contactNumber}</Text>
      </View>

      <View style={styles.bottomButtons}>
        <TouchableOpacity style={[commonStyles.button, styles.backButton]} onPress={goBackToDetails}>
          <Text style={commonStyles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={commonStyles.button}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={commonStyles.buttonText}>Submit Request</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Submission Success Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Ionicons name="checkmark-circle" size={60} color="green" />
            <Text style={styles.modalTitle}>Request Submitted!</Text>
            <Text style={styles.modalText}>
              Please allow us time to review your information.
            </Text>
            <Text style={styles.modalText}>
              You can expect to hear back from us within the next hours regarding the next steps. If you have any urgent questions, feel free to contact us at <Text style={styles.modalContact}>+639257003822</Text>.
            </Text>
            <Text style={styles.modalThankYou}>Thank you for your patience!</Text>
            <Text style={styles.modalStaySafe}>Stay Safe.</Text>
            <TouchableOpacity
              style={[commonStyles.button, styles.modalButton]}
              onPress={handleModalOk}
            >
              <Text style={commonStyles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

// --- Main RequestProcessScreen Component ---

const RequestProcessScreen = () => {
  const navigation = useNavigation<any>();
  const [index, setIndex] = useState(0); // Current tab index
  const [routes] = useState([
    { key: 'needs', title: 'Needs' },
    { key: 'requestDetails', title: 'Details' },
    { key: 'submit', title: 'Submit' },
  ]);

  // State to hold all form data across steps
  type FormData = {
    selectedNeeds: string[];
    otherNeeds: string;
    needsDetails: string;
    adults: number;
    babiesToddlers: number;
    additionalDetails: string;
    contactNumber: string;
  };

  const [formData, setFormData] = useState<FormData>({
    selectedNeeds: [],
    otherNeeds: "",
    needsDetails: "",
    adults: 0,
    babiesToddlers: 0,
    additionalDetails: "",
    contactNumber: "",
  });

  // Update functions for each step
  const updateNeeds = (needs: string[], other: string) => {
    setFormData(prev => ({ ...prev, selectedNeeds: needs, otherNeeds: other }));
  };

  const updateRequestDetails = (details: any) => {
    setFormData(prev => ({ ...prev, ...details }));
  };

  // Functions to navigate between tabs
  const jumpTo = (key: string) => {
    const newIndex = routes.findIndex(route => route.key === key);
    if (newIndex !== -1) {
      setIndex(newIndex);
    }
  };

  const goBackToNeeds = () => jumpTo('needs');
  const goBackToDetails = () => jumpTo('requestDetails');


  const renderScene: { [key: string]: () => JSX.Element } = {
    needs: () => <NeedsRoute onUpdate={updateNeeds} currentNeeds={formData.selectedNeeds} otherNeeds={formData.otherNeeds} jumpTo={jumpTo} />,
    requestDetails: () => <RequestDetailsRoute onUpdate={updateRequestDetails} requestDetails={formData} jumpTo={jumpTo} goBackToNeeds={goBackToNeeds} />,
    submit: () => <SubmitRoute formData={formData} onSubmit={() => {}} goBackToDetails={goBackToDetails} navigation={navigation} />,
  };

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={styles.tabBarIndicator}
      style={styles.tabBar}
      labelStyle={styles.tabBarLabel}
      activeColor={colors.primary}
      inactiveColor="#666"
      // Disable direct tab presses to enforce linear flow (optional, for stricter form)
      // pressEnabled={false}
    />
  );

  return (
      <View style={[commonStyles.container, {backgroundColor: colors.primary}]}>
        <TouchableOpacity style={commonStyles.backButton} onPress={() => navigation.goBack()}>
          <Text style={commonStyles.backButtonText}>← Request Assistance</Text>
        </TouchableOpacity>

        <View style={commonStyles.whiteContainer}>
          <TabView
            navigationState={{ index, routes }}
            renderScene={({ route }) => renderScene[route.key]()}
            onIndexChange={setIndex}
            initialLayout={{ width: 0 }}
            renderTabBar={renderTabBar}
            swipeEnabled={false} // Disable swiping between tabs for linear form flow
          />
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  tabContentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexGrow: 1,
  },
  tabSectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 10,
    textAlign: "center",
  },
  tabSectionDescription: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  checkboxGroup: {
    marginBottom: 20,
  },
  checkboxItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
    flex: 1, // Allows label to take up space and align with input
  },
  otherNeedsInput: {
    flex: 1,
    backgroundColor: colors.fieldBg,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 15,
    marginLeft: 10, // Space from checkbox label
  },
  inlineInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  inlineInputWrapper: {
    flex: 1,
    marginRight: 10,
  },
  inlineInputLabel: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 5,
    fontWeight: '500',
  },
  smallInput: {
    width: '100%', // Take full width of its wrapper
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  backButton: {
    backgroundColor: '#6c757d', // Grey for back button
    flex: 1,
    marginRight: 10,
  },
  nextButton: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: colors.white,
    elevation: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabBarIndicator: {
    backgroundColor: colors.primary,
    height: 3,
    borderRadius: 2,
  },
  tabBarLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  // Modal Styles
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.5)', // Dim background
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    color: colors.primary,
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
  },
  modalContact: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  modalThankYou: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 10,
    marginBottom: 5,
  },
  modalStaySafe: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745', // Green color
    marginBottom: 20,
  },
  modalButton: {
    width: '80%',
    marginTop: 10,
  },
  // Overview section styles
  overviewCard: {
    backgroundColor: colors.fieldBg,
    borderRadius: 15,
    padding: 20,
    width: '100%',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 20,
  },
  overviewHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 15,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  overviewText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 4,
    lineHeight: 20,
  },
});

export default RequestProcessScreen;
