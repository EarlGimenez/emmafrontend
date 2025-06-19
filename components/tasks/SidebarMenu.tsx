// components/SidebarMenu.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type SidebarMenuProps = {
  activeItem: string;
  onItemPress: (item: string) => void;
};

const SidebarMenu: React.FC<SidebarMenuProps> = ({ activeItem, onItemPress }) => (
  <View style={styles.sidebarContainer}>
    {['Available Tasks', 'My Tasks', 'Submitted Tasks', 'Completed Tasks'].map((item) => (
      <TouchableOpacity
        key={item}
        onPress={() => onItemPress(item)}
        style={[
          styles.menuItem,
          activeItem === item ? styles.activeMenuItem : styles.inactiveMenuItem,
        ]}
      >
        <Text
          style={[
            styles.menuItemText,
            activeItem === item ? styles.activeMenuItemText : styles.inactiveMenuItemText,
          ]}
          // Removed numberOfLines={1} and ellipsizeMode="tail" to allow text to wrap
        >
          {item}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

const styles = StyleSheet.create({
    sidebarContainer: {
      width: '36%',
      backgroundColor: '#FFFFFF',
      paddingVertical: 10,  // Top and Bottom
      paddingHorizontal: 5, // Left and Right
      borderBottomLeftRadius: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
  menuItem: {
    width: '100%',
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginBottom: 6,
    borderRadius: 8,
    justifyContent: 'center',
  },
  activeMenuItem: {
    backgroundColor: '#196490',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inactiveMenuItem: {
    backgroundColor: 'transparent',
  },
  menuItemText: {
    fontSize: 12,
  },
  activeMenuItemText: {
    color: '#fff',
    fontWeight: '600',
  },
  inactiveMenuItemText: {
    color: '#1f2937',
  },
});

export default SidebarMenu;
