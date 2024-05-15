// import React from 'react';
// import { View, Text, StyleSheet, Dimensions } from 'react-native';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import EvilIcons from 'react-native-vector-icons/EvilIcons';
// import { useNavigation } from '@react-navigation/native';
// import { BUTTON_STYLE1 } from './../../constants/fonts';

// interface DocumentData {
//     DataName: any;
//     issueDate: string;
//     icon: boolean;
//     background: string;
//     right: boolean;
//     truncateText: any;
//   }

// const Document: React.FC<DocumentData> = ({ DataName, issueDate, icon, background, right, truncateText }) => {
//     const navigation = useNavigation();
//     const screenHeight = Math.round(Dimensions.get('window').height);
//     const getFontSizem = () => {
//         return screenHeight < 600 ? screenHeight * 0.015 : screenHeight * 0.021;
//     };
//     const getFontSizel = () => {
//         return screenHeight < 600 ? screenHeight * 0.016 : screenHeight * 0.018;
//     }
//     return (
//         <View style={{width:'93%',marginHorizontal:'auto',display:'flex',alignSelf:'center',flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderRadius:15,marginBottom:15,backgroundColor:background?'white':'none',...BUTTON_STYLE1}}  >
//             <View style={{height:'100%',backgroundColor:'#47C2D0',width:'5%',borderTopLeftRadius:15,borderBottomLeftRadius:15,borderWidth:2,borderColor:'white'}} />

//             <View style={{padding:screenHeight<600?12:18,display:'flex',flexDirection:'row',width:'75%',justifyContent:'flex-start',alignItems:'center'}} >
//                 {icon ? <FontAwesome name="university" size={32} color="black" /> : <View  style={{backgroundColor:'#F2F2F2',borderRadius:900,padding:8,display:'flex',justifyContent:'center',alignItems:'center'}}><AntDesign name="question" size={24} color="black" /></View>}
//                 <View style={{display:'flex',justifyContent:'center',alignItems:'flex-start',marginHorizontal:15}}>
//                     <Text
//                         style={[{ fontSize: getFontSizem(), color: 'black' }]}
//                         numberOfLines={truncateText ? 1 : undefined} // Limits to one line if truncateText is true
//                         ellipsizeMode={truncateText ? "tail" : undefined} // Truncates the text with an ellipsis if truncateText is true
//                     >
//                         {DataName}
//                     </Text>
//                     <Text  style={{ fontSize: getFontSizel(),color:'#898A8E' }}>Issued Data: {issueDate}</Text>
//                 </View>
//             </View>
//             <View  style={{width:'15%',display:'flex',justifyContent:'center',alignItems:'center',marginBottom:'2%'}}>
//                 {right && <EvilIcons name="chevron-right" size={48} color="black" />}
//             </View>
//         </View>
//     );
// };



// export default Document;

import React, {useState , useEffect}from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { useNavigation } from '@react-navigation/native';
import { BUTTON_STYLE1 } from './../../constants/fonts';

import { CredentialExchangeRecord } from '@aries-framework/core'
import { useTranslation } from 'react-i18next'
import { useConfiguration } from '../../contexts/configuration'
import { credentialTextColor, getCredentialIdentifiers, toImageSource } from './../../utils/credential'
import { formatIfDate, getCredentialConnectionLabel, isDataUrl, pTypeToText } from './../../utils/helpers'
import { Attribute, CredentialOverlay, Predicate } from '@hyperledger/aries-oca/build/legacy'
import { BrandingOverlay } from '@hyperledger/aries-oca'



interface DocumentData {
    credential?: CredentialExchangeRecord
    revoked?: boolean
    error?: boolean
    predicateError?: boolean
    elevated?: boolean
    credName?: string
    credDefId?: string
    schemaId?: string
    proofCredDefId?: string
    proofSchemaId?: string
    proof?: boolean
    hasAltCredentials?: boolean
    handleAltCredChange?: () => void


    issueDate?: string;
    icon?: boolean;

  }

const Document: React.FC<DocumentData> = ({ 
    credential,
    revoked,
    schemaId,
    credName,
    credDefId,
    issueDate,
    icon, 
    proof,
   }) => {
    const navigation = useNavigation();
    const screenHeight = Math.round(Dimensions.get('window').height);
    const getFontSizem = () => {
        return screenHeight < 600 ? screenHeight * 0.015 : screenHeight * 0.021;
    };
    const getFontSizel = () => {
        return screenHeight < 600 ? screenHeight * 0.016 : screenHeight * 0.016;
    }


    const truncateText=true
    const right=true
    const { i18n, t } = useTranslation()
    const { OCABundleResolver, getCredentialHelpDictionary } = useConfiguration()
    const [isRevoked, setIsRevoked] = useState<boolean>(credential?.revocationNotification !== undefined)
    const [flaggedAttributes, setFlaggedAttributes] = useState<string[]>()
    const [allPI, setAllPI] = useState<boolean>()
    const credentialConnectionLabel = getCredentialConnectionLabel(credential)
    const [isProofRevoked, setIsProofRevoked] = useState<boolean>(
        credential?.revocationNotification !== undefined && !!proof
    )
    // const [helpAction, setHelpAction] = useState<GenericFn>()
    const [overlay, setOverlay] = useState<CredentialOverlay<BrandingOverlay>>({})


    useEffect(() => {
        const params = {
          identifiers: credential ? getCredentialIdentifiers(credential) : { schemaId, credentialDefinitionId: credDefId },
          attributes: proof ? [] : credential?.credentialAttributes,
          meta: {
            credName: credName,
            credConnectionId: credential?.connectionId,
            alias: credentialConnectionLabel,
          },
          language: i18n.language,
        }
        OCABundleResolver.resolveAllBundles(params).then((bundle) => {
          if (proof) {
            setFlaggedAttributes((bundle as any).bundle.bundle.flaggedAttributes.map((attr: any) => attr.name))
          }
          setOverlay({
            ...overlay,
            ...bundle,
            brandingOverlay: bundle.brandingOverlay as BrandingOverlay,
          })
        })
      }, [credential, i18n.language])

    return (
        <View style={{width:'90%',marginHorizontal:'auto',display:'flex',alignSelf:'center',flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderRadius:15,marginBottom:15,backgroundColor:'white',...BUTTON_STYLE1}}  >
            <View style={{height:'100%',backgroundColor:'#47C2D0',width:'5%',borderTopLeftRadius:15,borderBottomLeftRadius:15,borderWidth:2,borderColor:'white'}} />

            <View style={{padding:screenHeight<600?12:18,display:'flex',flexDirection:'row',width:'75%',justifyContent:'flex-start',alignItems:'center'}} >
                {icon ? <FontAwesome name="university" size={32} color="black" /> : <View  style={{backgroundColor:'#F2F2F2',borderRadius:900,padding:5,display:'flex',justifyContent:'center',alignItems:'center'}}><AntDesign name="question" size={24} color="black" /></View>}
                <View style={{display:'flex',justifyContent:'center',alignItems:'flex-start',marginHorizontal:15}}>
                    <Text
                        style={[{ fontSize: getFontSizem(), color: 'black' }]}
                        numberOfLines={truncateText ? 1 : undefined} // Limits to one line if truncateText is true
                        ellipsizeMode={truncateText ? "tail" : undefined} // Truncates the text with an ellipsis if truncateText is true
                    >
                        {/* {DataName} */}
                        {overlay.metaOverlay?.name}
                    </Text>
                    <Text  style={{ fontSize: getFontSizel(),color:'#898A8E' }}>Issued Data: {issueDate}</Text>
                </View>
            </View>
            <View  style={{width:'15%',display:'flex',justifyContent:'center',alignItems:'center',marginBottom:'2%'}}>
                {right && <EvilIcons name="chevron-right" size={48} color="black" />}
            </View>
        </View>
    );
};



export default Document;
