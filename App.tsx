import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import LoadingScreen from "./screens/LoadingScreen"
import LoginScreen from "./screens/LoginScreen"
import DataPrivacyScreen from "./screens/registration/DataPrivacyScreen"
import AccountTypeScreen from "./screens/registration/AccountTypeScreen"
import BasicInfoScreen from "./screens/registration/BasicInfoScreen"
import PWDVerificationScreen from "./screens/registration/PWDVerificationScreen"
import SeniorVerificationScreen from "./screens/registration/SeniorVerificationScreen"
import GeneralVerificationScreen from "./screens/registration/GeneralVerificationScreen"
import ParentalConsentScreen from "./screens/registration/ParentalConsentScreen"
import ParentInfoScreen from "./screens/registration/ParentInfoScreen"
import ParentVerificationScreen from "./screens/registration/ParentVerificationScreen"
import OTPScreen from "./screens/registration/OTPScreen"
import VerificationSuccessScreen from "./screens/registration/VerificationSuccessScreen"
import ChildInfoScreen from "./screens/registration/ChildInfoScreen"
import AdditionalInfoScreen from "./screens/registration/AdditionalInfoScreen"

const Stack = createStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Loading" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Loading" component={LoadingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="DataPrivacy" component={DataPrivacyScreen} />
        <Stack.Screen name="AccountType" component={AccountTypeScreen} />
        <Stack.Screen name="BasicInfo" component={BasicInfoScreen} />
        <Stack.Screen name="PWDVerification" component={PWDVerificationScreen} />
        <Stack.Screen name="SeniorVerification" component={SeniorVerificationScreen} />
        <Stack.Screen name="GeneralVerification" component={GeneralVerificationScreen} />
        <Stack.Screen name="ParentalConsent" component={ParentalConsentScreen} />
        <Stack.Screen name="ParentInfo" component={ParentInfoScreen} />
        <Stack.Screen name="ParentVerification" component={ParentVerificationScreen} />
        <Stack.Screen name="OTP" component={OTPScreen} />
        <Stack.Screen name="VerificationSuccess" component={VerificationSuccessScreen} />
        <Stack.Screen name="ChildInfo" component={ChildInfoScreen} />
        <Stack.Screen name="AdditionalInfo" component={AdditionalInfoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
