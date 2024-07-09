import { ParamListBase, useNavigation } from '@react-navigation/core'
import { CommonActions } from '@react-navigation/native'
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack'
import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
    AccessibilityInfo,
    Keyboard,
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    findNodeHandle,
    DeviceEventEmitter,
    NativeSyntheticEvent,
    TextInputKeyPressEventData,
    Alert,
    ActivityIndicator,
} from 'react-native'


// import ErrAndSucSt from '../components/falcon/ErrAndSucSt';

// eslint-disable-next-line import/no-named-as-default
import Button, { ButtonType } from '../components/buttons/Button'
import PINInput from '../components/inputs/PINInput'
import AlertModal from '../components/modals/AlertModal'
import KeyboardView from '../components/views/KeyboardView'
import { EventTypes, minPINLength } from '../constants'
import { useAnimatedComponents } from '../contexts/animated-components'
import { useAuth } from '../contexts/auth'
import { useConfiguration } from '../contexts/configuration'
import { DispatchAction } from '../contexts/reducers/store'
import { useStore } from '../contexts/store'
import { useTheme } from '../contexts/theme'
import { BifoldError } from '../types/error'
import { AuthenticateStackParams, Screens } from '../types/navigators'
import { PINCreationValidations, PINValidationsType } from '../utils/PINCreationValidation'
import { testIdWithKey } from '../utils/testable'

import ErrAndSucSt from '../components/falcon/ErrAndSucSt'
import { Dimensions } from 'react-native';
import { useLayoutEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { flatMap } from 'lodash'


interface PINCreateProps extends StackScreenProps<ParamListBase, Screens.CreatePIN> {
    setAuthenticated: (status: boolean) => void;
}

interface ModalState {
    visible: boolean
    title: string
    message: string
    onModalDismiss?: () => void
}

// const PINCreate: React.FC<PINCreateProps> = ({ setAuthenticated, route }) => {
//   const updatePin = (route.params as any)?.updatePin
//   const { setPIN: setWalletPIN, checkPIN, rekeyWallet } = useAuth()
//   const [PIN, setPIN] = useState('')
//   const [PINTwo, setPINTwo] = useState('')
//   const [PINOld, setPINOld] = useState('')
//   const [continueEnabled, setContinueEnabled] = useState(true)
//   const [isLoading, setLoading] = useState(false)
//   const [modalState, setModalState] = useState<ModalState>({
//     visible: false,
//     title: '',
//     message: '',
//   })
//   const iconSize = 24
//   const navigation = useNavigation<StackNavigationProp<AuthenticateStackParams>>()
//   const [store, dispatch] = useStore()
//   const { t } = useTranslation()
//   const { PINSecurity } = useConfiguration()

//   const [PINOneValidations, setPINOneValidations] = useState<PINValidationsType[]>(
//     PINCreationValidations(PIN, PINSecurity.rules)
//   )

//   const { ColorPallet, TextTheme } = useTheme()
//   const { ButtonLoading } = useAnimatedComponents()
//   const PINTwoInputRef = useRef<TextInput>(null)
//   const createPINButtonRef = useRef<TouchableOpacity>(null)
//   const actionButtonLabel = updatePin ? t('PINCreate.ChangePIN') : t('PINCreate.CreatePIN')
//   const actionButtonTestId = updatePin ? testIdWithKey('ChangePIN') : testIdWithKey('CreatePIN')

//   const style = StyleSheet.create({
//     screenContainer: {
//       height: '100%',
//       backgroundColor: ColorPallet.brand.primaryBackground,
//       padding: 20,
//       justifyContent: 'space-between',
//     },

//     // below used as helpful labels for views, no properties needed atp
//     contentContainer: {},
//     controlsContainer: {},
//   })

//   const passcodeCreate = async (PIN: string) => {
//     try {
//       setContinueEnabled(false)
//       await setWalletPIN(PIN)
//       // This will trigger initAgent
//       setAuthenticated(true)

//       dispatch({
//         type: DispatchAction.DID_CREATE_PIN,
//       })

//       // TODO: Navigate back if in settings
//       if (store.preferences.enableWalletNaming) {
//         navigation.dispatch(
//           CommonActions.reset({
//             index: 0,
//             routes: [{ name: Screens.NameWallet }],
//           })
//         )
//       } else {
//         navigation.dispatch(
//           CommonActions.reset({
//             index: 0,
//             // routes: [{ name: Screens.UseBiometry }],
//             routes: [{ name: Screens.Terms }],
//           })
//         )
//       }
//     } catch (err: unknown) {
//       const error = new BifoldError(t('Error.Title1040'), t('Error.Message1040'), (err as Error)?.message ?? err, 1040)
//       DeviceEventEmitter.emit(EventTypes.ERROR_ADDED, error)
//     }
//   }

//   const validatePINEntry = (PINOne: string, PINTwo: string): boolean => {
//     for (const validation of PINOneValidations) {
//       if (validation.isInvalid) {
//         setModalState({
//           visible: true,
//           title: t('PINCreate.InvalidPIN'),
//           message: t(`PINCreate.Message.${validation.errorName}`),
//         })
//         return false
//       }
//     }
//     if (PINOne !== PINTwo) {
//       setModalState({
//         visible: true,
//         title: t('PINCreate.InvalidPIN'),
//         message: t('PINCreate.PINsDoNotMatch'),
//       })
//       return false
//     }
//     return true
//   }

//   const checkOldPIN = async (PIN: string): Promise<boolean> => {
//     const valid = await checkPIN(PIN)
//     if (!valid) {
//       setModalState({
//         visible: true,
//         title: t('PINCreate.InvalidPIN'),
//         message: t(`PINCreate.Message.OldPINIncorrect`),
//       })
//     }
//     return valid
//   }

//   const confirmEntry = async (PINOne: string, PINTwo: string) => {
//     if (!validatePINEntry(PINOne, PINTwo)) {
//       return
//     }

//     await passcodeCreate(PINOne)
//   }
//   useEffect(() => {
//     if (updatePin) {
//       setContinueEnabled(PIN !== '' && PINTwo !== '' && PINOld !== '')
//     }
//   }, [PINOld, PIN, PINTwo])

//   return (
//     <KeyboardView>
//       <View style={style.screenContainer}>
//         <View style={style.contentContainer}>
//           <Text style={[TextTheme.normal, { marginBottom: 16 }]}>
//             <Text style={{ fontWeight: TextTheme.bold.fontWeight }}>
//               {updatePin ? t('PINCreate.RememberChangePIN') : t('PINCreate.RememberPIN')}
//             </Text>{' '}
//             {t('PINCreate.PINDisclaimer')}
//           </Text>
//           {updatePin && (
//             <PINInput
//               label={t('PINCreate.EnterOldPINTitle')}
//               testID={testIdWithKey('EnterOldPIN')}
//               onPINChanged={(p: string) => {
//                 setPINOld(p)
//               }}
//             />
//           )}
//           <PINInput
//             label={t('PINCreate.EnterPINTitle', { new: updatePin ? t('PINCreate.NewPIN') + ' ' : '' })}
//             onPINChanged={(p: string) => {
//               setPIN(p)
//               setPINOneValidations(PINCreationValidations(p, PINSecurity.rules))

//               if (p.length === minPINLength) {
//                 if (PINTwoInputRef && PINTwoInputRef.current) {
//                   PINTwoInputRef.current.focus()
//                   // NOTE:(jl) `findNodeHandle` will be deprecated in React 18.
//                   // https://reactnative.dev/docs/new-architecture-library-intro#preparing-your-javascript-codebase-for-the-new-react-native-renderer-fabric
//                   const reactTag = findNodeHandle(PINTwoInputRef.current)
//                   if (reactTag) {
//                     AccessibilityInfo.setAccessibilityFocus(reactTag)
//                   }
//                 }
//               }
//             }}
//             testID={testIdWithKey('EnterPIN')}
//             accessibilityLabel={t('PINCreate.EnterPIN')}
//             autoFocus={false}
//           />
//           {PINSecurity.displayHelper && (
//             <View style={{ marginBottom: 16 }}>
//               {PINOneValidations.map((validation, index) => {
//                 return (
//                   <View style={{ flexDirection: 'row' }} key={index}>
//                     {validation.isInvalid ? (
//                       <Icon name="clear" size={iconSize} color={ColorPallet.notification.errorIcon} />
//                     ) : (
//                       <Icon name="check" size={iconSize} color={ColorPallet.notification.successIcon} />
//                     )}
//                     <Text style={[TextTheme.normal, { paddingLeft: 4 }]}>
//                       {t(`PINCreate.Helper.${validation.errorName}`)}
//                     </Text>
//                   </View>
//                 )
//               })}
//             </View>
//           )}
//           <PINInput
//             label={t('PINCreate.ReenterPIN', { new: updatePin ? t('PINCreate.NewPIN') + ' ' : '' })}
//             onPINChanged={(p: string) => {
//               setPINTwo(p)
//               if (p.length === minPINLength) {
//                 Keyboard.dismiss()
//                 if (createPINButtonRef && createPINButtonRef.current) {
//                   // NOTE:(jl) `findNodeHandle` will be deprecated in React 18.
//                   // https://reactnative.dev/docs/new-architecture-library-intro#preparing-your-javascript-codebase-for-the-new-react-native-renderer-fabric
//                   const reactTag = findNodeHandle(createPINButtonRef.current)
//                   if (reactTag) {
//                     AccessibilityInfo.setAccessibilityFocus(reactTag)
//                   }
//                 }
//               }
//             }}
//             testID={testIdWithKey('ReenterPIN')}
//             accessibilityLabel={t('PINCreate.ReenterPIN', { new: updatePin ? t('PINCreate.NewPIN') + ' ' : '' })}
//             autoFocus={false}
//             ref={PINTwoInputRef}
//           />
//           {modalState.visible && (
//             <AlertModal
//               title={modalState.title}
//               message={modalState.message}
//               submit={() => {
//                 if (modalState.onModalDismiss) {
//                   modalState.onModalDismiss()
//                 }
//                 setModalState({ ...modalState, visible: false, onModalDismiss: undefined })
//               }}
//             />
//           )}
//         </View>
//         <View style={style.controlsContainer}>
//           <Button
//             title={actionButtonLabel}
//             testID={actionButtonTestId}
//             accessibilityLabel={actionButtonLabel}
//             buttonType={ButtonType.Primary}
//             disabled={!continueEnabled || PIN.length < minPINLength || PINTwo.length < minPINLength}
//             onPress={async () => {
//               setLoading(true)
//               if (updatePin) {
//                 const valid = validatePINEntry(PIN, PINTwo)
//                 if (valid) {
//                   setContinueEnabled(false)
//                   const oldPinValid = await checkOldPIN(PINOld)
//                   if (oldPinValid) {
//                     const success = await rekeyWallet(PINOld, PIN, store.preferences.useBiometry)
//                     if (success) {
//                       setModalState({
//                         visible: true,
//                         title: t('PINCreate.PinChangeSuccessTitle'),
//                         message: t('PINCreate.PinChangeSuccessMessage'),
//                         onModalDismiss: () => {
//                           navigation.navigate(Screens.Settings as never)
//                         },
//                       })
//                     }
//                   }
//                   setContinueEnabled(true)
//                 }
//               } else {
//                 await confirmEntry(PIN, PINTwo)
//               }
//               setLoading(false)
//             }}
//             ref={createPINButtonRef}
//           >
//             {!continueEnabled && isLoading ? <ButtonLoading /> : null}
//           </Button>
//         </View>
//       </View>
//     </KeyboardView>
//   )
// }




// const PINCreate: React.FC<PINCreateProps> = ({ setAuthenticated, route }) => {
//     const navigation = useNavigation<StackNavigationProp<AuthenticateStackParams>>()
//     // const navigation = useNavigation();
//     const screenHeight = Math.round(Dimensions.get('window').height);
//     const [confirm, setConfirm] = useState(false);
//     const getFontSizem = () => {
//         return screenHeight < 600 ? screenHeight * 0.015 : screenHeight * 0.025;
//     };
//     const getFontSizel = () => {
//         return screenHeight < 600 ? screenHeight * 0.016 : screenHeight * 0.018;
//     }
//     const handlePress = () => {
//         console.log('TouchableOpacity pressed');
//         navigation.goBack(); // Verify navigation is defined and working
//     };
//     //   const [store, dispatch] = useStore()


//     //   const updatePin = (route.params as any)?.updatePin
//     // const { setPIN: setWalletPIN, checkPIN, rekeyWallet } = useAuth()
//     // const [PIN, setPIN] = useState('')
//     // const [PINTwo, setPINTwo] = useState('')
//     // const [PINOld, setPINOld] = useState('')
//     // const [continueEnabled, setContinueEnabled] = useState(true)
//     // const [isLoading, setLoading] = useState(false)
//     // const [modalState, setModalState] = useState<ModalState>({
//     //   visible: false,
//     //   title: '',
//     //   message: '',
//     // })
//     // const iconSize = 24
//     // const [store, dispatch] = useStore()
//     // const { t } = useTranslation()
//     // const { PINSecurity } = useConfiguration()

//     // const [PINOneValidations, setPINOneValidations] = useState<PINValidationsType[]>(
//     //   PINCreationValidations(PIN, PINSecurity.rules)
//     // )

//     //   const passcodeCreate = async (PIN: string) => {
//     //         try {
//     //           setContinueEnabled(false)
//     //           await setWalletPIN(PIN)
//     //           // This will trigger initAgent
//     //           setAuthenticated(true)

//     //           dispatch({
//     //             type: DispatchAction.DID_CREATE_PIN,
//     //           })
//     //           navigation.dispatch(
//     //             CommonActions.reset({
//     //               index: 0,
//     //               routes: [{ name: Screens.UseBiometry }],
//     //             })
//     //           )
//     //         } catch (err: unknown) {
//     //           const error = new BifoldError(t('Error.Title1040'), t('Error.Message1040'), (err as Error)?.message ?? err, 1040)
//     //           DeviceEventEmitter.emit(EventTypes.ERROR_ADDED, error)
//     //         }
//     //       }

//     return (
//         <SafeAreaView>
//             {!confirm ? <View style={{ width: '100%', height: '100%', display: 'flex', backgroundColor: 'white' }}>
//                 <TouchableOpacity
//                     style={{
//                         width: 48,
//                         height: 48,
//                         backgroundColor: 'white',
//                         justifyContent: 'center',
//                         alignItems: 'center',
//                         borderRadius: 8,
//                         margin: '8%',
//                     }}
//                     onPress={handlePress}
//                 >
//                     <Icon name="arrow-left" color="black" size={24} />
//                 </TouchableOpacity>
//                 <Text style={{ fontSize: getFontSizem(), fontWeight: 'bold', alignSelf: 'center', color: 'black' }}>Create PIN</Text>
//                 <Text style={{ fontSize: getFontSizel(), alignSelf: 'center', color: '#8E8E8E', marginTop: '2%', marginBottom: '10%' }}>Choose a new pin for authentication</Text>
//                 <PinDots confirm1={confirm} confirm={setConfirm} />
//             </View> :
//                 <View style={{ width: '100%', height: '100%', display: 'flex', backgroundColor: 'white' }}>
//                     <TouchableOpacity style={{ width: 48, height: 48, backgroundColor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 8, margin: '8%' }}>
//                         <Icon name="arrow-left" size={24} color="black" onPress={() => navigation.goBack()} />
//                     </TouchableOpacity>
//                     <Text style={{ fontSize: getFontSizem(), fontWeight: 'bold', alignSelf: 'center', color: 'black' }}>Confirm PIN</Text>
//                     <Text style={{ fontSize: getFontSizel(), alignSelf: 'center', color: '#8E8E8E', marginTop: '2%', marginBottom: '10%' }}>Confirm  pin for authentication</Text>
//                     <PinDots confirm1={confirm} confirm={setConfirm} />
//                 </View>
//             }


//         </SafeAreaView>
//     )
// }

interface PinDotsProps {
  confirm1: boolean;
  confirm: (value: boolean) => void;
  setAuthenticated: (status: boolean) => void;
  updatepin?:any
  pinold?:any
}

const PinDots: React.FC<PinDotsProps> = ({ confirm1, confirm, setAuthenticated,updatepin,pinold}) => {
  const [pin, setPin] = useState('');
  const textInputRef = useRef<TextInput>(null);
  const [createdPin, setCreatedPin] = useState<string | null>(null);
  const [pinConfirm, setPinConfirm] = useState<boolean>(confirm1);
  const [checkConfirmation, setCheckConfirmation] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [newPinCheck,setNewPinCheck]=useState(false)
  const { setPIN: setWalletPIN, checkPIN, rekeyWallet } = useAuth()
  const [PIN, setPIN] = useState('')
  const navigation = useNavigation<StackNavigationProp<AuthenticateStackParams>>()
  const [store, dispatch] = useStore()
  const { t } = useTranslation()
  const { PINSecurity } = useConfiguration()

  const passcodeCreate = async (PIN: string) => {
      try {
          await setWalletPIN(PIN);
          setAuthenticated(true);
          dispatch({
              type: DispatchAction.DID_CREATE_PIN,
          });
          if (store.preferences.enableWalletNaming) {
              navigation.dispatch(
                  CommonActions.reset({
                      index: 0,
                      routes: [{ name: Screens.NameWallet }],
                  })
              );
          } else {
              navigation.dispatch(
                  CommonActions.reset({
                      index: 0,
                      // routes: [{ name: Screens.UseBiometry }],
                      routes: [{ name: Screens.GeoLocationScreen }],
                  })
              );
          }
      } catch (err: unknown) {
          const error = new BifoldError(t('Error.Title1040'), t('Error.Message1040'), (err as Error)?.message?? err, 1040);
          DeviceEventEmitter.emit(EventTypes.ERROR_ADDED, error);
      }
  };

  useEffect(() => {
      if (pinConfirm) {
          textInputRef.current.focus();
          return setPinConfirm(false)
      }
    //   textInputRef.current.focus();

  }, [pinConfirm]);

  const handlePinChange = (newPin: string) => {
      const sanitizedPin = newPin.replace(/[^0-9]/g, '');
      const limitedPin = sanitizedPin.slice(0, 6);
      setPin(limitedPin);
  };

  const handleKeyPress = ({ nativeEvent }: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      const inputKey = nativeEvent.key;
      if (/^\d$/.test(inputKey)) {
          const newPin = (pin + inputKey).slice(0, 6);
          setPin(newPin);
      } else if (inputKey === 'Backspace' && pin.length > 0) {
          setPin(pin.slice(0, -1));
      }
  };
  const checking = async(pin:string) => {
    setNewPinCheck(true)
    if(updatepin )
        {
        if(pin.length === 6 && pin === createdPin)
        {
            const success = await rekeyWallet(pinold, pin, store.preferences.useBiometry)
            if(success)
                {
                    Alert.alert(
                        "Success",
                        "PIN changed successfully",
                        [
                          {
                            text: "OK",
                            onPress: () => navigation.goBack()
                          }
                        ],
                        { cancelable: false }
                      );
                
                }
                setNewPinCheck(false)
        }

        else{
            setShowError(true)
            setNewPinCheck(false)
            setTimeout(() => {
                setShowError(false)
            }, 1000);
        }


    }
    else  {
    if (pin.length === 6 && pin === createdPin) {
        //   console.log("Cr", pin);
          // dispatch(setGlobalPin(pin));
        //   return navigation.navigate(Screens.UseBiometry)
        passcodeCreate(pin)
      }
      else {
          setShowError(true)
          setTimeout(() => {
              setShowError(false)
          }, 1000);
      }
    }
  }

  const confirmation = (pin:string) => {
      setCreatedPin(pin)
      confirm(true)
      setPinConfirm(true)
      setCheckConfirmation(true)
  }

  useEffect(() => {
      // Log the PIN when it reaches six digits
      if (pin.length === 6 && pinConfirm) {
          console.log('PIN:', pin);
          setCreatedPin(pin)
          setPin('')

      }
  }, [pin, pinConfirm]);

  return (
      <>
          <View style={styles.container}>
              <TextInput
                  ref={textInputRef}
                  style={styles.input}
                  keyboardType="numeric"
                  maxLength={6}
                  value={pin}
                  onChangeText={handlePinChange}
                  onKeyPress={handleKeyPress}
                  onSubmitEditing={() => pin.length === 6 ? (checkConfirmation ? checking(pin) : confirmation(pin))
                      : null}
                  autoFocus
                  blurOnSubmit={showError}
              />

              <View style={styles.pinDots}>
                  {[...Array(6)].map((_, index) => (
                      <View
                          key={index}
                          style={[
                              styles.dot,
                              { backgroundColor: pinConfirm ? '#CBCBCC' : index < pin.length ? '#733DF5' : '#CBCBCC' },
                          ]}
                      />
                  ))}
              </View>
              {newPinCheck  && <ActivityIndicator/>}
          </View>
          {showError &&
              <View style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
                  <ErrAndSucSt type="error" message="pin doesn't match" />
                  {/* <Text style={{ color: '#FF0000' }}>{t('Error.Message1040')}</Text> */}
              </View>
          }
      </>
  );
};



const PINCreate: React.FC<PINCreateProps> = ({ setAuthenticated , route }) => {
  const navigation = useNavigation<StackNavigationProp<AuthenticateStackParams>>()
  const screenHeight = Math.round(Dimensions.get('window').height);
  const [confirm, setConfirm] = useState(false);
  const updatePin = (route.params as any)?.updatePin
  const [pincheck,setPinCheck]=useState(false);
  const [update,setUpdate]=useState(updatePin)
  const getFontSizem = () => {
      return screenHeight < 600 ? screenHeight * 0.015 : screenHeight * 0.025;
  };
  const getFontSizel = () => {
      return screenHeight < 600 ? screenHeight * 0.016 : screenHeight * 0.018;
  }

  const handlePress = () => {
      console.log('TouchableOpacity pressed');
      navigation.goBack(); // Verify navigation is defined and working
  };

  const { setPIN: setWalletPIN, checkPIN, rekeyWallet } = useAuth()
  const [PIN, setPIN] = useState('')
  const [store, dispatch] = useStore()
  const { t } = useTranslation()
  const { PINSecurity } = useConfiguration()

  const textInputRef1 = useRef<TextInput>(null);
  const getPinDotsProps = (confirm1: boolean, confirm: (value: boolean) => void) => ({ confirm1, confirm });
  const [modalState, setModalState] = useState<ModalState>({
          visible: false,
          title: '',
          message: '',
        })
        const [showError, setShowError] = useState<boolean>(false);

  const checkOldPIN = async (PIN: string): Promise<boolean> => {
        setPinCheck(true)
        const valid = await checkPIN(PIN)
        
        if (!valid) {
        //   setModalState({
        //     visible: true,
        //     title: t('PINCreate.InvalidPIN'),
        //     message: t(`PINCreate.Message.OldPINIncorrect`),
        //   })
        console.log("not valid")
        setShowError(true)
        setPinCheck(false)
        setTimeout(() => {
            setShowError(false)
        }, 3000);
        }
    else{
        setUpdate(false)
        setPinCheck(false)
    }
        
        return valid
      }
      const handlePinChange = (newPin: string) => {
        const sanitizedPin = newPin.replace(/[^0-9]/g, '');
        const limitedPin = sanitizedPin.slice(0, 6);
        setPin(limitedPin);
    };
      const [pin, setPin] = useState('');

      const handleKeyPress = ({ nativeEvent }: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
        const inputKey = nativeEvent.key;
        if (/^\d$/.test(inputKey)) {
            const newPin = (pin + inputKey).slice(0, 6);
            setPin(newPin);
        } else if (inputKey === 'Backspace' && pin.length > 0) {
            setPin(pin.slice(0, -1));
        }
    };
    

  return (
      <SafeAreaView>

        {
        update ?
        (
        <View style={{ width: '100%', height: '100%', display: 'flex',marginTop:'25%', backgroundColor: 'white' }}>
        <Text style={{ fontSize: getFontSizem(), fontWeight: 'bold', alignSelf: 'center', color: 'black' }}>Enter PIN</Text>
        <Text style={{ fontSize: getFontSizel(), alignSelf: 'center', color: '#8E8E8E', marginTop: '2%', marginBottom: '10%' }}>Enter old pin</Text>
        {/* <PinDots {...getPinDotsProps(confirm, setConfirm)} /> */}
           <View style={styles.container}>
               <TextInput
                    ref={textInputRef1}
                     style={styles.input}
                  keyboardType="numeric"
                   maxLength={6}
                         value={pin}
                         onChangeText={handlePinChange}
                         onKeyPress={handleKeyPress}
                         onSubmitEditing={() => pin.length === 6 && (checkOldPIN(pin))}
                         autoFocus
                         blurOnSubmit={showError}
                     />
       
                  <View style={styles.pinDots}>
                     {[...Array(6)].map((_, index) => (
                             <View
                                 key={index}
                                 style={[
                                     styles.dot,
                                     { backgroundColor : index < pin.length ? '#733DF5' : '#CBCBCC' },
                                 ]}
                             />
                         ))}
                     </View>
                     {pincheck && <ActivityIndicator/>}
                 </View>
                 {showError &&
              <View style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
                  <ErrAndSucSt type="error" message="pin doesn't match" />
                  {/* <Text style={{ color: '#FF0000' }}>{t('Error.Message1040')}</Text> */}
              </View>
          }
                 </View>
                 
                 )
                 
        :
        (
          !confirm ? <View style={{ width: '100%', height: '100%', display: 'flex', backgroundColor: 'white' }}>
              <TouchableOpacity
                  style={{
                      width: 48,
                      height: 48,
                      backgroundColor: 'white',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 8,
                      margin: '8%',
                      shadowColor: '#212228', shadowOffset: { width: 0, height: 4, }, shadowOpacity: 0.1,shadowRadius: 12, elevation: 4,
                  }}
                  onPress={handlePress}
              >
                  <Icon name="arrow-left" color="black" size={24} />
              </TouchableOpacity>
              <Text style={{ fontSize: getFontSizem(), fontWeight: 'bold', alignSelf: 'center', color: 'black' }}>Create PIN</Text>
              <Text style={{ fontSize: getFontSizel(), alignSelf: 'center', color: '#8E8E8E', marginTop: '2%', marginBottom: '10%' }}>Choose a new pin for authentication</Text>
              <PinDots {...getPinDotsProps(confirm, setConfirm)} setAuthenticated={setAuthenticated}/>
          </View> :
              <View style={{ width: '100%', height: '100%', display: 'flex', backgroundColor: 'white' }}>
                  <TouchableOpacity style={{shadowColor: '#212228', shadowOffset: { width: 0, height: 4, }, shadowOpacity: 0.1,shadowRadius: 12, elevation: 4, width: 48, height: 48, backgroundColor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 8, margin: '8%' }}>
                      <Icon name="arrow-left" size={24} color="black" onPress={() => navigation.goBack()} />
                  </TouchableOpacity>
                  <Text style={{ fontSize: getFontSizem(), fontWeight: 'bold', alignSelf: 'center', color: 'black' }}>Create PIN</Text>
                  <Text style={{ fontSize: getFontSizel(), alignSelf: 'center', color: '#8E8E8E', marginTop: '2%', marginBottom: '10%' }}>Confirm the pin for authentication</Text>
                  <PinDots {...getPinDotsProps(confirm, setConfirm)} setAuthenticated={setAuthenticated} updatepin={updatePin} pinold={pin}/>
              </View>
          

        )
    }
      </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
      alignItems: 'center',
  },
  input: {
      position: 'absolute',
      width: 0,
      height: 0,
  },
  pinDots: {
      flexDirection: 'row',
      marginTop: '8%',
  },
  dot: {
      width: 20,
      height: 20,
      borderRadius: 10,
      marginHorizontal: 5}})



export default PINCreate