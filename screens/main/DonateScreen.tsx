"use client";

import React, { useState, useEffect, useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, ActivityIndicator, Alert, Image, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, commonStyles } from "@/styles/commonStyles";
import { fetcher } from "@/utils/fetcher";
import { API_URLS } from "@/config/api";

const { width } = Dimensions.get('window'); // Get window width for tab view layout

// --- Mock Data (Will be replaced by API calls) ---
const DUMMY_EVAC_CENTERS = [
  { id: "e1", name: "Cebu City Sports Center", location: "Osmeña Blvd, Cebu City", contact: "09171234567", description: "Main sports complex, large capacity.", imageUrl: "https://placehold.co/100x100/A2D2FF/000000?text=Sports+Center" },
  { id: "e2", name: "Abellana National School Gym", location: "Cebu City, 6000 Cebu", contact: "09207654321", description: "School gymnasium, suitable for many evacuees.", imageUrl: "https://placehold.co/100x100/FFB4A2/000000?text=Abellana" },
  { id: "e3", name: "Cebu Normal University Covered Court", location: "Osmeña Blvd, Cebu City", contact: "09328765432", description: "University court, good protection from elements.", imageUrl: "https://placehold.co/100x100/B5EAD7/000000?text=CNU" },
  { id: "e4", name: "Fuente Osmeña Circle Grounds", location: "Fuente Osmeña, Cebu City", contact: "09991112233", description: "Open grounds, suitable for temporary tent setups.", imageUrl: "https://placehold.co/100x100/FFF8DC/000000?text=Fuente" },
];

const DUMMY_RECENT_DONATIONS = [
  { id: "rd1", recipient: "Cebu City Sports Center", donationMade: "Goods (Food)", amount: 500.00, type: "Goods", date: "2025-06-18", description: "Donated canned goods and water bottles." },
  { id: "rd2", recipient: "Abellana National School Gym", donationMade: "Cash", amount: 1500.00, type: "Cash", date: "2025-06-17", description: "Monetary support for operations." },
  { id: "rd3", recipient: "Family of Dela Cruz", donationMade: "Cash", amount: 200.00, type: "Cash", date: "2025-06-16", description: "Direct aid to a displaced family." },
  { id: "rd4", recipient: "Cebu Normal University", donationMade: "Services (Medical)", amount: 0.00, type: "Service", date: "2025-06-15", description: "Volunteered medical services for 4 hours." },
];

// --- Tab Components ---

// Nearby EVAC Centers Tab Content
const NearbyEVACCentersRoute = ({ jumpTo, navigation }: { jumpTo: (key: string) => void, navigation: any }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [evacCenters, setEvacCenters] = useState<any[]>([]);
  const [loadingEvacCenters, setLoadingEvacCenters] = useState(true);

  useEffect(() => {
    const fetchEvacCenters = async () => {
      setLoadingEvacCenters(true);
      try {
        // In a real app, you would fetch this from your API
        // Example: const response = await fetcher(API_URLS.mapGeoCode.nearest); // or a generic evacuation centers list
        // if (response.success && response.data) {
        //   setEvacCenters(response.data);
        // } else {
        //   Alert.alert("Error", response.message || "Failed to load evacuation centers.");
        //   setEvacCenters([]);
        // }

        // For now, use dummy data
        setTimeout(() => {
          setEvacCenters(DUMMY_EVAC_CENTERS);
          setLoadingEvacCenters(false);
        }, 1000);

      } catch (error: any) {
        console.error("Error fetching evac centers:", error.message);
        Alert.alert("Error", "Could not load evacuation centers. Please check your connection.");
        setEvacCenters([]);
        setLoadingEvacCenters(false);
      }
    };
    fetchEvacCenters();
  }, []);

  const filteredEvacCenters = useMemo(() => {
    if (!searchTerm) {
      return evacCenters;
    }
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return evacCenters.filter(
      (center) =>
        center.name.toLowerCase().includes(lowercasedSearchTerm) ||
        center.location.toLowerCase().includes(lowercasedSearchTerm) ||
        center.description.toLowerCase().includes(lowercasedSearchTerm)
    );
  }, [evacCenters, searchTerm]);


  const handleDonateToEvacCenter = (centerId: string, centerName: string) => {
    Alert.alert(
      "Donate to Evacuation Center",
      `How would you like to donate to ${centerName}? (Simulated)`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Donate Cash",
          onPress: async () => {
            // Simulate cash donation
            console.log(`Simulating Cash Donation to ${centerName}`);
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
            Alert.alert("Success", `Thank you for your cash donation to ${centerName}!`);
            // Add a simulated donation to DUMMY_RECENT_DONATIONS (for immediate feedback)
            DUMMY_RECENT_DONATIONS.unshift({
                id: `d${Date.now()}`,
                recipient: centerName,
                donationMade: "Cash",
                amount: 500, // Example fixed amount
                type: "Cash",
                date: new Date().toISOString().split('T')[0],
                description: "Simulated cash donation."
            });
            jumpTo('recentDonations'); // Switch tab
          },
        },
        {
            text: "Donate Goods",
            onPress: async () => {
              // Simulate goods donation
              console.log(`Simulating Goods Donation to ${centerName}`);
              await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
              Alert.alert("Success", `Thank you for your goods donation to ${centerName}! We will contact you for details.`);
              DUMMY_RECENT_DONATIONS.unshift({
                id: `d${Date.now()}`,
                recipient: centerName,
                donationMade: "Goods (Assorted)",
                amount: 0, // No monetary amount for goods
                type: "Goods",
                date: new Date().toISOString().split('T')[0],
                description: "Simulated goods donation."
            });
              jumpTo('recentDonations'); // Switch tab
            },
          },
      ],
      { cancelable: true }
    );
  };


  return (
    <ScrollView contentContainerStyle={styles.tabContentContainer}>
      <Text style={styles.tabSectionTitle}>Available Evacuation Centers</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search evacuation centers by name, location..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      {loadingEvacCenters ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loadingText} />
      ) : filteredEvacCenters.length === 0 ? (
        <Text style={styles.noDataText}>No evacuation centers found matching your search.</Text>
      ) : (
        filteredEvacCenters.map((center) => (
          <View key={center.id} style={styles.evacCenterCard}>
            <Image source={{ uri: center.imageUrl }} style={styles.evacCenterImage} />
            <View style={styles.evacCenterInfo}>
              <Text style={styles.evacCenterName}>{center.name}</Text>
              <Text style={styles.evacCenterDetail}><Ionicons name="location-outline" size={14} /> {center.location}</Text>
              <Text style={styles.evacCenterDetail}><Ionicons name="call-outline" size={14} /> {center.contact}</Text>
              <Text style={styles.evacCenterDescription}>{center.description}</Text>
              <TouchableOpacity
                style={styles.donateButton}
                onPress={() => handleDonateToEvacCenter(center.id, center.name)}
              >
                <Text style={styles.donateButtonText}>Donate</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

// Recent Donations Tab Content
const RecentDonationsRoute = () => {
  const [recentDonations, setRecentDonations] = useState<any[]>([]);
  const [loadingRecentDonations, setLoadingRecentDonations] = useState(true);

  // This useEffect will now directly use the DUMMY_RECENT_DONATIONS or fetch from API
  useEffect(() => {
    const fetchRecentDonations = async () => {
      setLoadingRecentDonations(true);
      try {
        // In a real app, you would fetch this from your API
        // const response = await fetcher(API_URLS.donations.recent);
        // if (response.success && response.data) {
        //   setRecentDonations(response.data);
        // } else {
        //   Alert.alert("Error", response.message || "Failed to load recent donations.");
        //   setRecentDonations([]);
        // }

        // For now, use dummy data (ensure it's fresh if a donation was just made)
        setTimeout(() => {
          setRecentDonations([...DUMMY_RECENT_DONATIONS]); // Create a copy to trigger re-render if DUMMY_RECENT_DONATIONS changes
          setLoadingRecentDonations(false);
        }, 500);

      } catch (error: any) {
        console.error("Error fetching recent donations:", error.message);
        Alert.alert("Error", "Could not load recent donations. Please check your connection.");
        setRecentDonations([]);
        setLoadingRecentDonations(false);
      }
    };
    fetchRecentDonations();
  }, [DUMMY_RECENT_DONATIONS]); // Re-fetch if the global dummy data changes (in a real app, remove this dependency)


  if (loadingRecentDonations) {
    return (
      <View style={styles.tabLoadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading Recent Donations...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.tabContentContainer}>
      <Text style={styles.tabSectionTitle}>Your Recent Contributions</Text>
      {recentDonations.length === 0 ? (
        <Text style={styles.noDataText}>No recent donations found.</Text>
      ) : (
        recentDonations.map((donation) => (
          <View key={donation.id} style={styles.donationCard}>
            {/* Donation Recipient Header */}
            <Text style={styles.donationRecipientHeader}>{donation.recipient}</Text>
            
            <View style={styles.donationRow}>
                <Text style={styles.donationLabel}>Donation Made:</Text>
                <Text style={styles.donationValue}>{donation.donationMade}</Text>
            </View>
            <View style={styles.donationRow}>
                <Text style={styles.donationLabel}>Amount:</Text>
                <Text style={styles.donationValue}>
                    {donation.amount > 0 ? `PHP ${donation.amount.toFixed(2)}` : 'N/A (Goods/Service)'}
                </Text>
            </View>
            <View style={styles.donationRow}>
                <Text style={styles.donationLabel}>Type:</Text>
                <Text style={styles.donationValue}>{donation.type}</Text>
            </View>
            <View style={styles.donationRow}>
                <Text style={styles.donationLabel}>Date:</Text>
                <Text style={styles.donationValue}>{donation.date}</Text>
            </View>
            {donation.description && (
                <View style={styles.donationRow}>
                    <Text style={styles.donationLabel}>Description:</Text>
                    <Text style={styles.donationValue}>{donation.description}</Text>
                </View>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
};


// --- Main DonateScreen Component ---

const DonateScreen = () => {
  const navigation = useNavigation<any>();
  const [index, setIndex] = useState(0); // Default to first tab (Nearby EVAC Centers)
  const [routes] = useState([
    { key: 'nearbyEvacCenters', title: 'Nearby EVAC Centers' },
    { key: 'recentDonations', title: 'Recent Donations' },
  ]);

  const renderScene = ({ route, jumpTo }: { route: any, jumpTo: (key: string) => void }) => {
    switch (route.key) {
      case 'nearbyEvacCenters':
        return <NearbyEVACCentersRoute jumpTo={jumpTo} navigation={navigation} />;
      case 'recentDonations':
        return <RecentDonationsRoute />;
      default:
        return null;
    }
  };

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={styles.tabBarIndicator}
      style={styles.tabBar}
      labelStyle={styles.tabBarLabel}
      activeColor={colors.primary}
      inactiveColor="#666"
    />
  );

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      style={commonStyles.mainThemeBackground}
    >
      <View style={commonStyles.container}>
        <TouchableOpacity style={commonStyles.backButton} onPress={() => navigation.goBack()}>
          <Text style={commonStyles.backButtonText}>← Donate</Text>
        </TouchableOpacity>

        <View style={commonStyles.whiteContainer}>
          <Text style={commonStyles.title}>Donate Now!</Text> {/* Updated Header */}
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: width - 40 }} // Adjust initial layout width based on container padding
            renderTabBar={renderTabBar}
          />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  tabContentContainer: {
    paddingHorizontal: 0, // Padding handled by individual card/item styles
    paddingVertical: 20,
    alignItems: "center",
    flexGrow: 1,
  },
  tabLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabSectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 15,
    textAlign: "center",
    width: '100%',
  },
  noDataText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 30,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.primary,
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
  // New styles for Evac Center Tab
  searchBar: {
    width: '95%',
    backgroundColor: colors.fieldBg,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  evacCenterCard: {
    flexDirection: "column", // Changed to column layout to match image hint
    backgroundColor: colors.fieldBg,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    width: "95%", // Occupy most of the width
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  evacCenterImage: {
    width: '100%', // Full width of the card
    height: 150, // Fixed height for banner image
    borderRadius: 10,
    marginBottom: 10, // Space between image and text
    resizeMode: 'cover',
  },
  evacCenterInfo: {
    flex: 1,
  },
  evacCenterName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 5,
  },
  evacCenterDetail: {
    fontSize: 14,
    color: "#555",
    marginBottom: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  evacCenterDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 10,
  },
  donateButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: "flex-end", // Align button to the right
    marginTop: 10,
  },
  donateButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "600",
  },
  // Styles for Recent Donations Tab (updated)
  donationCard: {
    backgroundColor: colors.fieldBg,
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    width: "95%", // Occupy most of the width
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  donationRecipientHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  donationRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 5,
  },
  donationLabel: {
      fontSize: 14,
      color: '#777',
      fontWeight: '500',
  },
  donationValue: {
      fontSize: 14,
      color: '#333',
      fontWeight: '400',
      flexShrink: 1, // Allow text to wrap
      textAlign: 'right', // Align value to the right
  },
});

export default DonateScreen;
