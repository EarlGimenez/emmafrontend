"use client";

import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator, Alert, Modal } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { colors, commonStyles } from "@/styles/commonStyles";
import { fetcher } from "@/utils/fetcher";
import { API_URLS } from "@/config/api"; // Assuming API_URLS for requests

// Dummy Data for demonstration. This will come from your Laravel API.
const DUMMY_REQUESTS = [
  {
    id: "req1",
    requestType: "Relief Goods",
    dateOfRequest: "2025-06-15",
    status: "Approved",
    description: "Request for canned goods, 1 sack of rice, and 5 liters of water.",
    messageFromLGU: "Your relief goods package is ready for pickup at Cebu City Sports Center. Please present a valid ID.",
    contactPhoneNumber: "+639251112233",
    contactEmail: "lgu.cebucity@example.com",
    needs: ["Food Assistance", "Water"],
    household: { adults: 3, babiesToddlers: 1 },
    additionalDetails: "Need infant formula for baby.",
  },
  {
    id: "req2",
    requestType: "Medical Assistance",
    dateOfRequest: "2025-06-14",
    status: "Pending",
    description: "Seeking assistance for fever medication and cough syrup for elderly.",
    messageFromLGU: "Your request is currently being reviewed. Please wait for further updates.",
    contactPhoneNumber: "+639257003822",
    contactEmail: "assistance@emma.ph",
    needs: ["Medical"],
    household: { adults: 2, babiesToddlers: 0 },
    additionalDetails: "Elderly person, 70 years old, with pre-existing heart condition.",
  },
  {
    id: "req3",
    requestType: "Financial Aid",
    dateOfRequest: "2025-06-12",
    status: "Denied",
    description: "Request for financial assistance for temporary shelter.",
    messageFromLGU: "Your request for financial aid has been denied due to insufficient documentation. Please visit our office for more information.",
    contactPhoneNumber: "+639257003822",
    contactEmail: "assistance@emma.ph",
    needs: ["Financial"],
    household: { adults: 4, babiesToddlers: 2 },
    additionalDetails: "House was completely destroyed.",
  },
  {
    id: "req4",
    requestType: "Clothes",
    dateOfRequest: "2025-06-10",
    status: "Approved",
    description: "Need clothes for 2 adults and 1 toddler.",
    messageFromLGU: "Clothes package is ready. Pick up at Brgy. Hall.",
    contactPhoneNumber: "+639251112233",
    contactEmail: "lgu.cebucity@example.com",
    needs: ["Clothes"],
    household: { adults: 2, babiesToddlers: 1 },
    additionalDetails: "Sizes: M for adults, 2T for toddler.",
  },
];

const MyRequestsScreen = () => {
  const navigation = useNavigation<any>();
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  useEffect(() => {
    const fetchMyRequests = async () => {
      setLoading(true);
      try {
        // Fetch user's requests from your API
        // Example: const response = await fetcher(API_URLS.requests.myRequests);
        // if (response.success && response.data) {
        //   setMyRequests(response.data);
        // } else {
        //   Alert.alert("Error", response.message || "Failed to load your requests.");
        //   setMyRequests([]);
        // }

        // For now, use dummy data
        setTimeout(() => {
          setMyRequests(DUMMY_REQUESTS);
          setLoading(false);
        }, 1000);

      } catch (error: any) {
        console.error("Error fetching my requests:", error.message);
        Alert.alert("Error", "Could not load your requests. Please check your connection.");
        setMyRequests([]);
        setLoading(false);
      }
    };

    const unsubscribe = navigation.addListener('focus', () => {
      fetchMyRequests(); // Refresh requests every time the screen is focused
    });

    fetchMyRequests(); // Initial fetch
    return unsubscribe;
  }, [navigation]);

  const handleViewDetails = (request: any) => {
    setSelectedRequest(request);
    setModalVisible(true);
  };

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return styles.statusApproved;
      case 'pending': return styles.statusPending;
      case 'denied': return styles.statusDenied;
      default: return {};
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading Requests...</Text>
      </View>
    );
  }

  return (
    <View style={[commonStyles.container, {backgroundColor: colors.primary}]}>
      <View style={commonStyles.container}>
        <TouchableOpacity style={commonStyles.backButton} onPress={() => navigation.goBack()}>
          <Text style={[commonStyles.backButtonText, {fontSize: 22}]}>← My Requests</Text>
        </TouchableOpacity>

        <View style={commonStyles.whiteContainer}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>

            {myRequests.length === 0 ? (
              <Text style={styles.noRequestsText}>You have no assistance requests yet.</Text>
            ) : (
              myRequests.map((request) => (
                <View key={request.id} style={styles.requestCard}>
                  <Text style={styles.requestType}>{request.requestType}</Text>
                  <Text style={styles.requestDate}>Date of Request: {request.dateOfRequest}</Text>
                  <View style={styles.statusContainer}>
                    <Text style={styles.statusLabel}>Status:</Text>
                    <Text style={[styles.statusText, getStatusStyle(request.status)]}>
                      {request.status.toUpperCase()}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.viewDetailsButton}
                    onPress={() => handleViewDetails(request)}
                  >
                    <Text style={styles.viewDetailsButtonText}>View Details</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </View>

      {/* Request Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {selectedRequest && (
              <ScrollView contentContainerStyle={{ paddingHorizontal: 10 }}>
                <Text style={styles.modalTitle}>{selectedRequest.requestType}</Text>
                <View style={styles.modalDetailRow}>
                  <Text style={[styles.modalDetailLabel, {minWidth: 40}]}>Date of Request:</Text>
                  <Text style={[styles.modalDetailValue, {textAlign: 'right'}]}>{selectedRequest.dateOfRequest}</Text>
                </View>
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailLabel}>Status:</Text>
                  <Text style={[styles.modalDetailValue, getStatusStyle(selectedRequest.status), {textAlign: 'right'}]}>
                    {selectedRequest.status.toUpperCase()}
                  </Text>
                </View>
                <View>
                  <Text style={styles.modalDetailLabel}>Description:</Text>
                  <Text style={styles.modalDetailValue}>{selectedRequest.description}</Text>
                </View>

                {selectedRequest.needs && selectedRequest.needs.length > 0 && (
                    <View style={styles.modalDetailBlock}>
                        <Text style={styles.modalDetailLabel}>Needs:</Text>
                        {selectedRequest.needs.map((need: string, index: number) => (
                            <Text key={index} style={styles.modalDetailValue}>- {need}</Text>
                        ))}
                    </View>
                )}

                {selectedRequest.household && (
                    <View style={styles.modalDetailBlock}>
                        <Text style={styles.modalDetailLabel}>Family Household:</Text>
                        <Text style={styles.modalDetailValue}>Adults: {selectedRequest.household.adults}</Text>
                        <Text style={styles.modalDetailValue}>Babies/Toddlers: {selectedRequest.household.babiesToddlers}</Text>
                    </View>
                )}

                {selectedRequest.additionalDetails && (
                    <View style={styles.modalDetailBlock}>
                        <Text style={styles.modalDetailLabel}>Additional Details:</Text>
                        <Text style={styles.modalDetailValue}>{selectedRequest.additionalDetails}</Text>
                    </View>
                )}


                {selectedRequest.messageFromLGU && (
                  <View style={styles.modalDetailBlock}>
                    <Text style={styles.modalDetailLabel}>Message from LGU:</Text>
                    <Text style={styles.modalDetailValue}>{selectedRequest.messageFromLGU}</Text>
                  </View>
                )}
                <View style={styles.modalDetailBlock}>
                  <Text style={styles.modalDetailLabel}>Contact Details:</Text>
                  <Text style={styles.modalDetailValue}>Phone: {selectedRequest.contactPhoneNumber}</Text>
                  <Text style={styles.modalDetailValue}>Email: {selectedRequest.contactEmail}</Text>
                </View>
              </ScrollView>
            )}
            <TouchableOpacity
              style={[commonStyles.button, styles.modalCloseButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={commonStyles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.primary,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 35,
  },
  noRequestsText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 30,
  },
  requestCard: {
    backgroundColor: colors.fieldBg,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  requestType: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 5,
  },
  requestDate: {
    fontSize: 14,
    color: "#777",
    marginBottom: 10,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  statusLabel: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    marginRight: 5,
  },
  statusText: {
    fontSize: 15,
    fontWeight: "bold",
  },
  statusApproved: {
    color: "green",
  },
  statusPending: {
    color: "orange",
  },
  statusDenied: {
    color: "red",
  },
  viewDetailsButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  viewDetailsButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "600",
  },
  // Modal Styles (copied from RequestProcessScreen for consistency)
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25, // Adjusted padding for more content
    alignItems: "flex-start", // Align text to start
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: '80%', // Limit modal height
    width: '90%', // Set a width
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: colors.primary,
    textAlign: 'center',
    width: '100%', // Ensure title centers
  },
  modalDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    width: '100%',
  },
  modalDetailLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  modalDetailValue: {
    fontSize: 15,
    color: '#555',
    flex: 2,
    textAlign: 'left',
  },
  modalDetailBlock: {
    marginTop: 10,
    marginBottom: 5,
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  },
  modalCloseButton: {
    width: '100%',
    marginTop: 20,
    alignSelf: 'center', // Center the button
  },
});

export default MyRequestsScreen;
