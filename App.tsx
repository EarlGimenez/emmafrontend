import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { createDrawerNavigator } from '@react-navigation/drawer'; // Import createDrawerNavigator

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
import LandingScreen from "./screens/main/LandingScreen"
import CheckFamilyScreen from "./screens/main/CheckFamilyScreen"
import CreateFamilyScreen from "./screens/main/CreateFamilyScreen"
import MyFamilyScreen from "./screens/main/MyFamilyScreen"
import TrackFamilyScreen from "./screens/main/TrackFamilyScreen"
import HomeScreen from "./screens/main/HomeScreen" // This will be the initial screen inside the Drawer Navigator
import CustomDrawerContent from './components/screen_components/CustomDrawerContent'; // Import your custom drawer content
import DataPrivacyConsentScreen from "./screens/volunteer/DataPrivacyConsentScreen"
import VolunteerApplicationSubmittedScreen from "./screens/volunteer/VolunteerApplicationSubmittedScreen"
import VolunteerBackgroundCheckScreen from "./screens/volunteer/VolunteerBackgroundCheckScreen"
import VolunteerExperienceScreen from "./screens/volunteer/VolunteerExperienceScreen"
import ProfileScreen from "./screens/main/ProfileScreen"
import TrainingsScreen from "./screens/main/TrainingsScreen";
import DonateScreen from "./screens/main/DonateScreen";
import RequestEntryScreen from './screens/requests/RequestEntryScreen';
import RequestProcessScreen from './screens/requests/RequestProcessScreen';
import MyRequestsScreen from './screens/requests/MyRequestsScreen';
import DisasterReliefChatScreen from './screens/DisasterReliefChatScreen';

const Stack = createStackNavigator()
const Drawer = createDrawerNavigator(); // Create a Drawer Navigator instance

// Define the Drawer Navigator structure
// This component encapsulates all screens that will live within the drawer
function MainAppDrawer() {
  return (
    <Drawer.Navigator
      // Use your custom drawer component for the sidebar content
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      // Hide the default header provided by Drawer Navigator, as HomeScreen manages its own header
      screenOptions={{ headerShown: false }} 
    >
      {/* HomeScreen is the first screen within the drawer.
          When MainAppDrawer is navigated to, HomeScreen will be shown by default. */}
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      <Drawer.Screen name="Trainings" component={TrainingsScreen} options={{ headerShown: false }} />
      <Drawer.Screen name="EmergencyChat" component={DisasterReliefChatScreen} options={{ headerShown: false }} />
      {/* Add other screens that should be accessible directly from the drawer here.
          For example, if you had a "ProfileScreen" that also needed to open the drawer:
          <Drawer.Screen name="Profile" component={ProfileScreen} /> */}
    </Drawer.Navigator>
  );
}

// Define the main Stack Navigator structure
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        // Set 'Loading' as the initial route for handling authentication checks first
        initialRouteName="Loading"
        // Globally hide stack headers, as individual screens or nested navigators will manage them
        screenOptions={{ headerShown: false }} 
      >
        {/* Loading Screen: Handles initial auth checks and redirects */}
        <Stack.Screen name="Loading" component={LoadingScreen} />
        {/* Login Screen: User authentication */}
        <Stack.Screen name="Login" component={LoginScreen} />
        
        {/* IMPORTANT: This is the key change.
            The 'MainAppDrawer' (which is your entire drawer navigation setup,
            including the HomeScreen) is now a screen within the main Stack Navigator.
            
            When a user successfully logs in, you should navigate to "MainAppDrawer".
            This will render the Drawer Navigator, with HomeScreen as its initial screen.
            From HomeScreen, the DrawerActions.openDrawer() will now work because
            HomeScreen is a child of the Drawer Navigator.
        */}
        <Stack.Screen name="MainAppDrawer" component={MainAppDrawer} />

        {/* The rest of your registration flow screens, which are typically
            linear and don't involve the drawer, remain in the main Stack Navigator. */}
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
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="CheckFamily" component={CheckFamilyScreen} />
        <Stack.Screen name="CreateFamily" component={CreateFamilyScreen} />
        <Stack.Screen name="MyFamily" component={MyFamilyScreen} />
        <Stack.Screen name="TrackFamily" component={TrackFamilyScreen} />

        <Stack.Screen name="DataPrivacyConsent" component={DataPrivacyConsentScreen} />
        <Stack.Screen name="VolunteerApplicationSubmitted" component={VolunteerApplicationSubmittedScreen} />
        <Stack.Screen name="VolunteerBackgroundCheck" component={VolunteerBackgroundCheckScreen} />
        <Stack.Screen name="VolunteerExperience" component={VolunteerExperienceScreen} />

        <Stack.Screen name="Donate" component={DonateScreen} />

        <Stack.Screen name="RequestEntry" component={RequestEntryScreen} />
        <Stack.Screen name="RequestProcess" component={RequestProcessScreen} />
        <Stack.Screen name="MyRequests" component={MyRequestsScreen} />
        <Stack.Screen name="DisasterChat" component={DisasterReliefChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
