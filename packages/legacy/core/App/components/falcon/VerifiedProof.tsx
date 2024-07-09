import { View, Text, Dimensions, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Attribute, CredentialOverlay, Predicate, Field } from '@hyperledger/aries-oca/build/legacy'
import { formatIfDate, isDataUrl, pTypeToText } from '../../utils/helpers'
import { BrandingOverlay } from '@hyperledger/aries-oca'
import { useTranslation } from 'react-i18next'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import AntDesign from 'react-native-vector-icons/AntDesign'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import { BUTTON_STYLE1 } from './../../constants/fonts';
import { useConfiguration } from '../../contexts/configuration'
import AadharSchema from './AadharSchema'

interface VerifiedProps {
  displayItems?: Field[]
  credDefId?: string
  schemaId: string
}

const VerifiedProof: React.FC<VerifiedProps> = ({ displayItems = [], credDefId, schemaId }) => {
  const [overlay, setOverlay] = useState<CredentialOverlay<BrandingOverlay>>({})
  const attributeTypes = overlay.bundle?.captureBase.attributes
  const attributeFormats: Record<string, string | undefined> = (overlay.bundle as any)?.bundle.attributes
  const { i18n, t } = useTranslation()
  const screenHeight = Math.round(Dimensions.get('window').height)
  const truncateText = true
  const { OCABundleResolver } = useConfiguration()



  const getFontSizem = () => {
    return screenHeight < 600 ? screenHeight * 0.015 : screenHeight * 0.021
  }
  const getFontSizel = () => {
    return screenHeight < 600 ? screenHeight * 0.016 : screenHeight * 0.016
  }

  useEffect(() => {
    const params = {
      identifiers: { schemaId, credentialDefinitionId: credDefId },
      attributes: displayItems,
      language: i18n.language,
    }
    OCABundleResolver.resolveAllBundles(params).then((bundle) => {
      setOverlay({
        ...overlay,
        ...bundle,
        brandingOverlay: bundle.brandingOverlay as BrandingOverlay,
      })
    })
  }, [credDefId, schemaId])

  
//   const parseAttribute = (item: (Attribute & Predicate) | undefined) => {
//     let parsedItem = item
//     if (item && !item.value) {
//       parsedItem = pTypeToText(item, t, attributeTypes) as Attribute & Predicate
//     }
//     const parsedValue = formatIfDate(
//       attributeFormats?.[item?.name ?? ''],
//       parsedItem?.value ?? parsedItem?.pValue ?? null
//     )
//     console.log(parsedValue)
//     return {
//       label: item?.label ?? item?.name ?? '',
//       value: item?.value ? parsedValue : `${parsedItem?.pType} ${parsedValue}`,
//     }
//   }

//   displayItems.map((item) => {
//     const { label, value } = parseAttribute(item as (Attribute & Predicate) | undefined)
//     if (label) {
//       return value ? ` ${label}, ${value}` : ` ${label}`
//     }
//   })
  
  const schemaName= overlay.metaOverlay?.name

  return (
    <View style={{display:'flex',alignItems:'center',marginBottom:'10%'}}>
    <View style={{width:'95%',marginHorizontal:'auto',display:'flex',alignSelf:'center',flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderRadius:15,marginBottom:15,backgroundColor:'white',...BUTTON_STYLE1}}  >
    <View style={{height:'100%',backgroundColor:'#47C2D0',width:'5%',borderTopLeftRadius:15,borderBottomLeftRadius:15,borderWidth:2,borderColor:'white'}} />

    <View style={{padding:screenHeight<600?12:18,display:'flex',flexDirection:'row',width:'95%',justifyContent:'flex-start',alignItems:'center'}} >
    <FontAwesome name="university" size={32} color="black" /> 
        <View style={{display:'flex',justifyContent:'center',alignItems:'flex-start',marginHorizontal:15}}>
            <Text
                style={[{ fontSize: getFontSizem(), color: 'black' }]}
                numberOfLines={truncateText ? 1 : undefined} // Limits to one line if truncateText is true
                ellipsizeMode={truncateText ? "tail" : undefined} // Truncates the text with an ellipsis if truncateText is true
            >
                {/* {DataName} */}
                {/* {overlay.metaOverlay?.name} */}
                {schemaName}
            </Text>
        </View>
        
    </View>
  
    </View>
<AadharSchema fields={displayItems}/>

           
</View>
   
  )
}
export default VerifiedProof
