"use client"

import { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { colors, commonStyles } from "../../styles/commonStyles"
import { fetcher } from "@/utils/fetcher"
import { API_URLS } from "@/config/api"

const SHEET_RADIUS = 20

type AnyObj = Record<string, any>

function parseUserId(obj: AnyObj | undefined) {
  if (!obj) return undefined
  return (
    obj.userId ?? obj.user_id ?? obj.id ??
    obj.user?.id ?? obj.data?.user?.id ?? obj.data?.id
  )
}

const FinalRemindersScreen = ({ navigation, route }: any) => {
  const [consentSharing, setConsentSharing] = useState(false)
  const [consentAlerts, setConsentAlerts] = useState(false)
  const [loading, setLoading] = useState(false)

  const initialUserData = route.params?.userData || {}
  const initialToken = route.params?.userToken || null

  const [userData, setUserData] = useState<any>(initialUserData)
  const [userToken, setUserToken] = useState<string | null>(initialToken)

  useEffect(() => {
    (async () => {
      try {
        if (initialToken) await AsyncStorage.setItem("userToken", initialToken)
        if (!initialToken) {
          const saved = await AsyncStorage.getItem("userToken")
          if (saved) setUserToken(saved)
        }
      } catch {}
    })()
  }, [initialToken])

  const handleCompleteRegistration = async () => {
    if (!consentSharing || !consentAlerts) {
      Alert.alert("Consent Required", "Please agree to both data sharing and alerts to complete registration.")
      return
    }

    const uid = parseUserId(userData)
    const finalUserData = {
      ...userData,
      userId: uid ?? userData?.userId,
      status: "active",
      consents: { dataSharing: consentSharing, alerts: consentAlerts, timestamp: new Date().toISOString() },
    }

    setLoading(true)
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/json",
      }
      if (userToken) headers.Authorization = `Bearer ${userToken}`

      const urlUserId = uid ?? userData?.userId
      if (!urlUserId) throw new Error("Missing user id; please sign in to finish setup.")

      const res = await fetcher(API_URLS.users.complete(urlUserId), {
        method: "POST",
        headers,
        body: JSON.stringify(finalUserData),
      })

      if (res?.success === true || res?.status === "success" || res?.status === 200 || res?.status === 201) {
        Alert.alert("Registration Complete", "You’ll be redirected to login.", [
          {
            text: "OK",
            onPress: async () => {
              await AsyncStorage.removeItem("userToken")
              await AsyncStorage.removeItem("userData")
              navigation.popToTop()
              navigation.replace("Login")
            },
          },
        ])
      } else {
        throw new Error(res?.message || "Could not finalize profile now. Please sign in to continue.")
      }
    } catch (e: any) {
      Alert.alert(
        "Almost done",
        e?.message || "We saved your account. Please sign in to finish setup.",
        [
          {
            text: "OK",
            onPress: () => {
              navigation.popToTop()
              navigation.replace("Login")
            },
          },
        ]
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Final Reminders</Text>

          <Text style={styles.lead}>
            Thank you for completing your registration! Please review the notice and provide consent below.
          </Text>

          <Section
            title="Data Privacy Notice"
            description="We use your information to enable efficient disaster response. We only share data with authorized agencies (LGUs, DSWD, and relevant responders). You may review our full Data Privacy Notice [here]."
          />

          <Section
            title="Data Sharing Consent"
            description="To coordinate response, we may share your data with LGUs, DSWD, and other relevant teams."
          >
            <CheckLine checked={consentSharing} onToggle={() => setConsentSharing(!consentSharing)}>
              Yes, I consent to sharing my data with authorized agencies.
            </CheckLine>
          </Section>

          <Section
            title="Alerts and Notifications"
            description="To keep you informed during emergencies, we can send alerts via SMS, email, or in-app messages."
          >
            <CheckLine checked={consentAlerts} onToggle={() => setConsentAlerts(!consentAlerts)}>
              Yes, I consent to receiving emergency alerts and notifications.
            </CheckLine>
          </Section>

          <Text style={styles.smallNote}>
            By tapping “Complete Registration”, you confirm you’ve read and agreed to the above consents.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[commonStyles.button, (!consentSharing || !consentAlerts || loading) && { opacity: 0.5 }]}
          onPress={handleCompleteRegistration}
          disabled={!consentSharing || !consentAlerts || loading}
        >
          <Text style={commonStyles.buttonText}>{loading ? "Submitting..." : "Complete Registration"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const Section = ({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children?: React.ReactNode
}) => (
  <View style={{ marginBottom: 18 }}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {!!description && <Text style={styles.body}>{description}</Text>}
    {children ? <View style={{ marginTop: 10 }}>{children}</View> : null}
  </View>
)

const CheckLine = ({
  checked,
  onToggle,
  children,
}: {
  checked: boolean
  onToggle: () => void
  children: React.ReactNode
}) => (
  <TouchableOpacity onPress={onToggle} style={styles.checkRow} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
    <View style={[styles.checkbox, checked && styles.checkboxChecked]} />
    <Text style={styles.checkboxText}>{children}</Text>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  sheet: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 60,
    borderRadius: SHEET_RADIUS,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  title: { fontSize: 22, fontWeight: "700", color: colors.primary, textAlign: "center", marginBottom: 12 },
  lead: { fontSize: 15, color: colors.primary, lineHeight: 22, marginBottom: 16, textAlign: "center" },

  sectionTitle: { fontSize: 18, fontWeight: "700", color: colors.primary, marginBottom: 6 },
  body: { fontSize: 14, color: "#333", lineHeight: 20 },

  checkRow: { flexDirection: "row", alignItems: "center" },
  checkbox: { width: 20, height: 20, borderWidth: 2, borderColor: colors.primary, marginRight: 10, borderRadius: 4 },
  checkboxChecked: { backgroundColor: colors.primary },
  checkboxText: { fontSize: 14, color: "#333", flex: 1, lineHeight: 20 },

  smallNote: { fontSize: 12, color: "#666", marginTop: 6 },

  bottomBar: { position: "absolute", left: 16, right: 16, bottom: 24 },
})

export default FinalRemindersScreen
