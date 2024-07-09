import { ConnectionRecord, ConnectionType } from '@aries-framework/core'
import { useConnections } from '@aries-framework/react-hooks'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, StyleSheet, View } from 'react-native'

import HeaderButton, { ButtonLocation } from '../components/buttons/HeaderButton'
import ContactListItem from '../components/listItems/ContactListItem'
import EmptyListContacts from '../components/misc/EmptyListContacts'
import { useConfiguration } from '../contexts/configuration'
import { useStore } from '../contexts/store'
import { useTheme } from '../contexts/theme'
import { ContactStackParams, Screens, Stacks } from '../types/navigators'
import { testIdWithKey } from '../utils/testable'
import  Logoblue from '../assets/icons/Logoblue.svg'

import { Text, Keyboard, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import InputField from './../components/falcon/InputField'
import Navbar from './../components/falcon/Navbar'
import Search from './../assets/icons/Search.svg'
import emptyamico from './../assets/icons/emptyamico.svg'
// import university  from './../assets/icons/university.svg'
import ChatLog from './../components/falcon/ChatLog'
import EmptyContact from './../assets/icons/emptycontact.svg'
import Activity from './../assets/icons/activity.svg'
import { useFocusEffect, useNavigation } from '@react-navigation/core'


interface ListContactsProps {
    navigation: StackNavigationProp<ContactStackParams, Screens.Contacts>
}

// const ListContacts: React.FC<ListContactsProps> = ({ navigation }) => {
//   const { ColorPallet } = useTheme()
//   const { t } = useTranslation()
//   const style = StyleSheet.create({
//     list: {
//       backgroundColor: ColorPallet.brand.secondaryBackground,
//     },
//     itemSeparator: {
//       backgroundColor: ColorPallet.brand.primaryBackground,
//       height: 1,
//       marginHorizontal: 16,
//     },
//   })
//   const { records } = useConnections()
//   const [store] = useStore()
//   const { contactHideList } = useConfiguration()
//   // Filter out mediator agents and hidden contacts when not in dev mode
//   let connections: ConnectionRecord[] = records
//   if (!store.preferences.developerModeEnabled) {
//     connections = records.filter((r) => {
//       return (
//         !r.connectionTypes.includes(ConnectionType.Mediator) &&
//         !contactHideList?.includes((r.theirLabel || r.alias) ?? '')
//       )
//     })
//   }

//   const onPressAddContact = () => {
//     navigation.getParent()?.navigate(Stacks.ConnectStack, { screen: Screens.Scan, params: { defaultToConnect: true } })
//   }

//   useEffect(() => {
//     if (store.preferences.useConnectionInviterCapability) {
//       navigation.setOptions({
//         headerRight: () => (
//           <HeaderButton
//             buttonLocation={ButtonLocation.Right}
//             accessibilityLabel={t('Contacts.AddContact')}
//             testID={testIdWithKey('AddContact')}
//             onPress={onPressAddContact}
//             icon="plus-circle-outline"
//           />
//         ),
//       })
//     } else {
//       navigation.setOptions({
//         headerRight: () => false,
//       })
//     }
//   }, [store.preferences.useConnectionInviterCapability])

//   return (
//     <View>
//       <FlatList
//         style={style.list}
//         data={connections}
//         ItemSeparatorComponent={() => <View style={style.itemSeparator} />}
//         keyExtractor={(connection) => connection.id}
//         renderItem={({ item: connection }) => <ContactListItem contact={connection} navigation={navigation} />}
//         ListEmptyComponent={() => <EmptyListContacts navigation={navigation} />}
//       />
//     </View>
//   )
// }


    const ListContacts: React.FC<ListContactsProps> = ({ navigation }) => {
    const screenHeight = Math.round(Dimensions.get('window').height)
    const [keyboardVisible, setKeyboardVisible] = useState(false)

    // const [contactData, setContactData] = useState([
    //     { contact: "Srishti Manipal insthgf", noofmessages: "1", messages: true, image: university },
    //     { contact: "Srishti Manipal Institute", noofmessages: "1", messages: true, image:  },
    // ])

    const getFontSizeM = (): number => {
        return screenHeight < 600 ? screenHeight * 0.015 : screenHeight * 0.021
    }
    const getFontSizeL = (): number => {
        return screenHeight < 600 ? screenHeight * 0.016 : screenHeight * 0.018
    }
 
    const { ColorPallet } = useTheme()
    const { t } = useTranslation()
    const { records } = useConnections()
    const [store] = useStore()
    const { contactHideList } = useConfiguration()
    let connections: ConnectionRecord[] = records
    if (!store.preferences.developerModeEnabled) {
        connections = records.filter((r) => {
          return (
            !r.connectionTypes.includes(ConnectionType.Mediator) &&
            !contactHideList?.includes((r.theirLabel || r.alias) ?? '')
          )
        })
      }

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true)
            }
        )
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false)
            }
        )

        return () => {
            keyboardDidShowListener.remove()
            keyboardDidHideListener.remove()
        }
    }, [])

    return (
        //   <View style={{ width: '100%', height: '100%', display: 'flex' }}>
        //       {contactData.length === 0 ?
        //           <View style={{ display: 'flex', width: '100%', height: '100%' }}>
        //               <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: '15%', padding: '5%', backgroundColor: '#F0F5FF' }}>
        //                   <Text style={{ fontWeight: 'bold', fontSize: getFontSizeM(), color: 'black' }}>My Contacts</Text>
        //                   <Activity />
        //               </View>
        //               <View style={{ height: '100%', display: 'flex', alignItems: 'center', paddingTop: '2%' }}>
        //                   <InputField type="inputtype1" icon={true} content={"Find my documnet"} source={Search} />
        //                   <EmptyContact style={{ marginTop: screenHeight < 600 ? '3%' : '15%', marginBottom: screenHeight < 600 ? 0 : '5%' }} />
        //                   {/* <Image source={emptyamico} className={`${screenHeight < 600 ? 'mt-[3%] mb-0' : 'mt-[15%]  mb-[5%]'}`} /> */}
        //                   <Text style={{ fontSize: getFontSizeM(), color: 'black' }}>No Contacts Found</Text>
        //               </View>
        //           </View>
        //           :
        //           <View style={{ display: 'flex', width: '100%', height: '100%' }}>
        //               <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: '15%', padding: '5%', backgroundColor: '#F0F5FF' }}>
        //                   <Text style={{ fontWeight: 'bold', fontSize: getFontSizeM(), color: 'black' }}>My Contacts</Text>
        //                   <Activity />
        //               </View>
        //               <View style={{ height: '85%', width: '100%', display: 'flex', overflow: 'scroll' }}>
        //                   <ScrollView showsVerticalScrollIndicator={false}>
        //                       {connections.map((connection, index) => {
        //                           return (
        //                               <TouchableOpacity key={index} style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '5%' }}>
        //                                   <Image source={university} style={{ width: 50, height: 50, borderRadius: 50 }} />
        //                                   <View style={{ width: '80%', display: 'flex', flexDirection: 'column', marginLeft: '5%' }}>
        //                                       <Text style={{ fontWeight: 'bold', fontSize: getFontSizeL(), color: 'black' }}>{connection.contact}</Text>
        //                                       <Text style={{ fontSize: getFontSizeM(), color: 'black' }}>{'1'} messages</Text>
        //                                   </View>
        //                                   {true &&
        //                                       <View style={{ width: '10%', display: 'flex', alignItems: 'flex-end' }}>
        //                                           <ChatLog />
        //                                       </View>
        //                                   }
        //                               </TouchableOpacity>
        //                           )
        //                       })}
        //                   </ScrollView>
        //               </View>
        //           </View>
        //       }
        //   </View>

        <View style={{ width: '100%', height: '100%', display: 'flex' }} >
            {connections.length == 0 ?
                <View style={{ display: 'flex', width: '100%', height: '100%' }} >
                    <View style={{ width: '100%', display: 'flex', flexDirection: 'row',  alignItems: 'flex-end', height: '11%', padding: '5%', backgroundColor: '#F0F5FF' }} >
                    <Logoblue width={40} height={30}/>
                        <Text style={{ fontWeight: 'bold', fontSize: getFontSizeM(), color: 'black' }}>My Contacts</Text>
                        {/* <Activity /> */}
                    </View>
                    <View style={{ height: '100%', display: 'flex', alignItems: 'center', paddingTop: '2%' }}>
                        <InputField type="inputtype1" icon={true} content={"Find my documnet"} source={Search} />
                        <EmptyContact style={{ marginTop: screenHeight < 600 ? '3%' : '15%', marginBottom: screenHeight < 600 ? 0 : '5%' }} />
                        {/* <Image source={emptyamico} className={`${screenHeight < 600 ? 'mt-[3%] mb-0' : 'mt-[15%]  mb-[5%]'}`} /> */}
                        <Text style={{ fontSize: getFontSizeM(), color: 'black', fontWeight: 'bold' }}>Own your identity!</Text>
                        <Text style={{ fontSize: getFontSizeL(), textAlign: 'center', width: '80%', color: '#8E8E8E' }}>Scan QR code to form new contacts to exchange information securely.</Text>
                    </View>
                </View>
                :
                <View style={{ width: '100%', height: '100%' }}>
                    <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: '11%', padding: '5%', backgroundColor: '#F0F5FF' }} >
                        
                        <Text style={{ fontSize: getFontSizeM(), color: 'black', fontWeight: 'bold' }}>My Contacts</Text>
                        <Activity />
                    </View>
                    <View style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', marginTop: '2%' }}>

                        <InputField type="inputtype1" icon={true} content={"Find my document"} source={Search} />
                        <ScrollView showsVerticalScrollIndicator={false} >
                            {
                                connections.map((connection, index) => (
                                    <TouchableOpacity key={index}>
                                        <ChatLog contact={connection} noofmessages={2} messages={true} truncateText={true} navigation={navigation} />
                                    </TouchableOpacity>))
                            }
                        </ScrollView>
                    </View>

                </View>
        
            }

        </View>
    )
}

export default ListContacts