import { useNavigation } from '@react-navigation/core'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import Button, { ButtonType } from '../components/buttons/Button'
import CheckBoxRow from '../components/inputs/CheckBoxRow'
import HighlightTextBox from '../components/texts/HighlightTextBox'
import InfoTextBox from '../components/texts/InfoTextBox'
import { DispatchAction } from '../contexts/reducers/store'
import { useStore } from '../contexts/store'
import { useTheme } from '../contexts/theme'
import { AuthenticateStackParams, Screens } from '../types/navigators'
import { testIdWithKey } from '../utils/testable'
import ToggleBuutton from '../components/falcon/ToggleBuutton'

import {
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
  TouchableOpacityProps,
  TextStyle
} from 'react-native';
import Pointers from './../components/falcon/Pointers';
// import ToggleBuutton from '../../components/DesignSystem/ToggleBuutton';
import CloudSync from './../assets/icons/cloudsync.svg';
import Google from './../assets/icons/google.svg';
import { FONT_STYLE_1, FONT_STYLE_2, BUTTON_STYLE1, BUTTON_STYLE2 } from './../constants/fonts'
import { useAnimatedComponents } from '../contexts/animated-components'
import { useAuth } from '../contexts/auth'
import Icon from "react-native-vector-icons/AntDesign"

// const Terms: React.FC = () => {
//   const [, dispatch] = useStore()
//   const [checked, setChecked] = useState(false)
//   const { t } = useTranslation()
//   const navigation = useNavigation<StackNavigationProp<AuthenticateStackParams>>()
//   const { OnboardingTheme, TextTheme } = useTheme()
//   const onSubmitPressed = () => {
//     dispatch({
//       type: DispatchAction.DID_AGREE_TO_TERMS,
//     })

//     navigation.navigate(Screens.CreatePIN)
//   }
//   const style = StyleSheet.create({
//     container: {
//       ...OnboardingTheme.container,
//       padding: 20,
//     },
//     bodyText: {
//       ...OnboardingTheme.bodyText,
//       flexShrink: 1,
//     },
//     controlsContainer: {
//       marginTop: 'auto',
//       marginBottom: 20,
//     },
//   })
//   const onBackPressed = () => {
//     //TODO:(jl) goBack() does not unwind the navigation stack but rather goes
//     //back to the splash screen. Needs fixing before the following code will
//     //work as expected.

//     // if (nav.canGoBack()) {
//     //   nav.goBack()
//     // }

//     navigation.navigate(Screens.Onboarding)
//   }

//   return (
//     <SafeAreaView edges={['left', 'right', 'bottom']}>
//       <ScrollView style={[style.container]}>
//         <InfoTextBox>Please agree to the terms and conditions below before using this application.</InfoTextBox>
//         <Text style={[style.bodyText, { marginTop: 20, marginBottom: 20 }]}>
//           <Text style={[style.bodyText, { fontWeight: TextTheme.bold.fontWeight }]}>
//             Lorem ipsum dolor sit amet, consectetur adipiscing elit.
//           </Text>{' '}
//           Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
//           exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit
//           in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
//           proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
//         </Text>
//         <HighlightTextBox>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui</HighlightTextBox>
//         <Text style={[style.bodyText, { marginTop: 20 }]}>
//           Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
//           exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit
//           in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Tempor incididunt ut labore et dolore magna
//           aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
//           consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
//           pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
//           est laborum.
//         </Text>
//         <View style={[style.controlsContainer]}>
//           <CheckBoxRow
//             title={t('Terms.Attestation')}
//             accessibilityLabel={t('Terms.IAgree')}
//             testID={testIdWithKey('IAgree')}
//             checked={checked}
//             onPress={() => setChecked(!checked)}
//           />
//           <View style={[{ paddingTop: 10 }]}>
//             <Button
//               title={t('Global.Continue')}
//               accessibilityLabel={t('Global.Continue')}
//               testID={testIdWithKey('Continue')}
//               disabled={!checked}
//               onPress={onSubmitPressed}
//               buttonType={ButtonType.Primary}
//             />
//           </View>
//           <View style={[{ paddingTop: 10, marginBottom: 20 }]}>
//             <Button
//               title={t('Global.Back')}
//               accessibilityLabel={t('Global.Back')}
//               testID={testIdWithKey('Back')}
//               onPress={onBackPressed}
//               buttonType={ButtonType.Secondary}
//             />
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   )
// }


const Terms: React.FC = () => {
  const [store, dispatch] = useStore()
  const { t } = useTranslation()
  const { isBiometricsActive, commitPIN, disableBiometrics } = useAuth()
  const [biometryAvailable, setBiometryAvailable] = useState(false)
  const [biometryEnabled, setBiometryEnabled] = useState(store.preferences.useBiometry)
  const [continueEnabled, setContinueEnabled] = useState(true)
  const [canSeeCheckPIN, setCanSeeCheckPIN] = useState<boolean>(false)
  const { ColorPallet, TextTheme, Assets } = useTheme()
  const { ButtonLoading } = useAnimatedComponents()

  // const navigation = useNavigation();
  const screenHeight = Math.round(Dimensions.get('window').height);
  const [modalVisible, setModalVisible] = React.useState(false);
  const screenWidth = Math.round(Dimensions.get('window').width);
  const svgWidth = screenWidth * 0.5;
  const [checked, setChecked] = useState(false)
  const navigation = useNavigation<StackNavigationProp<AuthenticateStackParams>>()
  const onSubmitPressed = async() => {
    setContinueEnabled(false)

    await commitPIN(biometryEnabled)
    dispatch({
      type: DispatchAction.DID_AGREE_TO_TERMS,
    })
    dispatch({
      type: DispatchAction.USE_BIOMETRY,
      payload: [biometryEnabled],
    })

    // navigation.navigate(Screens.CreatePIN)
    // navigation.navigate(Screens.UseBiometry)
  }

  const continueTouched = async () => {
    setContinueEnabled(false)

    await commitPIN(biometryEnabled)

    dispatch({
      type: DispatchAction.USE_BIOMETRY,
      payload: [biometryEnabled],
    })
  }


  const handleBackupNow = () => {
    setModalVisible(true);
  };

  const handleContinueBackup = () => {
    setModalVisible(false);
  };

  const handleCancelBackup = () => {
    setModalVisible(false);
  };

  const getFontSizem = () => {
    return screenHeight < 600 ? screenHeight * 0.015 : screenHeight * 0.025;
  };
  const getFontSizel = () => {
    return screenHeight < 600 ? screenHeight * 0.015 : screenHeight * 0.017;
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: screenHeight < 600 ? '5%' : '8%',
      left: screenHeight < 600 ? '10%' : '15%',
      width: screenHeight < 600 ? '70%' : 0,
    },
  });
  const handletogglepress=()=>{
    console.log("togggle clicked")

  }

  const user = {
    name: 'Augustine', 
    email: 'username@gmail.com', 
    profilePicture: 'https://pics.craiyon.com/2023-07-15/dc2ec5a571974417a5551420a4fb0587.webp' 
  }

  return (
    <SafeAreaView>
      <View style={{ width: '100%', height: '100%', position: 'relative' ,backgroundColor:'white'}}>
        <View style={{ width: '100%', height: '40%', backgroundColor: '#5869E6', borderBottomRightRadius: 900, opacity: 0.3 }} />

        <CloudSync style={dynamicStyles.container} />
        <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10%', width: '90%', marginHorizontal: 'auto', height: '30%' }}>
          <Text style={{ ...FONT_STYLE_2 as TextStyle, fontSize: getFontSizem(), color: 'black' }}>Backup your wallet</Text>
          <Pointers />
        </View>
        <View style={{ width: '100%', height: screenHeight < 600 ? '25%' : '30%', paddingHorizontal: '6%' }}>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', height: '50%' }}>
            <ToggleBuutton onPress={handletogglepress}/>
            <Text style={{ ...FONT_STYLE_1 as TextStyle, fontSize: getFontSizel(), color: 'black', marginLeft: '3%' }}>Enable Auto Back Up</Text>
          </View>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 4 }}>
            <TouchableOpacity
              onPress={onSubmitPressed}
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 20, padding: '2%', width: '45%' }}>
              <Text style={{ ...FONT_STYLE_1 as TextStyle, fontSize: getFontSizel(), color: '#5869E6' }}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleBackupNow} style={{ ...BUTTON_STYLE2, backgroundColor: '#5869E6', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 10, width: '45%', padding: '4%' }}>
              <Text style={{ ...FONT_STYLE_1 as TextStyle, fontSize: getFontSizel(), color: 'white' }}>Backup Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', borderBottomWidth: 2, backgroundColor: 'white', borderColor: 'white', width: '100%', padding: '2%' }}> */}
              {/* <Image source={google} resizeMode='contain' style={{ marginRight: '7%' }} /> */}
              {/* <Google />
              <Text style={{ fontSize: getFontSizel(), color: '#5F5F5F', width: '80%' }}>Backup your wallet to Google Drive</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: '2%' }}>
              <Text style={{ ...FONT_STYLE_1 as TextStyle, fontSize: getFontSizel(), color: '#5F5F5F' }}>Backup Now</Text>
              <TouchableOpacity onPress={handleCancelBackup}>
                <Text style={{ ...FONT_STYLE_1 as TextStyle, fontSize: getFontSizel(), color: '#5869E6' }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal> */}

<Modal animationType="slide" transparent={true} visible={modalVisible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <View style={styles.innerheader}>
            <Google />
            <Text style={styles.headerText}>Backup to Google Cloud</Text>
            </View>
            <TouchableOpacity onPress={handleCancelBackup}>
            <Icon name='close' size={20} color="black" />
            </TouchableOpacity>
          </View>
          <View style={styles.userInfo}>
            <Image source={{ uri: user.profilePicture }} style={styles.profilePicture} />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.continueButton}>
            <Text style={styles.continueButtonText}>Continue as {user.name}</Text>
          </TouchableOpacity>
          <Text style={styles.termsText}>
            To create your account, Google will share your name, email address, and profile picture with "MyApp". See "MyApp"'s 
            <Text style={styles.linkText}> privacy policy</Text> and <Text style={styles.linkText}>terms of service</Text>.
          </Text>
        </View>
      </View>
    </Modal>
    </SafeAreaView>
  );
};

// const styles = StyleSheet.create({
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     width: '100%',
//     backgroundColor: 'white',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: '5%',
//     alignItems: 'center',
//   },
// });

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: '5%',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent:"space-between",
    alignItems:"center",
    width:"100%",
    marginBottom: 20,
    paddingBottom:"5%",
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
    paddingHorizontal:"5%",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    backgroundColor: 'white',
  },
  innerheader:{
    flexDirection: "row",
    alignItems:"center"
  },
  headerText: {
    fontSize: 18,
    color: '#5F5F5F',
    marginLeft: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    width:"80%",
    marginBottom: 25,
    marginTop:15,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 10,
  },
  userDetails: {
    flexDirection: 'column',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color:"black"
  },
  userEmail: {
    fontSize: 14,
    color: '#5F5F5F',
  },
  continueButton: {
    backgroundColor: '#1A73E8',
    padding: 10,
    borderRadius: 5,
    textAlign:"center",
    marginBottom: 20,
    width:"80%"
  },
  continueButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  termsText: {
    fontSize: 14,
    color: '#5F5F5F',
    paddingBottom:"5%",
    width:"80%"
  },
  linkText: {
    color: '#4285F4',
  },
});

export default Terms