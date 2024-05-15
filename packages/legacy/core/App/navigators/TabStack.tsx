import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Text, useWindowDimensions, View, StyleSheet, KeyboardAvoidingView, Keyboard } from 'react-native'
import { isTablet } from 'react-native-device-info'
import { OrientationType, useOrientationChange } from 'react-native-orientation-locker'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { AttachTourStep } from '../components/tour/AttachTourStep'
import { useConfiguration } from '../contexts/configuration'
import { useNetwork } from '../contexts/network'
import { useTheme } from '../contexts/theme'
import { Screens, Stacks, TabStackParams, TabStacks, ConnectStackParams } from '../types/navigators'
import { TourID } from '../types/tour'
import { testIdWithKey } from '../utils/testable'

import CredentialStack from './CredentialStack'
import HomeStack from './HomeStack'

import { Dimensions, StatusBar } from 'react-native'
import { useEffect } from 'react'
import Navbar from './../components/falcon/Navbar'
// import WalletWithCards from '../WalletDetails/WalletWithCards'
// import LinearGradient from 'react-native-linear-gradient';
// import ContactPage from '../ContactScreens/ContactPage'
// import Settings from '../SettingsScreens/Settings'
import { useIsFocused, useRoute } from '@react-navigation/native'
import SettingStack from './SettingStack'
import WalletWithCards from './../components/falcon/WalletWithCards'
import ListCredentials from './../screens/ListCredentials'
import ContactStack from './../navigators/ContactStack'
import { StackNavigationProp } from '@react-navigation/stack'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import ListContacts from './../screens/ListContacts'
import { CommonActions } from '@react-navigation/native';
import ConnectStack from './ConnectStack'
import RootStack from './RootStack'
import CredentialDetails from '../screens/CredentialDetails'


const TabStack: React.FC = () => {
  const { fontScale } = useWindowDimensions()
  const { useCustomNotifications, enableReuseConnections, enableImplicitInvitations, enableUseMultUseInvitation } =
    useConfiguration()
  const { total } = useCustomNotifications()
  const { t } = useTranslation()
  const Tab = createBottomTabNavigator<TabStackParams>()
  const { assertConnectedNetwork } = useNetwork()
  const { ColorPallet, TabTheme, TextTheme } = useTheme()
  const [orientation, setOrientation] = useState(OrientationType.PORTRAIT)
  const showLabels = fontScale * TabTheme.tabBarTextStyle.fontSize < 18
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const styles = StyleSheet.create({
    tabBarIcon: {
      flex: 1,
      top:'-15%'
    },
  })

  useOrientationChange((orientationType) => {
    setOrientation(orientationType)
  })

  
  const leftMarginForDevice = () => {
    if (isTablet()) {
      return orientation in [OrientationType.PORTRAIT, OrientationType['PORTRAIT-UPSIDEDOWN']] ? 130 : 170
    }

    return 0
  }

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    // <KeyboardAvoidingView>
    <SafeAreaView style={{ flex: 1, backgroundColor: ColorPallet.brand.primary }}>
      <Tab.Navigator
        screenOptions={{
          unmountOnBlur: true,
          tabBarStyle: keyboardVisible ? { display: 'none' } : {  
            // ...TabTheme.tabBarStyle,
           position:'absolute', width: '100%', backgroundColor: 'white', bottom: 0,paddingHorizontal: '5%',paddingVertical:'2%',height:'10%',borderWidth:1,borderTopColor:'#212228'
          },
          tabBarActiveTintColor: TabTheme.tabBarActiveTintColor,
          tabBarInactiveTintColor: TabTheme.tabBarInactiveTintColor,
          header: () => false,
        }}
        // style={{ position: 'absolute', bottom: 0, width: '100%', backgroundColor: 'white' }}

      >
        <Tab.Screen
          name={TabStacks.CredentialStack}
          component={CredentialStack}
          options={{
            headerShown:false,
            // header: () => false,
            tabBarIconStyle: styles.tabBarIcon,
            tabBarIcon: ({ color, focused }) => (
              <AttachTourStep tourID={TourID.HomeTour} index={2}>
                <View style={{ ...TabTheme.tabBarContainerStyle, justifyContent: showLabels ? 'flex-end' : 'center'}}>
                  <Icon name={focused ? 'wallet' : 'wallet-outline'} color={focused?'#5869E6':'black'} size={30} />
                  {showLabels && (
                    <Text
                      style={{
                        ...TabTheme.tabBarTextStyle,
                        // fontSize:14,
                        color: focused ? TabTheme.tabBarActiveTintColor :'black',
                        fontWeight: focused ? TextTheme.bold.fontWeight : TextTheme.normal.fontWeight,
                      }}
                    >
                      {/* {t('TabStack.Credentials')} */}
                      Wallet
                    </Text>
                  )}
                </View>
              </AttachTourStep>
            ),
            tabBarShowLabel: false,
            tabBarAccessibilityLabel: t('TabStack.Credentials'),
            tabBarTestID: testIdWithKey(t('TabStack.Credentials')),
          }}
        />
        <Tab.Screen
          name={TabStacks.ListContacts}
          component={ListContacts}
          options={{
            tabBarIconStyle: styles.tabBarIcon,
            tabBarIcon: ({ color, focused }) => (
              <AttachTourStep tourID={TourID.HomeTour} index={1}>
                <View style={{ ...TabTheme.tabBarContainerStyle, justifyContent: showLabels ? 'flex-end' : 'center' }}>
                  <Feather name={focused ? 'users' : 'users'} color={focused?'#5869E6':'black'} size={30} />

                  {showLabels && (
                    <Text
                      style={{
                        ...TabTheme.tabBarTextStyle,
                        color: focused ? TabTheme.tabBarActiveTintColor : 'black',
                        fontWeight: focused ? TextTheme.bold.fontWeight : TextTheme.normal.fontWeight,
                      }}
                    >
                      {/* {t('TabStack.Home')} */}
                      Contacts
                    </Text>
                  )}
                </View>
              </AttachTourStep>
            ),
            tabBarShowLabel: false,
            tabBarAccessibilityLabel: `${t('TabStack.Home')} (${total ?? 0})`,
            tabBarTestID: testIdWithKey(t('TabStack.Home')),
            tabBarBadge: total || undefined,
            tabBarBadgeStyle: {
              marginLeft: leftMarginForDevice(),
              backgroundColor: ColorPallet.semantic.error,
            },
          }}
        />
        <Tab.Screen
  name={TabStacks.ConnectStack}
  options={{
    tabBarIconStyle: styles.tabBarIcon,
    tabBarIcon: ({ focused }) => (
      <View
        style={{
          position: 'relative',
          flex: 1,
          width: 90,
        }}
      >
        <AttachTourStep tourID={TourID.HomeTour} index={0} fill>
          <View
            style={{
              position: 'absolute',
              flexGrow: 1,
              width: 90,
              bottom: 0,
              minHeight: 90,
              margin: 'auto',
            }}
          >
            <AttachTourStep tourID={TourID.CredentialsTour} index={0} fill>
              <View
                style={{
                  flexGrow: 1,
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}
              >

                  <Ionicons
                    accessible={false}
                    name="scan"
                    color={'black'}
                    size={26}
                    style={{ paddingLeft: 0.5, paddingTop: 0.5 }}
                  />
               
                <Text
                  style={{
                    ...TabTheme.tabBarTextStyle,
                    color: focused ? TabTheme.tabBarActiveTintColor : 'black',
                    marginTop: 5,
                  }}
                >
                  {t('TabStack.Scan')}
                </Text>
              </View>
            </AttachTourStep>
          </View>
        </AttachTourStep>
      </View>
    ),
    tabBarShowLabel: false,
    tabBarAccessibilityLabel: t('TabStack.Scan'),
    tabBarTestID: testIdWithKey(t('TabStack.Scan')),
  }}
  listeners={({ navigation }) => ({
    tabPress: (e) => {
      e.preventDefault()
      if (!assertConnectedNetwork()) {
        return
      }
      navigation.navigate(Stacks.ConnectStack, {
        screen: Screens.Scan,
        params: {
          implicitInvitations: enableImplicitInvitations,
          reuseConnections: enableReuseConnections,
          useMultUseInvitation: enableUseMultUseInvitation,
        },
      })
    },
  })}
>
  {() => <View />}
</Tab.Screen>
        <Tab.Screen
        name={TabStacks.SettingStack}
        component={SettingStack}
        options={{
          tabBarIconStyle: styles.tabBarIcon,
          tabBarIcon: ({ color, focused }) => (
            <AttachTourStep tourID={TourID.HomeTour} index={2}>
              <View style={{ ...TabTheme.tabBarContainerStyle, justifyContent: showLabels ? 'flex-end' : 'center' }}>
                <Feather name={focused ? 'settings' : 'settings'} color={focused?'#5869E6':'black'} size={30} />
                {showLabels && (
                  <Text
                    style={{
                      ...TabTheme.tabBarTextStyle,
                      color: focused ? TabTheme.tabBarActiveTintColor : 'black',
                      fontWeight: focused ? TextTheme.bold.fontWeight : TextTheme.normal.fontWeight,
                    }}
                  >
                    {/* {t('TabStack.Credentials')} */}
                    Settings
                  </Text>
                )}
              </View>
            </AttachTourStep>
          ),
          tabBarShowLabel: false,
          tabBarAccessibilityLabel: t('TabStack.Credentials'),
          tabBarTestID: testIdWithKey(t('TabStack.Credentials')),
        }}
      />
      </Tab.Navigator>
    </SafeAreaView>
    // /</KeyboardAvoidingView>
  )
}

export default TabStack

// const TabStack: React.FC = () => {
//   const [selectedIcon, setSelectedIcon] = useState('wallet')
//   const screenHeight = Math.round(Dimensions.get('window').height)
//   console.log(screenHeight)
//   // const globalPin = useSelector((state) => state.pin);
//   const isFocused = useIsFocused()
//   const route = useRoute()
//   const { fontScale } = useWindowDimensions()
//   const { useCustomNotifications, enableReuseConnections, enableImplicitInvitations, enableUseMultUseInvitation } =
//     useConfiguration()
//   const { total } = useCustomNotifications()
//   const { t } = useTranslation()
//   const Tab = createBottomTabNavigator<TabStackParams>()
//   const { assertConnectedNetwork } = useNetwork()
//   const { ColorPallet, TabTheme, TextTheme } = useTheme()
//   const [orientation, setOrientation] = useState(OrientationType.PORTRAIT)
//   const showLabels = fontScale * TabTheme.tabBarTextStyle.fontSize < 18
//   const navigation = useNavigation<StackNavigationProp<ConnectStackParams>>()

//   // Function to set the selected icon from Navbar
//   const handleIconClick = (iconName: string) => {
//     setSelectedIcon(iconName)
//     // if (iconName === 'scan') {
//     //   <Tab.Screen
//     //     name={TabStacks.ConnectStack}
//     //     options={{
//     //       // tabBarIconStyle: styles.tabBarIcon,
//     //       tabBarIcon: ({ focused }) => (
//     //         <View
//     //           style={{
//     //             position: 'relative',
//     //             flex: 1,
//     //             width: 90,
//     //           }}
//     //         >
//     //           <AttachTourStep tourID={TourID.HomeTour} index={0} fill>
//     //             <View
//     //               style={{
//     //                 position: 'absolute',
//     //                 flexGrow: 1,
//     //                 width: 90,
//     //                 bottom: 0,
//     //                 minHeight: 90,
//     //                 margin: 'auto',
//     //               }}
//     //             >
//     //               <AttachTourStep tourID={TourID.CredentialsTour} index={0} fill>
//     //                 <View
//     //                   style={{
//     //                     flexGrow: 1,
//     //                     justifyContent: 'flex-end',
//     //                     alignItems: 'center',
//     //                   }}
//     //                 >
//     //                   <View
//     //                     accessible={true}
//     //                     accessibilityRole={'button'}
//     //                     accessibilityLabel={t('TabStack.Scan')}
//     //                     style={{ ...TabTheme.focusTabIconStyle }}
//     //                   >
//     //                     <Icon
//     //                       accessible={false}
//     //                       name="qrcode-scan"
//     //                       color={TabTheme.tabBarButtonIconStyle.color}
//     //                       size={32}
//     //                       style={{ paddingLeft: 0.5, paddingTop: 0.5 }}
//     //                     />
//     //                   </View>
//     //                   <Text
//     //                     style={{
//     //                       ...TabTheme.tabBarTextStyle,
//     //                       color: focused ? TabTheme.tabBarActiveTintColor : TabTheme.tabBarInactiveTintColor,
//     //                       marginTop: 5,
//     //                     }}
//     //                   >
//     //                     {t('TabStack.Scan')}
//     //                   </Text>
//     //                 </View>
//     //               </AttachTourStep>
//     //             </View>
//     //           </AttachTourStep>
//     //         </View>
//     //       ),
//     //       tabBarShowLabel: false,
//     //       tabBarAccessibilityLabel: t('TabStack.Scan'),
//     //       tabBarTestID: testIdWithKey(t('TabStack.Scan')),
//     //     }}
//     //     listeners={({ navigation }) => ({
//     //       tabPress: (e: any) => {
//     //         setTimeout(() => {
               
//     //             navigation.navigate(Stacks.ConnectStack, {
//     //               screen: Screens.Scan,
//     //               params: {
//     //                 implicitInvitations: enableImplicitInvitations,
//     //                 reuseConnections: enableReuseConnections,
//     //                 useMultUseInvitation: enableUseMultUseInvitation,
//     //               },
//     //             });
              
//     //         }, 100);
//     //       },
//     //     })}
//     //   >
//     //     {() => <View />}
//     //   </Tab.Screen>
//     // }
//   }


//   useEffect(() => {
//     // If the QRScreen was focused and the user is coming back, set the selectedIcon to 'wallet'
//     if (!isFocused && route.name === 'ListCredentials') {
//       setSelectedIcon('wallet')
//     }
//     console.log(route.params?.selectedIcon)
//   }, [isFocused, route])

//   return (
//     <SafeAreaView style={{ display: 'flex', backgroundColor: '#F0F5FF' }}>
//        {/* {selectedIcon==='scan' && <ConnectStack/>} */}
     
//       {/* {selectedIcon==='scan' &&   <Tab.Screen
//         name={TabStacks.ConnectStack}
//         options={{
//           // tabBarIconStyle: styles.tabBarIcon,
//           tabBarIcon: ({ focused }) => (
//             <View
//               style={{
//                 position: 'relative',
//                 flex: 1,
//                 width: 90,
//               }}
//             >
//               <AttachTourStep tourID={TourID.HomeTour} index={0} fill>
//                 <View
//                   style={{
//                     position: 'absolute',
//                     flexGrow: 1,
//                     width: 90,
//                     bottom: 0,
//                     minHeight: 90,
//                     margin: 'auto',
//                   }}
//                 >
//                   <AttachTourStep tourID={TourID.CredentialsTour} index={0} fill>
//                     <View
//                       style={{
//                         flexGrow: 1,
//                         justifyContent: 'flex-end',
//                         alignItems: 'center',
//                       }}
//                     >
//                       <View
//                         accessible={true}
//                         accessibilityRole={'button'}
//                         accessibilityLabel={t('TabStack.Scan')}
//                         style={{ ...TabTheme.focusTabIconStyle }}
//                       >
//                         <Icon
//                           accessible={false}
//                           name="qrcode-scan"
//                           color={TabTheme.tabBarButtonIconStyle.color}
//                           size={32}
//                           style={{ paddingLeft: 0.5, paddingTop: 0.5 }}
//                         />
//                       </View>
//                       <Text
//                         style={{
//                           ...TabTheme.tabBarTextStyle,
//                           color: focused ? TabTheme.tabBarActiveTintColor : TabTheme.tabBarInactiveTintColor,
//                           marginTop: 5,
//                         }}
//                       >
//                         {t('TabStack.Scan')}
//                       </Text>
//                     </View>
//                   </AttachTourStep>
//                 </View>
//               </AttachTourStep>
//             </View>
//           ),
//           tabBarShowLabel: false,
//           tabBarAccessibilityLabel: t('TabStack.Scan'),
//           tabBarTestID: testIdWithKey(t('TabStack.Scan')),
//         }}
//         listeners={({ navigation }) => ({
//           tabPress: (e: any) => {
//             setTimeout(() => {
               
//                 navigation.navigate(Stacks.ConnectStack, {
//                   screen: Screens.Scan,
//                   params: {
//                     implicitInvitations: enableImplicitInvitations,
//                     reuseConnections: enableReuseConnections,
//                     useMultUseInvitation: enableUseMultUseInvitation,
//                   },
//                 });
              
//             }, 100);
//           },
//         })}
//       >
//         {() => <View />}
//       </Tab.Screen>} */}
//       {/* <LinearGradient
//         colors={['#F0F5FF', '#FFFFFF']}
//         style={{ flex: 1 }}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 0.3, y: 0.3 }}
//       ></LinearGradient> */}
//       <View style={{ width: '100%', height: '100%', backgroundColor: 'white' }}>
//         <View style={{ width: '100%', height: screenHeight < 600 ? '74%' : '79%' }}>
//           {/* {selectedIcon === 'wallet' && <WalletWithCards/>} */}
//           {selectedIcon === 'wallet' && <ListCredentials />}
//           {/* {selectedIcon === 'contacts' && <ContactStack /> } */}
//           {selectedIcon === 'contacts' && <ListContacts navigation={navigation as any} />}
//           {selectedIcon === 'settings' && <SettingStack />}
         
//           <Tab.Navigator
//         screenOptions={{
//           unmountOnBlur: true,
//           tabBarStyle: {
//             ...TabTheme.tabBarStyle,
//           },
//           tabBarActiveTintColor: TabTheme.tabBarActiveTintColor,
//           tabBarInactiveTintColor: TabTheme.tabBarInactiveTintColor,
//           header: () => null,
//         }}
//       >
//        <Tab.Screen
//         name={TabStacks.ConnectStack}
//         options={{
//           // tabBarIconStyle: styles.tabBarIcon,
//           tabBarIcon: ({ focused }) => (
//             <View
//               style={{
//                 position: 'relative',
//                 flex: 1,
//                 width: 90,
//               }}
//             >
//               <AttachTourStep tourID={TourID.HomeTour} index={0} fill>
//                 <View
//                   style={{
//                     position: 'absolute',
//                     flexGrow: 1,
//                     width: 90,
//                     bottom: 0,
//                     minHeight: 90,
//                     margin: 'auto',
//                   }}
//                 >
//                   <AttachTourStep tourID={TourID.CredentialsTour} index={0} fill>
//                     <View
//                       style={{
//                         flexGrow: 1,
//                         justifyContent: 'flex-end',
//                         alignItems: 'center',
//                       }}
//                     >
//                       <View
//                         accessible={true}
//                         accessibilityRole={'button'}
//                         accessibilityLabel={t('TabStack.Scan')}
//                         style={{ ...TabTheme.focusTabIconStyle }}
//                       >
//                         <Icon
//                           accessible={false}
//                           name="qrcode-scan"
//                           color={TabTheme.tabBarButtonIconStyle.color}
//                           size={32}
//                           style={{ paddingLeft: 0.5, paddingTop: 0.5 }}
//                         />
//                       </View>
//                       <Text
//                         style={{
//                           ...TabTheme.tabBarTextStyle,
//                           color: focused ? TabTheme.tabBarActiveTintColor : TabTheme.tabBarInactiveTintColor,
//                           marginTop: 5,
//                         }}
//                       >
//                         {t('TabStack.Scan')}
//                       </Text>
//                     </View>
//                   </AttachTourStep>
//                 </View>
//               </AttachTourStep>
//             </View>
//           ),
//           tabBarShowLabel: false,
//           tabBarAccessibilityLabel: t('TabStack.Scan'),
//           tabBarTestID: testIdWithKey(t('TabStack.Scan')),
//         }}
//         listeners={({ navigation }) => ({
//           tabPress: (e: any) => {
//             setTimeout(() => {
               
//                 navigation.navigate(Stacks.ConnectStack, {
//                   screen: Screens.Scan,
//                   params: {
//                     implicitInvitations: enableImplicitInvitations,
//                     reuseConnections: enableReuseConnections,
//                     useMultUseInvitation: enableUseMultUseInvitation,
//                   },
//                 });
              
//             }, 100);
//           },
//         })}
//       >
//         {() => <View />}
//       </Tab.Screen>
//       </Tab.Navigator>
//         </View>
//         {/* <Navbar handleIconClick={handleIconClick} icon={route.params?.selectedIcon} /> */}
//       </View>
//     </SafeAreaView>
    


//   )
// }

// export default TabStack
