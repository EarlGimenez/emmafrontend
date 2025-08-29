import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
  Switch,
} from "react-native";

const { width } = Dimensions.get("window");

// --- Variant Types and Interfaces (No changes here) ---

export interface DisasterInfo {
  variant: "disaster";
  type: string;
  location: string;
  severity: string;
  details: string;
}

export interface TrackingInfo {
  variant: "trackingInfo";
  name: string;
  location: string;
}

export interface TrackingTriggerInfo {
  variant: "trackingTrigger";
  title: string;
}

export type MessageData = DisasterInfo | TrackingInfo | TrackingTriggerInfo;

// --- Props ---
interface FlashMessageProps {
  visible: boolean;
  onHide: () => void;
  data: MessageData;
  topOffset?: number;
  onDetailsPress?: () => void; // New prop to notify parent to open modal
}

const FlashMessage: React.FC<FlashMessageProps> = ({
  visible,
  onHide,
  data,
  topOffset = 0,
  onDetailsPress,
}) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    let timer: number;
    const targetPosition = 20 + topOffset;

    if (visible) {
      Animated.timing(slideAnim, {
        toValue: targetPosition,
        duration: 500,
        useNativeDriver: true,
      }).start();

      //   if (data.variant !== 'trackingTrigger') {
      //       timer = setTimeout(() => {
      //         handleHide();
      //       }, 5000);
      //   }
      timer = setTimeout(() => {
        handleHide();
      }, 5000);
    } else {
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }

    return () => clearTimeout(timer);
  }, [visible, slideAnim, data.variant, topOffset]);

  const handleHide = () => {
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 500,
      useNativeDriver: true,
    }).start(() => onHide());
  };

  const handlePress = () => {
    // If it's a disaster variant and the handler exists, call it.
    if (data.variant === "disaster" && onDetailsPress) {
      onDetailsPress();
    }
  };

  const getVariantStyles = () => {
    switch (data.variant) {
    case "disaster":
      return { backgroundColor: "#FFE082", icon: "⚠️" }; // Muted yellow
    case "trackingInfo":
      return { backgroundColor: "#90CAF9", icon: "📍" }; // Muted blue
      case "trackingTrigger":
        return { backgroundColor: "#E0E0E0", icon: "📡" };
      default:
        return { backgroundColor: "#9E9E9E", icon: "🔔" };
    }
  };

  const variantStyle = getVariantStyles();

  const renderContent = () => {
    switch (data.variant) {
      case "disaster":
        return (
          <>
            <Text style={styles.icon}>{variantStyle.icon}</Text>
            <View>
              <Text style={styles.title}>{data.type} Warning</Text>
              <Text style={styles.subtitle}>Tap for more details</Text>
            </View>
          </>
        );
      case "trackingInfo":
        return (
          <>
            <Text style={styles.icon}>{variantStyle.icon}</Text>
            <View>
              <Text style={styles.title}>{data.name} is safe</Text>
              <Text style={styles.subtitle}>Last seen: {data.location}</Text>
            </View>
          </>
        );
      case "trackingTrigger":
        return (
          <>
            <Text style={styles.icon}>{variantStyle.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{data.title}</Text>
            </View>
          </>
        );
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          backgroundColor: variantStyle.backgroundColor,
        },
      ]}
    >
      <Pressable onPress={handlePress} style={styles.pressableContent}>
        {renderContent()}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: (width - width * 0.9) / 2,
    width: "90%",
    borderRadius: 12,
    padding: 16,
    zIndex: 1000,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  pressableContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
  },
});

export default FlashMessage;
