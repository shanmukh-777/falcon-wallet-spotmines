import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

const Country = ({ onSelect, country }) => {
  console.log('country :', country);
  const [searchTerm, setSearchTerm] = useState('');
  const screenHeight = Math.round(Dimensions.get('window').height);

  const [countries, setCountries] = useState([]);
  const [initialCountries, setInitialCountries] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const getFontSize = () => {
    return screenHeight < 600 ? screenHeight * 0.015 : screenHeight * 0.017;
  };

  const fetchCountries = async () => {
    try {
      const response = await fetch('https://restcountries.com/v2/all');
      const data = await response.json();
      if (data && Array.isArray(data) && data.length > 0) {
        const filteredCountries = data.filter((country) =>
          country.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setCountries(filteredCountries);
        setInitialCountries(filteredCountries.slice(0, 5));
        console.log(filteredCountries);
      } else {
        console.error('Invalid API response structure');
      }
    } catch (error) {
      console.log('Error fetching countries:', error);
    }
  };

  useEffect(() => {
    console.log('else log: ' + country?.name);
    setSearchTerm(country?.name);
  }, [country]);

  useEffect(() => {
    if (country !== 'India') {
      const fetchData = async () => {
        await fetchCountries();
      };
      fetchData();
    }
    else {
      setInitialCountries([]);
    }
  }, [searchTerm]);

  const handleCountrySelect = (country) => {
    setSearchTerm(country?.name);
    setSelectedCountry(country);
    onSelect(country);
    setCountries([]);
  };

  useEffect(() => {
    handleCountrySelect(selectedCountry);
  }, [selectedCountry]);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleCountrySelect(item)}>
      <View style={styles.countryContainer}>
        <Image
          source={{ uri: item?.flags.png }}
          style={styles.flag}
          resizeMode='cover'
        />
        <Text style={{ fontSize: getFontSize(), color: 'black' }}>{item?.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.input}>

        <Icon
          name='location-pin'
          size={24}
          color='blue'
          style={styles.location}
        />

        <TextInput
          placeholder='Enter a Country'
          placeholderTextColor='black'
          autoCapitalize='none'
          value={searchTerm}
          onChangeText={(text) => {
            setSearchTerm(text);
          }}
          style={{ fontSize: getFontSize(), marginBottom:1,color:'black'}}
        />
      </View>

      <FlatList
        data={searchTerm ? countries : initialCountries}
        keyExtractor={(item) => item.alpha3Code}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: '90%',
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 20,
  },
  input: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
  },
  location: {
    marginRight: 15,
  },
  countryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  flag: {
    width: 30,
    height: 20,
    marginRight: 10,
  },
});

export default Country;
