import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native"; // Make sure Alert is imported for user feedback

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

export const fetcher = async (url: string, options: FetchOptions = {}) => {
  const { params, ...fetchOptions } = options;

  const finalUrl = params
    ? `${url}?${new URLSearchParams(params)}`
    : url;

  // --- START: Added Authentication Logic ---
  let token: string | null = null;
  try {
    token = await AsyncStorage.getItem("userToken"); // Retrieve the authentication token
  } catch (error) {
    console.error("Error retrieving user token from AsyncStorage:", error);
    // You might want to handle this error more gracefully, e.g., redirect to login
  }
  // --- END: Added Authentication Logic ---

  try {
    const response = await fetch(finalUrl, {
      headers: {
        ...(fetchOptions.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
        // --- START: Add Authorization header if token exists ---
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}), // Conditionally add auth header
        // --- END: Add Authorization header if token exists ---
      },
      ...fetchOptions,
    });

    const jsonResponse = await response.json();

    // --- START: Enhanced Error Handling (consistent with previous suggestions) ---
    if (!response.ok) {
        console.error(`API Error (${response.status}) from ${finalUrl}:`, jsonResponse);
        Alert.alert(
            "API Error",
            jsonResponse.message || `Request to ${finalUrl} failed with status ${response.status}.`
        );
        throw new Error(jsonResponse.message || `Request failed with status ${response.status}.`);
    }
    // --- END: Enhanced Error Handling ---

    // Return the raw response data without wrapping it
    return jsonResponse;

  } catch (error: any) {
    // Return a consistent error format
    // If the error was already alerted by the `!response.ok` block, avoid re-alerting network issues.
    if (!error.message.includes("API Error")) { // Check if the specific API Error alert message was already used
      Alert.alert("Network Error", error.message || "Could not connect to the server or an unexpected error occurred.");
    }
    return {
      error: true,
      message: error.message || 'Network error'
    };
  }
};
