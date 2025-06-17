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
import HouseholdScanScreen from "./screens/registration/HouseholdScanScreen"
import HouseholdInfoScreen from "./screens/registration/HouseholdInfoScreen"
import LocationDetailsScreen from "./screens/registration/LocationDetailsScreen"
import EvacuationCenterScreen from "./screens/registration/EvacuationCenterScreen"
import EvacuationDetailsScreen from "./screens/registration/EvacuationDetailsScreen"
import AccountSetupScreen from "./screens/registration/AccountSetupScreen"
import AccountSuccessScreen from "./screens/registration/AccountSuccessScreen"
import FinalRemindersScreen from "./screens/registration/FinalRemindersScreen"
// Assuming you have a Home/Dashboard screen for authenticated users
import HomeScreen from "./screens/main/HomeScreen"
import { createDrawerNavigator } from "@react-navigation/drawer"

const Drawer = createDrawerNavigator();

function MainAppDrawer() {
  return (
    <Drawer.Navigator
      // Uncomment and implement CustomDrawerContent if you have a custom drawer
      // drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      {/* Add other screens that should be accessible from the drawer here */}
      {/* Example: <Drawer.Screen name="Profile" component={ProfileScreen} /> */}
      {/* Example: <Drawer.Screen name="Settings" component={SettingsScreen} /> */}
      {/* You can also nest Stack Navigators inside Drawer Screens if needed */}
    </Drawer.Navigator>
  );
}

const Stack = createStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Loading">
        <Stack.Screen name="MainAppDrawer" component={MainAppDrawer} options={{ headerShown: false }} />
        <Stack.Screen name="Loading" component={LoadingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
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
        <Stack.Screen name="HouseholdScan" component={HouseholdScanScreen} />
        <Stack.Screen name="HouseholdInfo" component={HouseholdInfoScreen} />
        <Stack.Screen name="LocationDetails" component={LocationDetailsScreen} />
        <Stack.Screen name="EvacuationCenter" component={EvacuationCenterScreen} />
        <Stack.Screen name="EvacuationDetails" component={EvacuationDetailsScreen} />
        <Stack.Screen name="AccountSetup" component={AccountSetupScreen} />
        <Stack.Screen name="AccountSuccess" component={AccountSuccessScreen} />
        <Stack.Screen name="FinalReminders" component={FinalRemindersScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
