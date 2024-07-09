import { View, Text, Image, TouchableOpacity, Dimensions, SafeAreaView, Alert, Platform, PermissionsAndroid, Linking } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import Amico from './../assets/icons/amico.svg'
import { BUTTON_STYLE1 } from '../constants/fonts'
import { BUTTON_STYLE2 } from '../constants/fonts'
import { StackNavigationProp } from '@react-navigation/stack'
import { AuthenticateStackParams, Screens } from '../types/navigators'
// import LocalAuth from 'react-native-local-auth';
// import Geolocation from 'react-native-geolocation-service';



const GeoLocationScreen = () => {
  // const navigation = useNavigation();
  const navigation = useNavigation<StackNavigationProp<AuthenticateStackParams>>()
  const screenHeight = Math.round(Dimensions.get('window').height)


  // useEffect(() => {
  //   requestBiometricAccess();
  //   requestLocationAccess();
  // }, []);

  // const requestBiometricAccess = async () => {
  //   try {
  //     const isSupported = await LocalAuth.isSupported();
  //     if (isSupported) {
  //       const authenticated = await LocalAuth.authenticate({
  //         reason: 'We need to verify your identity',
  //       });
  //       if (!authenticated) {
  //         Alert.alert('Authentication failed', 'Biometric authentication failed');
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Biometric authentication error:', error);
  //   }
  // };

  // const requestLocationAccess = async () => {
  //   if (Platform.OS === 'android') {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //       {
  //         title: 'Location Permission',
  //         message: 'We need access to your location for providing location-based services.',
  //         buttonNeutral: 'Ask Me Later',
  //         buttonNegative: 'Cancel',
  //         buttonPositive: 'OK',
  //       }
  //     );
  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       console.log('Location permission granted');
  //     } else {
  //       Alert.alert(
  //         'Permission denied',
  //         'Location permission was denied. Please enable it from the settings.',
  //         [
  //           { text: 'Cancel', style: 'cancel' },
  //           { text: 'Open Settings', onPress: () => Linking.openSettings() },
  //         ]
  //       );
  //     }
  //   } else {
  //     const authorization = await Geolocation.requestAuthorization('whenInUse');
  //     if (authorization === 'granted') {
  //       console.log('Location permission granted');
  //     } else {
  //       Alert.alert(
  //         'Permission denied',
  //         'Location permission was denied. Please enable it from the settings.',
  //         [
  //           { text: 'Cancel', style: 'cancel' },
  //           { text: 'Open Settings', onPress: () => Linking.openSettings() },
  //         ]
  //       );
  //     }
  //   }
  // };

  const getFontSizem = () => {
    return screenHeight < 600 ? screenHeight * 0.015 : screenHeight * 0.025
  }
  const getFontSizel = () => {
    return screenHeight < 600 ? screenHeight * 0.016 : screenHeight * 0.018
  }
  const getButtonSize = () => {
    return screenHeight < 600 ? screenHeight * 0.016 : screenHeight * 0.017
  }
  return (
    <SafeAreaView>
      <View style={{ width: '100%', height: '100%' }}>
        <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '80%' }}>
          <Text style={{ fontSize: getFontSizem(), color: 'black', fontWeight: 'bold', marginBottom: '2%' }}>
            Your Country
          </Text>
          <Text style={{ fontSize: getFontSizel(), color: '#5F5F5F', marginBottom: '5%' }}>
            Your current location is India
          </Text>
          <Amico width={'100%'} />
        </View>
        <View
          style={{
            borderTopLeftRadius: 20,
            borderTopColor: '#B9B9B9',
            borderTopRightRadius: 20,
            padding: '2%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '20%',
            width: '100%',
            borderWidth: 2,
          }}
        >
          <Text
            style={{
              fontSize: getFontSizel(),
              marginBottom: '5%',
              width: '93%',
              marginHorizontal: 'auto',
              color: 'black',
            }}
          >
            Choose a country or region specific to your location.
          </Text>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '90%',
              gap:5,
              marginHorizontal: 'auto',
            }}
          >
            <TouchableOpacity
              style={{
                ...BUTTON_STYLE1,
                backgroundColor: '#F0F5FF',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#5869E6',
                width: '48%',
                paddingHorizontal: '3%',
                paddingVertical: '3%',
              }}
              onPress={() => {
                navigation.navigate(Screens.LocationScreen, { selectedCountry: null })
              }}
            >
              <Text style={{ fontSize: getButtonSize(), color: '#5869E6' }}>Change country</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                ...BUTTON_STYLE2,
                backgroundColor: '#5869E6',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 12,
                width: '48%',
                padding: '3%',
              }}
              onPress={() => {
                navigation.navigate(Screens.LocationScreen, { selectedCountry: 'India' })
              }}
            >
              <Text style={{ fontSize: getButtonSize(), color: 'white' }}>India</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default GeoLocationScreen