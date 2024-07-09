import { AnonCredsCredentialMetadataKey } from '@aries-framework/anoncreds/build/utils/metadata'
import { CredentialState } from '@aries-framework/core'
import { useCredentialByState } from '@aries-framework/react-hooks'
import { useNavigation } from '@react-navigation/core'
import { useIsFocused } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, View } from 'react-native'
import Logo from '../assets/icons/Logo.svg'
import CredentialCard from '../components/misc/CredentialCard'
import { useConfiguration } from '../contexts/configuration'
import { DispatchAction } from '../contexts/reducers/store'
import { useStore } from '../contexts/store'
import { useTheme } from '../contexts/theme'
import { useTour } from '../contexts/tour/tour-context'
import { CredentialStackParams, Screens } from '../types/navigators'
import { TourID } from '../types/tour'
import  Logoblue from '../assets/icons/Logoblue.svg'
import { Text, Keyboard, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native'
import { useState } from 'react'
import Document from './../components/falcon/Document'
import InputField from './../components/falcon/InputField'
// import { useNavigation } from '@react-navigation/native'
import EmptyAmico from './../assets/icons/emptyamico.svg';
import Activity from './../assets/icons/activity.svg';
import Search from './../assets/icons/Search.svg';
import {
  credentialTextColor,
  getCredentialIdentifiers,
  isValidAnonCredsCredential,
  toImageSource,
} from '../utils/credential'
import { buildFieldsFromAnonCredsCredential } from '../utils/oca'
import { formatTime, getCredentialConnectionLabel } from '../utils/helpers'

// const ListCredentials: React.FC = () => {
//   const { t } = useTranslation()
//   const [store, dispatch] = useStore()
//   const {
//     credentialListOptions: CredentialListOptions,
//     credentialEmptyList: CredentialEmptyList,
//     enableTours: enableToursConfig,
//     credentialHideList,
//   } = useConfiguration()

//   let credentials = [
//     ...useCredentialByState(CredentialState.CredentialReceived),
//     ...useCredentialByState(CredentialState.Done),
//   ]

//   // Filter out hidden credentials when not in dev mode
//   if (!store.preferences.developerModeEnabled) {
//     credentials = credentials.filter((r) => {
//       const credDefId = r.metadata.get(AnonCredsCredentialMetadataKey)?.credentialDefinitionId
//       return !credentialHideList?.includes(credDefId)
//     })
//   }

//   const navigation = useNavigation<StackNavigationProp<CredentialStackParams>>()
//   const { ColorPallet } = useTheme()
//   const { start, stop } = useTour()
//   const screenIsFocused = useIsFocused()

//   useEffect(() => {
//     const shouldShowTour = enableToursConfig && store.tours.enableTours && !store.tours.seenCredentialsTour

//     if (shouldShowTour && screenIsFocused) {
//       start(TourID.CredentialsTour)
//       dispatch({
//         type: DispatchAction.UPDATE_SEEN_CREDENTIALS_TOUR,
//         payload: [true],
//       })
//     }

//     return stop
//   }, [screenIsFocused])

//   return (
//     <View>
//       <FlatList
//         style={{ backgroundColor: ColorPallet.brand.primaryBackground }}
//         data={credentials.sort((a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf())}
//         keyExtractor={(credential) => credential.id}
//         renderItem={({ item: credential, index }) => {
//           return (
//             <View
//               style={{
//                 marginHorizontal: 15,
//                 marginTop: 15,
//                 marginBottom: index === credentials.length - 1 ? 45 : 0,
//               }}
//             >
//               <CredentialCard
//                 credential={credential}
//                 onPress={() => navigation.navigate(Screens.CredentialDetails, { credential })}
//               />
//             </View>
//           )
//         }}
//         ListEmptyComponent={() => <CredentialEmptyList message={t('Credentials.EmptyList')} />}
//       />
//       <CredentialListOptions />
//     </View>
//   )
// }






interface DocumentData {
  DataName: any;
  issueDate: string;
  icon: boolean;
  background: string;
  right: boolean;
}

const ListCredentials: React.FC = () => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  // const navigation = useNavigation();
  const screenHeight = Math.round(Dimensions.get('window').height);
  // const [docdata, setDocData] = useState<DocumentData[]>([ 
  //   { DataName: "10th grade marksheet", issueDate: "10/9/2023", icon: true, background: "white", right: true },
  // { DataName: "Aadhaar card", issueDate: "10/9/2023", icon: true, background: "white", right: true },
  // { DataName: "Degree certificate-SRM Institute", issueDate: "10/9/2023", icon: true, background: "white", right: true },
  // { DataName: "Indian passport", issueDate: "10/9/2023", icon: true, background: "white", right: true },

  // ]);

  const { t } = useTranslation()
  const [store, dispatch] = useStore()
  const {
    credentialListOptions: CredentialListOptions,
    credentialEmptyList: CredentialEmptyList,
    enableTours: enableToursConfig,
    credentialHideList,
  } = useConfiguration()

  let credentials = [
    ...useCredentialByState(CredentialState.CredentialReceived),
    ...useCredentialByState(CredentialState.Done),
  ]


  // Filter out hidden credentials when not in dev mode
  if (!store.preferences.developerModeEnabled) {
    credentials = credentials.filter((r) => {
      const credDefId = r.metadata.get(AnonCredsCredentialMetadataKey)?.credentialDefinitionId
      return !credentialHideList?.includes(credDefId)
    })
  }

  const navigation = useNavigation<StackNavigationProp<CredentialStackParams>>()
  const { ColorPallet } = useTheme()
  const { start, stop } = useTour()
  const screenIsFocused = useIsFocused()




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
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);


 const credentialdate=(credential:any)=>{
  const dateObject = new Date(credential);

// Extract components of the date
const day = dateObject.getDate();
const month = dateObject.getMonth() + 1; // Month is zero-based, so add 1
const year = dateObject.getFullYear();
const formattedDate = `${day}/${month}/${year}`;
return formattedDate

 }
  
  

  const getFontSizem = () => {
    return screenHeight < 600 ? screenHeight * 0.015 : screenHeight * 0.021;
  };
  const getFontSizel = () => {
    return screenHeight < 600 ? screenHeight * 0.016 : screenHeight * 0.018;
  }

  const handleDocumentPress = (selectedDocument: DocumentData, event: any, index: number) => {
    event.persist();
    // navigation.navigate("VCDetails", {...selectedDocument, index, onDelete: handleDelete });
  };
  // const handleDelete = (index: number) => {
  //   const updatedDocData = [...docdata];
  //   updatedDocData.splice(index, 1);
  //   setDocData(updatedDocData);
  // };

  return (
    <View style={{ width: '100%', height: '100%', display: 'flex' }}>
      {
        credentials.length === 0
          ?
          <View style={{display:'flex',width:'100%',height:'100%'}} >
                        <View style={{width:'100%',height:'11%',display:'flex',flexDirection:'row',alignItems:'flex-end',padding:'5%',backgroundColor:'#F0F5FF'}} >
                            {/* <Logo width={40} height={30} color='#5869E6' /> */}
                            <Logoblue width={40} height={30}/>
                            <Text style={{fontWeight:'bold',color:'black',fontSize:getFontSizem()}}>My Wallet</Text>
                        </View>
                        <View  style={{height:'100%',display:'flex',alignItems:'center',paddingTop:'2%'}}>
                            <InputField type="inputtype1" icon={true} content={"Find my document"} source={Search} />
                            {/* <Image source={emptyamico} className={`${screenHeight < 600 ? 'mt-[3%] mb-0' : 'mt-[15%]  mb-[5%]'}`} /> */}
                            <EmptyAmico style={{ marginTop: screenHeight < 600 ? '3%' : '15%', marginBottom: screenHeight < 600 ? 0 : '5%' }} />
                            <Text  style={{ fontSize: getFontSizem(), color: 'black',fontWeight:'bold' }}>Own your identity!</Text>
                            <Text style={{ fontSize: getFontSizel(),width:'80%',textAlign:'center',color:'#8E8E8E' }}>Scan QR code to contact trusted issuers to own your verifiable credentials.</Text>
                        </View>
                    </View>
          :
          <View style={{ width: '100%', height: '100%' }}>

              <View style={{ width: '100%', height: '11%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', padding: '5%', backgroundColor: '#F0F5FF' }}>
              <Text style={{ fontWeight: 'bold', color: 'black', fontSize: getFontSizem() }}>My Wallet</Text>
              <Activity />
            </View>
            <View  style={{height:'100%',display:'flex',alignItems:'center',paddingTop:'2%'}}>

            <InputField type="inputtype1" icon={true} content={"Find my document"} source={Search} />
            {/* <ScrollView showsVerticalScrollIndicator={false} > */}
                  {/* <FlatList
                    style={{ backgroundColor: ColorPallet.brand.primaryBackground }}
                    data={credentials.sort((a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf())}
                    keyExtractor={(credential) => credential.id}
                    renderItem={({ item: credential, index }) => {
                      return (
                        <View
                          style={{
                            marginHorizontal: 15,
                            marginTop: 15,
                            marginBottom: index === credentials.length - 1 ? 45 : 0,
                          }}
                        >
                          <CredentialCard
                            credential={credential}
                            onPress={() => navigation.navigate(Screens.CredentialDetails, { credential })}
                          />
                        </View>
                      )
                    }}
                    ListEmptyComponent={() => <CredentialEmptyList message={t('Credentials.EmptyList')} />}
                  /> */}
                  {
                    
                credentials.map((credential, index) => (
                  
                  <TouchableOpacity key={index} onPress={() => navigation.navigate(Screens.CredentialDetails, { credential })}>
                    <Document credential={credential} issueDate={credential.createdAt.toDateString()}  />
                  </TouchableOpacity>))
              }
                  {/* <CredentialListOptions /> */}
             

            {/* </ScrollView> */}
            </View>
          </View>
      }
    </View>
  )
}

export default ListCredentials

// credentials.map((key,item)=>(

// ))