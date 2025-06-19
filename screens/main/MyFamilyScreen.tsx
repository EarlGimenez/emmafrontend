import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import * as Clipboard from 'expo-clipboard';
import * as Location from 'expo-location';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import { fetcher } from "@/utils/fetcher";
import { API_URLS } from "@/config/api";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, commonStyles } from "../../styles/commonStyles";
import { DrawerActions } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';

const MyFamilyScreen = ({ navigation }: any) => {
  const [familyData, setFamilyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [qrReady, setQrReady] = useState(false);
  const [isCodeVisible, setIsCodeVisible] = useState(false);
  
  const getUserId = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID not found in storage");
      }
      return userId;
    } catch (error) {
      console.error("Error retrieving userId:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchFamilyData = async () => {
      try {
        const userId = await getUserId();
        if (!userId) {
          Alert.alert("Error", "User ID is required to check family status");
          return;
        }

        const response = await fetcher(API_URLS.family.current, {
          method: "GET",
          params: { userId }, // Pass userId as a query parameter
        });
        if (response.success) {
          setFamilyData(response);
        }
      } catch (error) {
        console.error("Error fetching family:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFamilyData();
  }, []);

  const handleMemberPress = (member: any) => {
    console.log("Family member pressed:", member.name);
    navigation.navigate("TrackFamily", { selectedMember: member });
  };

  const handleShareQR = async () => {
  try {
    console.log("Sharing QR code...");
    if (!familyData?.id) {
      throw new Error("Family ID not found");
    }

    // Get QR code data from backend
    const qrResponse = await fetcher(API_URLS.family.qrcode(familyData.id));
    if (!qrResponse.success || !qrResponse.qrData) {
      throw new Error("Failed to get QR code data from server");
    }

    // Create a temporary file with the QR data
    const fileUri = `${FileSystem.cacheDirectory}family-qr.png`;
    await FileSystem.writeAsStringAsync(fileUri, qrResponse.qrData, {
      encoding: FileSystem.EncodingType.Base64
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        dialogTitle: "Share Family QR Code",
        mimeType: "image/png",
      });
    } else {
      Alert.alert("Sharing not available", "Your device does not support sharing");
    }
  } catch (error: any) {
    console.error("Error during QR code sharing:", error);
    Alert.alert("Error", error.message || "Failed to share QR code");
  }
};

const handleShareFamilyCode = async () => {
  setIsCodeVisible(!isCodeVisible);
  try {
    if (!familyData?.joinCode) {
      throw new Error("Family code not found");
    }

    Alert.alert(
      "Family Join Code", 
      `Share this code with your family members:\n\n${familyData.joinCode}`,
      [
        {
          text: "Copy Code",
          onPress: async () => {
            await Clipboard.setStringAsync(familyData.joinCode!);
            Alert.alert("Success", "Code copied to clipboard!");
          }
        },
        {
          text: "Close",
          style: "cancel"
        }
      ]
    );
  } catch (error: any) {
    console.error('Error sharing family code:', error);
    Alert.alert("Error", "Failed to share family code");
  }
};

  const handleLeaveFamily = async () => {
  Alert.alert("Leave Family", "Are you sure you want to leave this family?", [
    {
      text: "Cancel",
      style: "cancel",
    },
    {
      text: "Leave",
      style: "destructive",
      onPress: async () => {
        try {
          const userId = await getUserId();
          const response = await fetcher(API_URLS.family.leave, {
            method: 'POST',
            body: JSON.stringify({ userId }),
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
          if (response.success) {
            Alert.alert("Success", "Successfully left family", [{
              text: "OK",
              onPress: () => navigation.replace("Landing")
            }]);
          } else {
            Alert.alert('Error', response.message || 'Failed to leave family');
          }
        } catch (error) {
          console.error('Error leaving family:', error);
          Alert.alert("Error", "Failed to leave family");
        }
      },
    },
  ]);
};

  const handleMenu = () => {
    console.log("Menu pressed");
  };

  const handleNotifications = () => {
    console.log("Notifications pressed");
  };

  return (
    <View
      style={[styles.container, {backgroundColor: colors.primary}]}
    >
      <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())} style={styles.menuIcon}>
                <Ionicons name="menu" size={30} color={colors.white} />
              </TouchableOpacity>
      
              <TouchableOpacity
                style={styles.notificationButton}
                onPress={handleNotifications}
              >
                <TouchableOpacity onPress={() => console.log('Notification Bell Pressed')} style={styles.notificationBell}>
                <Ionicons name="notifications" size={26} color={colors.white} />
              </TouchableOpacity>
              </TouchableOpacity>
            </View>

      <View style={styles.mainWhiteContainer}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>
            {familyData?.familyName || "My Family"}
          </Text>

          {loading ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : familyData?.members?.length > 0 ? (
            <View style={styles.membersList}>
              {familyData.members.map((member: any, index: number) => (
                <TouchableOpacity
                  key={index}
                  style={styles.memberItem}
                  onPress={() => handleMemberPress(member)}
                >
                  <View style={styles.avatarContainer}>
                    <Text style={styles.avatar}>
                      {member.name ? member.name[0].toUpperCase() : "?"}
                    </Text>
                  </View>
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>
                      {member.name || "Unknown"}
                    </Text>
                    <Text style={styles.memberType}>
                      {member.type || "Member"}
                    </Text>
                  </View>
                  <Text style={styles.memberArrow}>→</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={styles.noMembersText}>No family members found</Text>
          )}
        </ScrollView>
        
        {isCodeVisible && (
          <TouchableOpacity 
            style={styles.codeContainer}
            onPress={async () => {
              if (familyData?.joinCode) {
                await Clipboard.setStringAsync(familyData.joinCode);
                Alert.alert("Copied!", "Family code copied to clipboard");
              }
            }}
          >
            <Text style={styles.codeLabel}>Family Join Code:</Text>
            <Text style={styles.codeText}>{familyData?.joinCode || 'Loading...'}</Text>
            <Text style={styles.copyHint}>Tap to copy</Text>
          </TouchableOpacity>
        )}

        <View style={styles.bottomSection}>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.shareButton}
              onPress={handleShareQR}
            >
              <Text style={styles.shareButtonText}>Share QR Code</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.shareButton, isCodeVisible && styles.activeShareButton]}
              onPress={handleShareFamilyCode}
            >
              <Text style={styles.shareButtonText}>
                {isCodeVisible ? 'Hide Code' : 'Share Code'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.leaveButton}
            onPress={handleLeaveFamily}
          >
            <Text style={styles.leaveButtonText}>Leave Family</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  activeShareButton: {
    backgroundColor: colors.secondary,
  },
  codeContainer: {
    backgroundColor: colors.fieldBg,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  codeLabel: {
    fontSize: 14,
    color: colors.secondary,
    marginBottom: 5,
  },
  codeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 2,
    marginBottom: 5,
  },
  copyHint: {
    fontSize: 12,
    color: colors.secondary,
    fontStyle: 'italic',
  },
  loadingText: {
    textAlign: "center",
    color: colors.primary,
    fontSize: 16,
    marginTop: 20,
  },
  noMembersText: {
    textAlign: "center",
    color: colors.secondary,
    fontSize: 16,
    marginTop: 20,
  },
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
    padding: 5,
  },
  notificationButton: {
    padding: 10,
  },
  notificationBell: {
    padding: 5,
  },
  mainWhiteContainer: {
    backgroundColor: colors.white,
    flex: 1,
    // No margin - reaches directly to header
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40, // Added top padding for breathing room
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.primary,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: colors.primary,
    textAlign: "center",
    marginBottom: 30,
    fontWeight: "500",
  },
  membersList: {
    marginBottom: 20,
  },
  memberItem: {
    backgroundColor: "#f8f9fa",
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.fieldBg,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  avatar: {
    fontSize: 24,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 2,
  },
  memberType: {
    fontSize: 14,
    color: "#666",
  },
  memberArrow: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: "bold",
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 20,
  },
  shareButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 15,
    flex: 1,
    alignItems: "center",
  },
  shareButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  leaveButton: {
    alignItems: "center",
  },
  leaveButtonText: {
    color: "#ff4444",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default MyFamilyScreen;
