import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

export const fetcher = async (url: string, options: FetchOptions = {}) => {
  const { params, ...fetchOptions } = options;

  const finalUrl = params
    ? `${url}?${new URLSearchParams(params)}`
    : url;

  // --- Authentication Logic ---
  let token: string | null = null;
  try {
    token = await AsyncStorage.getItem("userToken");
  } catch (error) {
    console.error("Fetcher: Error retrieving user token from AsyncStorage:", error);
  }

  try {
    const response = await fetch(finalUrl, {
      headers: {
        ...(fetchOptions.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      ...fetchOptions,
    });

    // --- CRITICAL CHANGE: Read as text first, then explicitly parse as JSON ---
    // This allows us to inspect the raw response exactly as received.
    // It also ensures the response stream is consumed only once by this text() call.
    const rawResponseText = await response.text();
    console.log("Fetcher: RAW Backend Response Text:", rawResponseText); // Log the full raw text for debugging

    let jsonResponse: any;
    try {
      jsonResponse = JSON.parse(rawResponseText); // Attempt to parse the raw text
    } catch (parseError) {
      console.error(
        "Fetcher: JSON Parse Error! Raw Text that failed parsing:",
        rawResponseText,
        "Parse Error Details:",
        parseError
      );
      // If parsing fails, it means the content isn't valid JSON.
      Alert.alert(
        "Response Error",
        "Received unexpected data format from the server. Please try again or contact support."
      );
      // Re-throw the error with more context
      throw new Error(`Invalid JSON response from server. Raw: "${rawResponseText.substring(0, 100)}..."`);
    }
    // --- END CRITICAL CHANGE ---

    // --- Enhanced Error Handling (for HTTP status codes, now using the parsed jsonResponse) ---
    if (!response.ok) {
        console.error(`API Error (${response.status}) from ${finalUrl}:`, jsonResponse);
        Alert.alert(
            "API Error",
            jsonResponse.message || `Request to ${finalUrl} failed with status ${response.status}.`
        );
        // Ensure the error thrown here uses the message from the JSON response if available
        throw new Error(jsonResponse.message || `Request failed with status ${response.status}.`);
    }
    // --- END Enhanced Error Handling ---

    return jsonResponse; // Return the successfully parsed JSON response

  } catch (error: any) {
    console.error("Fetcher: Network or Unhandled Error in fetch process:", error);
    // Only alert if it's a network error or an error not previously alerted by the !response.ok block
    // or by the JSON.parse error block.
    if (!(error instanceof Error && (error.message.includes("API Error") || error.message.includes("Invalid JSON response")))) {
      Alert.alert("Network Error", error.message || "Could not connect to the server or an unexpected error occurred.");
    }
    throw error; // Re-throw the error for component-level handling
  }
};
