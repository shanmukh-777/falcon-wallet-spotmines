import { View, Text, TouchableOpacity, Image, TextInput, Dimensions, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import  Country from '../components/falcon/Country'
import { useNavigation } from '@react-navigation/native';
import { BUTTON_STYLE2 } from '../constants/fonts';
import Aadhar from './../assets/icons/aadhar.svg';
import { AuthenticateStackParams, Screens } from '../types/navigators';
import { StackNavigationProp } from '@react-navigation/stack';

const LocationScreen = ({ route }) => {
    // const navigation = useNavigation();
    // const select = route.params;
    const navigation = useNavigation<StackNavigationProp<AuthenticateStackParams>>();


    const [selectedCountry, setSelectedCountry] = useState(route.params.selectedCountry);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const screenHeight = Math.round(Dimensions.get('window').height);
    // console.log("selectis", select.selectedCountry)
    useEffect(() => {
        console.log(route.params.selectedCountry);
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false);
            }
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };

    }, []);

    useEffect(() => {
        if (route.params && route.params.selectedCountry) {
            setSelectedCountry({ name: route.params.selectedCountry })
        }
    }, [route.params])

    const handleCountrySelect = (country) => {
        setSelectedCountry(country);
    };
    console.log('Selected Country:', selectedCountry);


    const getFontSizem = () => {
        return screenHeight < 600 ? screenHeight * 0.015 : screenHeight * 0.025;
    };
    const getFontSizel = () => {
        return screenHeight < 600 ? screenHeight * 0.016 : screenHeight * 0.018;
    }
    return (
        <SafeAreaView >
            <View style={{width:'100%',height:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>
                <View style={{width:'100%',height:'85%',display:'flex',alignItems:'center', paddingTop:screenHeight<600?'10%':'30%'}} >
                    <Text style={{ fontSize: getFontSizem(),fontWeight:'bold',marginBottom:'2%',color:'black' }}>Your Country</Text>
                    <Text style={{ fontSize: getFontSizel() ,color:'#5F5F5F',marginBottom:'10%'}}>Search for your Country</Text>
                    <Country onSelect={handleCountrySelect} country={selectedCountry} />
                    {selectedCountry && selectedCountry.name === 'India' && (
                        <View style={{width:'100%',position:'relative'}} >
                            {/* <Image source={aadhar} resizeMode="contain" className="w-full" /> */}
                            <TouchableOpacity onPress={() => navigation.navigate(Screens.AadharScan)}>
                                <Aadhar width={"100%"} />
                            </TouchableOpacity>
                            <TextInput style={{position:'absolute',paddingHorizontal:2,color:'black',paddingVertical:1,right:'10%',width:'55%',top:'50%',fontSize:10,borderWidth:1,borderColor:'#5869E6',borderRadius:5}} placeholder='Enter AAdhar Number' maxLength={12} placeholderTextColor={"black"} />
                        </View>
                    )}

                </View>


                {!isKeyboardVisible && (
                    <TouchableOpacity  disabled={!selectedCountry}  style={{backgroundColor:selectedCountry?'#5869E6':'#B9B9B9', ...BUTTON_STYLE2 ,height:'8%',width:'90%',borderRadius:12,display:'flex',justifyContent:'center',alignItems:'center',marginBottom:'7%',padding:'2%'}} onPress={()=>{navigation.navigate(Screens.LivenessCheck)}}>
                        <Text style={{ fontSize: getFontSizel(),color:selectedCountry?'white':'#5F5F5F' }}>Confirm</Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView >
    )
}

export default LocationScreen