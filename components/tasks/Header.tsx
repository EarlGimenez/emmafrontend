// components/Header.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import SearchBar from './SearchBar';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // ✅ Import navigation hook

type HeaderProps = {
  title: string;
  onBackPress?: () => void; // Optional now
  onProfilePress: () => void;
  onSearch: (text: string) => void;
};

const Header: React.FC<HeaderProps> = ({ title, onBackPress, onProfilePress, onSearch }) => {
  const navigation = useNavigation<any>();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.navigate('HomeScreen');
    }
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={handleBack} style={styles.iconButton}>
          <Text style={styles.iconText}>&larr;</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onProfilePress} style={styles.iconButton}>
          <View style={styles.iconCircle}>
            <FontAwesome name="user" size={20} color="#1E78AD" />
          </View>
        </TouchableOpacity>
      </View>

      <Text style={styles.headerTitle}>{title}</Text>

      <SearchBar placeholder="Search tasks" onSearch={onSearch} />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 10,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#1E78AD',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 5,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    borderRadius: 9999,
  },
  iconText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'left',
    marginBottom: 8,
    marginLeft: 8,
  },
});

export default Header;
