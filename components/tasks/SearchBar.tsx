import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // or from 'react-native-vector-icons/FontAwesome'

type SearchBarProps = {
  placeholder: string;
  onSearch: (text: string) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, onSearch }) => {
  const [searchText, setSearchText] = useState('');

  const handleSearch = () => {
    onSearch(searchText.trim());
  };

  return (
    <View style={styles.searchBarContainer}>
      <TextInput
        placeholder={placeholder}
        value={searchText}
        onChangeText={setSearchText}
        style={styles.searchInput}
        placeholderTextColor="#585858"
      />
      <TouchableOpacity onPress={handleSearch} style={styles.iconWrapper}>
        <FontAwesome name="search" size={20} color="#6b7280" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    position: 'relative',
    marginTop: 5,
  },
  searchInput: {
    paddingVertical: 7,
    paddingLeft: 12,
    paddingRight: 40, // make space for icon
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 25,
    fontSize: 16,
    color: '#585858',
    backgroundColor: '#D9D9D9',
  },
iconWrapper: {
  position: 'absolute',
  right: 12,
  top: '43%',
  transform: [{ translateY: -12 }], // use half of actual icon size
  padding: 4,
  justifyContent: 'center',
  alignItems: 'center',
},

});

export default SearchBar;
