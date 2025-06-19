// components/FilterDropdown.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// NOTE: A true dropdown in React Native typically uses a Picker component
// or a custom modal/overlay. For simplicity and direct code generation,
// this is a simplified representation. You would replace this with a more
// robust solution like react-native-picker-select or a custom modal.

interface FilterDropdownOption {
  label: string;
  value: string;
}

interface FilterDropdownProps {
  label: string;
  options: FilterDropdownOption[];
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ label, options }) => {
  // For demonstration, we'll just show the label and first option.
  // In a real app, tapping this would open a modal or picker.
  const selectedValue = options.length > 0 ? options[0].label : 'Select';

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}:</Text>
      <TouchableOpacity style={styles.dropdownButton}>
        <Text style={styles.dropdownText}>{selectedValue}</Text>
        <Text style={styles.arrowIcon}>▼</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // flex-1
    minWidth: 120, // min-w-[120px]
  },
  label: {
    fontSize: 13, // text-sm
    fontWeight: '500', // font-medium
    color: '#374151', // text-gray-700
    marginBottom: 4, // mb-1
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: 10, // p-2
    borderWidth: 1,
    borderColor: '#d1d5db', // border-gray-300
    borderRadius: 8, // rounded-lg
    backgroundColor: '#fff', // bg-white
  },
  dropdownText: {
    fontSize: 14,
    color: '#333',
  },
  arrowIcon: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 8,
  },
});

export default FilterDropdown;
