"use client"

import * as Sharing from 'expo-sharing';
import QRCode from 'react-native-qrcode-svg';
import { useState, useEffect } from "react"
import { fetcher } from "@/utils/fetcher"
import { API_URLS } from "@/config/api"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { colors } from "../../styles/commonStyles"

const MyFamilyScreen = ({ navigation }: any) => {
  const [familyData, setFamilyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  let qrRef: any;

  useEffect(() => {
    const fetchFamilyData = async () => {
      try {
        const response = await fetcher(API_URLS.family.current);
        if (response.success) {
          setFamilyData(response);
        }
      } catch (error) {
        console.error('Error fetching family:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFamilyData();
  }, []);
  
  const handleMemberPress = (member: any) => {
    console.log("Family member pressed:", member.name)
    navigation.navigate("TrackFamily", { selectedMember: member })
  }

  const handleShareQR = async () => {
    try {
      if (!familyData?.id) {
        throw new Error('Family ID not found');
      }

      const response = await fetcher(API_URLS.family.qrcode(familyData.id), {
        method: 'GET'
      });
      
      if (response && response.qrData) {
        let base64QR;
        qrRef?.toDataURL(async (dataURL: string) => {
          base64QR = dataURL;
          
          if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(base64QR, {
              mimeType: 'image/png',
              dialogTitle: 'Share Family QR Code'
            });
          }
        });
      } else {
        throw new Error('Failed to generate QR code');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to share QR code');
    }
  };

   const handleShareFamilyCode = async () => {
    try {
      if (!familyData?.joinCode) {
        throw new Error('Family code not found');
      }

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(`Family Code: ${familyData.joinCode}`, {
          mimeType: 'text/plain',
          dialogTitle: 'Share Family Code'
        });
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to share family code');
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
            const response = await fetcher(API_URLS.family.leave, {
              method: 'POST'
            });
            
            if (response.success) {
              navigation.replace("Landing");
            } else {
              Alert.alert('Error', response.message || 'Failed to leave family');
            }
          } catch (error) {
            Alert.alert('Error', 'Failed to leave family');
          }
        },
      },
    ]);
  };

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
          <Text style={styles.title}>{familyData?.familyName || 'My Family'}</Text>

          {loading ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : familyData?.members?.length > 0 ? (
            <View style={styles.membersList}>
              {familyData.members.map((member: any) => (
                <TouchableOpacity 
                  key={member.id} 
                  style={styles.memberItem} 
                  onPress={() => handleMemberPress(member)}
                >
                  {/* ...existing member item content... */}
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={styles.noMembersText}>No family members found</Text>
          )}
        </ScrollView>

        <View style={styles.bottomSection}>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.shareButton} onPress={handleShareQR}>
            <Text style={styles.shareButtonText}>Share QR</Text>
          </TouchableOpacity>
          
          {/* Fix QRCode component */}
          <View style={{ height: 0, width: 0, overflow: 'hidden' }}>
            <QRCode
              value={JSON.stringify({
                familyId: familyData?.id,
                familyName: familyData?.name,
                joinCode: familyData?.joinCode
              })}
              size={200}
              getRef={(ref) => (qrRef = ref)}
            />
          </View>

          <TouchableOpacity style={styles.shareButton} onPress={handleShareFamilyCode}>
            <Text style={styles.shareButtonText}>Share Family Code</Text>
          </TouchableOpacity>
        </View>
        </View>
      </View>
    </LinearGradient>
  )
}


const styles = StyleSheet.create({
  loadingText: {
    textAlign: 'center',
    color: colors.primary,
    fontSize: 16,
    marginTop: 20,
  },
  noMembersText: {
    textAlign: 'center',
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
})

export default MyFamilyScreen
