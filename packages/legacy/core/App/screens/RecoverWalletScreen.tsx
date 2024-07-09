import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Keyboard, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import  Icon  from 'react-native-vector-icons/MaterialCommunityIcons';
import TextAreaField from '../components/inputs/TextAreaField';
import { Screens } from '../types/navigators';

const RecoverWalletScreen: React.FC = () => {
    const screenHeight = Math.round(Dimensions.get('window').height);
    const screenWidth = Math.round(Dimensions.get('window').width);
    const navigation = useNavigation<NavigationProp<any>>();
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [wordCount, setWordCount] = useState(0);

    const handleWordCountChange = (count: number) => {
        setWordCount(count);
    };

    useEffect(() => {
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


    return (
                <SafeAreaView style={styles.safeAreaView}>
          <View style={styles.container}>
          <View>
          <TouchableOpacity
                        style={{
                            width: 48,
                            height: 48,
                            backgroundColor: 'white',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 8,
                            margin: '3%',
                            shadowColor: '#212228', shadowOffset: { width: 0, height: 4, }, shadowOpacity: 0.1,shadowRadius: 12, elevation: 4,
                        }}
                        onPress={() => { navigation.goBack() }}
                    >
                        <Icon name="arrow-left" size={24} color="black" />
                    </TouchableOpacity>
              <Text style={styles.title}>Recovery phrase</Text>
              <Text style={styles.subtitle}>Enter your wallet’s recovery phrase.</Text>
              <View style={styles.textAreaContainer}>
                  <TextAreaField content={'Enter your recovery phrase'} type={'inputtype1'} onWordCountChange={handleWordCountChange} />
              </View>
          </View>
              {!isKeyboardVisible && (
                  <TouchableOpacity
                      style={[styles.proceedButton,
                        {backgroundColor: wordCount !== 12 ? "#F2F2F2" : "#5869E6",}
                      ]}
                      onPress={() => { navigation.navigate(Screens.CreatePIN) }}
                      disabled={wordCount !== 12}
                  >
                      <Text style={[styles.proceedButtonText,
                        {color: wordCount !== 12 ? "#898A8E" : "white",}
                      ]}>Proceed</Text>
                  </TouchableOpacity>
              )}
          </View>
      </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'space-between',
        // alignItems: 'center',
        paddingHorizontal: '5%',
        paddingTop: '10%',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: '3%',
        color: 'black',
    },
    subtitle: {
        fontSize: 16,
        color: '#7D7D7D',
        textAlign: 'center',
        marginBottom: '10%',
    },
    textAreaContainer: {
        width: '100%',
        marginBottom: '10%',
        alignItems:"center",
        color:"black"
    },
    proceedButton: {
        width: '90%',
        height: '8%',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf:'center',
        marginHorizontal:"auto",
        marginBottom: '7%',
    },
    proceedButtonText: {
        fontSize: 18,
    },
});

export default RecoverWalletScreen;
