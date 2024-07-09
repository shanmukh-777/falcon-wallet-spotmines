import { View, Text, TouchableOpacity, Dimensions, Alert,Platform, Permission, Rationale, PermissionsAndroid, Linking,NativeModules } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import RecoverPhrase from '../components/falcon/RecoverPhrase'
import ErrAndSucSt  from '../components/falcon/ErrAndSucSt'
import { BUTTON_STYLE1, BUTTON_STYLE2 } from '../constants/fonts'
import { AuthenticateStackParams, Screens } from '../types/navigators'
import { StackNavigationProp } from '@react-navigation/stack'
import { useAgent } from '@aries-framework/react-hooks'
import { useTranslation } from 'react-i18next'
import { useStore } from '../contexts/store'
import { useTheme } from '../contexts/theme'
import { testIdWithKey } from '../utils/testable'
import Toast from 'react-native-toast-message'
import { ToastType } from '../components/toast/BaseToast'
// import { Clipboard } from 'react-native-clipboard'
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import {DownloadDirectoryPath} from 'react-native-fs'

const RecoveryPhaseScreen = ({ route }) => {
    // const navigation = useNavigation();
    const screenHeight = Math.round(Dimensions.get('window').height);
    const [showDisclosureModal, setShowDisclosureModal] = useState<boolean>(false)

    const { previous } = route.params || {};
    const recoveryPhraseRef = useRef();
    const [copied, setCopied] = useState(false);
    const navigation = useNavigation<StackNavigationProp<AuthenticateStackParams>>();
    const RNFS = require('react-native-fs')
    const [loading, setLoading] = useState(false)
    const [dispatch] = useStore()
    const { t } = useTranslation()
    const { agent } = useAgent()
    const [randomWords, setRandomWords] = useState('hello world 123 567')
    // console.log('----------------',recoveryPhraseRef)

    
const { PermissionFile } = NativeModules;

type PermissionCallback = (error?: string, success?: boolean) => void;

if (PermissionFile) {
  console.log('PermissionFile module is available');
  PermissionFile.checkGrantPermission(
    (err: string) => {
      console.log('Permission Error', err);
    },
    (success: boolean) => {
      console.log('Access granted:', success);
    }
  );
} else {
  console.log('PermissionFile module is not available');
}


// const requestCameraPermission = async () => {
//     try {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
//         {
//           title: 'Cool Photo App Camera Permission',
//           message:
//             'Cool Photo App needs access to your camera ' +
//             'so you can take awesome pictures.',
//           buttonNeutral: 'Ask Me Later',
//           buttonNegative: 'Cancel',
//           buttonPositive: 'OK',
//         },
//       );
//       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//         console.log('You can use the camera');
//       } else  {
//         console.log('Camera permission denied');
//       }
//     } catch (err) {
//       console.warn(err);
//     }
//   };

// // const requestNotificationPermission = async () => {
// //   const result = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
// //   return result;
// // };

  
// // useEffect(()=>{
// //     // console.log(requestNotificationPermission())
// //     // requestCameraPermission()
// //     console.log(getAllExternalFilesDirs())
// // })
// const [extpath,setExtPath]=useState('')
  
// useEffect(() => {
//   // Get the Document Directory Path
//   const documentDirectoryPath = RNFS.DocumentDirectoryPath;
//   console.log('Document Directory Path:', documentDirectoryPath);

//   // Get the Cache Directory Path
//   const cacheDirectoryPath = RNFS.CachesDirectoryPath;
//   console.log('Cache Directory Path:', cacheDirectoryPath);

//   // List all external files directories
//   const getAllExternalFilesDirs = () => {
//     if (Platform.OS === 'android') {
//       RNFS.getAllExternalFilesDirs().then(paths => {
//         console.log('All External Files Directories:', paths);
//         Alert.alert('All External Files Directories:', JSON.stringify(paths));
//         setExtPath(paths)
//       }).catch(err => {
//         console.log(err.message, err.code);
//       });
//     } else {
//       Alert.alert('External Files Directories are available only on Android');
//     }
//   };
//   console.log('-------------',extpath)

//   getAllExternalFilesDirs();
// }, []);

//check if falconid folder is there for backup or else create it and back up into it

    const exportWallet = async () => {
        if (agent) {
          const backupKey = randomWords
          const random = Date.now()
          const backupWalletName = `falconBackup-${random}`//present date and time
          // const path = `${RNFS.DocumentDirectoryPath}/${backupWalletName}`
          // const path = `${RNFS.ExternalStorageDirectoryPath}/${backupWalletName}`
          const path=`${DownloadDirectoryPath}/${backupWalletName}`
      
          console.log('newAgent.wallet', agent.wallet.export, path, agent.config.walletConfig)
    
          agent.wallet
            .export({ path: path, key: backupKey })
            .then((res) => {
              Toast.show({
                type: ToastType.Success,
                text1: 'Wallet exported successfully',
                text2: path,
                visibilityTime: 3000,
                position: 'bottom',
              })
            })
            .catch((err) => {
              console.log('err', err)
            })
        }
      }

  
    const handleTextCopy = () => {
        recoveryPhraseRef.current.copyToClipboard();  // Trigger the copyToClipboard function in RecoverPhrase component
        setCopied(true);
        setTimeout(() => {
            setCopied(false)
        }, 2000);
        // Alert.alert('Copied', 'The recovery phrase has been copied to the clipboard.');
    }

    // const handleNavigation = () => {
    //     if (previous)
    //         navigation.navigate('Settings')
    //     else
    //         navigation.navigate(Screens.Terms)
    // }
    const getFontSizem = () => {
        return screenHeight < 600 ? screenHeight * 0.015 : screenHeight * 0.025;
    };
    const getFontSizel = () => {
        return screenHeight < 600 ? screenHeight * 0.016 : screenHeight * 0.018;
    }



    return (
        <SafeAreaView >
            <View style={{width:'100%',height:'100%',display:'flex',justifyContent:'space-between',alignItems:'center'}} >
                <View style={{width:'100%',paddingTop:screenHeight<600?'10%':'30%',height:'75%',display:'flex',alignItems:'center'}} >
                    <View style={{width:'90%',display:'flex',justifyContent:'center',alignItems:'center'}} >
                        <Text  style={{ fontSize: getFontSizem(),fontWeight:'bold',marginBottom:'2%',color:'black' }}>Recovery Phrase</Text>
                        <Text  style={{ fontSize: getFontSizel() ,alignSelf:'center',color:'#5F5F5F',marginBottom:'10%'}}>Note down the phrase to recover your wallet later.</Text>
                    </View>
                    <RecoverPhrase ref={recoveryPhraseRef} />
                </View>

                {copied && < ErrAndSucSt type={'success'} message={'Copied phrases to clipboard'} />}
                <View style={{width:'90%',height:screenHeight<600?'25%':'20%',display:'flex',justifyContent:'center',alignItems:'center',gap:5}}>
                    <TouchableOpacity  style={{ ...BUTTON_STYLE1 ,backgroundColor:'#F0F5FF',display:'flex',justifyContent:'center',alignItems:'center',borderRadius:12,borderWidth:2,borderColor:'#5869E6',width:'95%',paddingVertical:'4%'}} onPress={handleTextCopy}>
                        <Text style={{ fontSize: getFontSizel() ,color:'#5869E6'}}>Copy phrases to clipboard</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ ...BUTTON_STYLE2,backgroundColor:'#5869E6',display:'flex',justifyContent:'center',alignItems:'center',borderRadius:12,width:'95%',paddingVertical:'4%' }}
                        onPress={exportWallet}>
                        <Text style={{ fontSize: getFontSizel(),color:'white' }}>Back up wallet</Text>
                    </TouchableOpacity>
                </View>



            </View>
        </SafeAreaView >
    )
}

export default RecoveryPhaseScreen





// import { View, Text, TouchableOpacity, Dimensions, Alert, PermissionsAndroid, NativeModules, Linking } from 'react-native'
// import React, { useEffect, useRef, useState } from 'react'
// import { SafeAreaView } from 'react-native-safe-area-context'
// import { useNavigation } from '@react-navigation/native'
// import RecoverPhrase from '../components/falcon/RecoverPhrase'
// import ErrAndSucSt from '../components/falcon/ErrAndSucSt'
// import { BUTTON_STYLE1, BUTTON_STYLE2 } from '../constants/fonts'
// import { AuthenticateStackParams } from '../types/navigators'
// import { StackNavigationProp } from '@react-navigation/stack'
// import { useAgent } from '@aries-framework/react-hooks'
// import { useTranslation } from 'react-i18next'
// import Toast from 'react-native-toast-message'
// import { ToastType } from '../components/toast/BaseToast'

// const RecoveryPhaseScreen = ({ route }) => {
//   const screenHeight = Math.round(Dimensions.get('window').height)
//   const [showDisclosureModal, setShowDisclosureModal] = useState<boolean>(false)
//   const { previous } = route.params || {}
//   const recoveryPhraseRef = useRef()
//   const [copied, setCopied] = useState(false)
//   const navigation = useNavigation<StackNavigationProp<AuthenticateStackParams>>()
//   const RNFS = require('react-native-fs')
//   const [loading, setLoading] = useState(false)
//   const { t } = useTranslation()
//   const { agent } = useAgent()
//   const [randomWords, setRandomWords] = useState('hello world 123 567')
//   const { PermissionFile } = NativeModules

//   const checkStoragePermission = async () => {
//     try {
//       const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
//       console.log('Permission check:', granted)
//       return granted
//     } catch (err) {
//       console.warn('Permission check error:', err)
//       return false
//     }
//   }

//   const requestStoragePermission = async () => {
//     try {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//         {
//           title: 'External Storage Permission',
//           message: 'This app needs access to your external storage to back up the wallet.',
//           buttonNeutral: 'Ask Me Later',
//           buttonNegative: 'Cancel',
//           buttonPositive: 'OK'
//         }
//       )
//       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//         console.log('External storage permission granted')
//         return true
//       } else {
//         console.log('External storage permission denied')
//         return false
//       }
//     } catch (err) {
//       console.warn('Permission request error:', err)
//       return false
//     }
//   }

//   const showPermissionAlert = () => {
//     Alert.alert(
//       'Permission Required',
//       'This app needs access to external storage to back up the wallet. Please enable the permission in the app settings.',
//       [
//         {
//           text: 'Cancel',
//           style: 'cancel'
//         },
//         {
//           text: 'Request Permission Again',
//           onPress: () => requestStoragePermission().then((granted) => {
//             if (!granted) {
//               Alert.alert(
//                 'Permission Denied',
//                 'The app cannot function without the required permissions. Please enable them in the settings.',
//                 [
//                   {
//                     text: 'OK',
//                     onPress: () => Linking.openSettings()
//                   }
//                 ]
//               )
//             }
//           })
//         }
//       ],
//       { cancelable: false }
//     )
//   }

//   const exportWallet = async () => {
//     const hasPermission = await checkStoragePermission()
//     if (!hasPermission) {
//       const requested = await requestStoragePermission()
//       if (!requested) {
//         showPermissionAlert()
//         return
//       }
//     }

//     if (agent) {
//       const backupKey = randomWords
//       const random = Math.floor(Math.random() * 10000)
//       const backupWalletName = `falconBackup-${random}`
//       const path = `${RNFS.ExternalStorageDirectoryPath}/${backupWalletName}`

//       try {
//         const dirExists = await RNFS.exists(RNFS.ExternalStorageDirectoryPath)
//         if (!dirExists) {
//           await RNFS.mkdir(RNFS.ExternalStorageDirectoryPath)
//         }

//         console.log('newAgent.wallet', agent.wallet.export, path, agent.config.walletConfig)
//         await agent.wallet.export({ path: path, key: backupKey })

//         Toast.show({
//           type: ToastType.Success,
//           text1: 'Wallet exported successfully',
//           text2: path,
//           visibilityTime: 3000,
//           position: 'bottom'
//         })
//       } catch (err) {
//         console.log('Error exporting wallet:', err)
//         Toast.show({
//           type: ToastType.Error,
//           text1: 'Error exporting wallet',
//           text2: err.message,
//           visibilityTime: 3000,
//           position: 'bottom'
//         })
//       }
//     }
//   }

//   const handleTextCopy = () => {
//     recoveryPhraseRef.current.copyToClipboard() // Trigger the copyToClipboard function in RecoverPhrase component
//     setCopied(true)
//     setTimeout(() => {
//       setCopied(false)
//     }, 2000)
//   }

//   const getFontSizem = () => {
//     return screenHeight < 600 ? screenHeight * 0.015 : screenHeight * 0.025
//   }
//   const getFontSizel = () => {
//     return screenHeight < 600 ? screenHeight * 0.016 : screenHeight * 0.018
//   }

//   return (
//     <SafeAreaView>
//       <View style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//         <View style={{ width: '100%', paddingTop: screenHeight < 600 ? '10%' : '30%', height: '75%', display: 'flex', alignItems: 'center' }}>
//           <View style={{ width: '90%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//             <Text style={{ fontSize: getFontSizem(), fontWeight: 'bold', marginBottom: '2%', color: 'black' }}>Recovery Phrase</Text>
//             <Text style={{ fontSize: getFontSizel(), alignSelf: 'center', color: '#5F5F5F', marginBottom: '10%' }}>
//               Note down the phrase to recover your wallet later.
//             </Text>
//           </View>
//           <RecoverPhrase ref={recoveryPhraseRef} />
//         </View>

//         {copied && <ErrAndSucSt type={'success'} message={'Copied phrases to clipboard'} />}
//         <View style={{ width: '90%', height: screenHeight < 600 ? '25%' : '20%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 5 }}>
//           <TouchableOpacity
//             style={{ ...BUTTON_STYLE1, backgroundColor: '#F0F5FF', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 12, borderWidth: 2, borderColor: '#5869E6', width: '95%', paddingVertical: '4%' }}
//             onPress={handleTextCopy}
//           >
//             <Text style={{ fontSize: getFontSizel(), color: '#5869E6' }}>Copy phrases to clipboard</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={{ ...BUTTON_STYLE2, backgroundColor: '#5869E6', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 12, width: '95%', paddingVertical: '4%' }}
//             onPress={exportWallet}
//           >
//             <Text style={{ fontSize: getFontSizel(), color: 'white' }}>Back up wallet</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </SafeAreaView>
//   )
// }

// export default RecoveryPhaseScreen
