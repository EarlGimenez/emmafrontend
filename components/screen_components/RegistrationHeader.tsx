import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../styles/commonStyles';

interface RegistrationHeaderProps {
  title: string;
  onBackPress: () => void;
}

const HEADER_HEIGHT = 140;   // gradient area
const DIP_HEIGHT = 25;       // height of the white “card”
const DIP_RADIUS = 28;       // roundness of the dip
const DIP_OVERLAP = 24;      // how much the white card overlaps the gradient

const RegistrationHeader: React.FC<RegistrationHeaderProps> = ({ title, onBackPress }) => {
  const topPad = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0;

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: topPad + 12 }]}
      >
        {/* Back button (left) */}
        <TouchableOpacity style={styles.backBtn} onPress={onBackPress} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={styles.backTxt}>←</Text>
        </TouchableOpacity>

        {/* Centered title */}
        <Text style={styles.title}>{title}</Text>
      </LinearGradient>

      {/* White “dip” card that overlaps the bottom of the header */}
      <View style={styles.dip} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    // total visible height = header + the part of the card that sticks down
    height: HEADER_HEIGHT + (DIP_HEIGHT - DIP_OVERLAP),
    overflow: 'visible',
  },
  header: {
    height: HEADER_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    // subtle depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  },
  backBtn: {
    position: 'absolute',
    left: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  backTxt: { color: '#fff', fontSize: 22, fontWeight: '600' },
  title: { color: '#fff', fontSize: 24, fontWeight: '700', letterSpacing: 0.3 },

  // The white card that creates the concave "dip"
  dip: {
    position: 'absolute',
    top: HEADER_HEIGHT - DIP_OVERLAP, // overlap the gradient by a bit
    height: DIP_HEIGHT,
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: DIP_RADIUS,
    borderTopRightRadius: DIP_RADIUS,
    // card shadow
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 6 },
    // shadowOpacity: 0.15,
    // shadowRadius: 10,
    elevation: 10,
  },
});

export default RegistrationHeader;
