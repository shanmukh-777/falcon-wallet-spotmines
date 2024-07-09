// TODO: export this from @aries-framework/anoncreds
import { AnonCredsCredentialMetadataKey } from '@aries-framework/anoncreds/build/utils/metadata'
import { CredentialPreviewAttribute } from '@aries-framework/core'
import { useCredentialById } from '@aries-framework/react-hooks'
import { BrandingOverlay } from '@hyperledger/aries-oca'
import { Attribute, CredentialOverlay } from '@hyperledger/aries-oca/build/legacy'
import { useIsFocused, useNavigation } from '@react-navigation/core'
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DeviceEventEmitter, Dimensions, StyleSheet, Text, TextStyle, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FONT_STYLE_1, FONT_STYLE_2, FONT_STYLE_3, BUTTON_STYLE1, BUTTON_STYLE2 } from './../constants/fonts';

import Button, { ButtonType } from '../components/buttons/Button'
import ConnectionAlert from '../components/misc/ConnectionAlert'
import ConnectionImage from '../components/misc/ConnectionImage'
import CredentialCard from '../components/misc/CredentialCard'
import CommonRemoveModal from '../components/modals/CommonRemoveModal'
import Record from '../components/record/Record'
import { EventTypes } from '../constants'
import { useAnimatedComponents } from '../contexts/animated-components'
import { useConfiguration } from '../contexts/configuration'
import { useNetwork } from '../contexts/network'
import { DispatchAction } from '../contexts/reducers/store'
import { useStore } from '../contexts/store'
import { useTheme } from '../contexts/theme'
import { useTour } from '../contexts/tour/tour-context'
import { useOutOfBandByConnectionId } from '../hooks/connections'
import { BifoldError } from '../types/error'
import { TabStacks, NotificationStackParams, Screens, TabStackParams } from '../types/navigators'
import { ModalUsage } from '../types/remove'
import { TourID } from '../types/tour'
import { useAppAgent } from '../utils/agent'
import { getCredentialIdentifiers, isValidAnonCredsCredential } from '../utils/credential'
import { getCredentialConnectionLabel } from '../utils/helpers'
import { buildFieldsFromAnonCredsCredential } from '../utils/oca'
import { testIdWithKey } from '../utils/testable'
import Document from '../components/falcon/Document'
import AadharSchema from '../components/falcon/AadharSchema'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import CredentialOfferAccept from './CredentialOfferAccept'

type CredentialOfferProps = StackScreenProps<NotificationStackParams, Screens.CredentialOffer>

const CredentialOffer: React.FC<CredentialOfferProps> = ({ navigation, route }) => {
  if (!route?.params) {
    throw new Error('CredentialOffer route prams were not set properly')
  }

  const { credentialId } = route.params

  const { agent } = useAppAgent()
  const { t, i18n } = useTranslation()
  const { TextTheme, ColorPallet } = useTheme()
  const { RecordLoading } = useAnimatedComponents()
  const { assertConnectedNetwork } = useNetwork()
  const { OCABundleResolver, enableTours: enableToursConfig } = useConfiguration()
  const [loading, setLoading] = useState<boolean>(true)
  const [buttonsVisible, setButtonsVisible] = useState(true)
  const [acceptModalVisible, setAcceptModalVisible] = useState(false)
  const [declineModalVisible, setDeclineModalVisible] = useState(false)
  const [overlay, setOverlay] = useState<CredentialOverlay<BrandingOverlay>>({ presentationFields: [] })
  const credential = useCredentialById(credentialId)
  const credentialConnectionLabel = getCredentialConnectionLabel(credential)
  const [store, dispatch] = useStore()
  const { start } = useTour()
  const screenIsFocused = useIsFocused()
  const goalCode = useOutOfBandByConnectionId(credential?.connectionId ?? '')?.outOfBandInvitation.goalCode

  const styles = StyleSheet.create({
    headerTextContainer: {
      paddingHorizontal: 25,
      paddingVertical: 16,
    },
    headerText: {
      ...TextTheme.normal,
      flexShrink: 1,
    },
    footerButton: {
      paddingTop: 10,
      display:'flex',
      flexDirection:'row'
    },
  })

  useEffect(() => {
    const shouldShowTour = enableToursConfig && store.tours.enableTours && !store.tours.seenCredentialOfferTour
    if (shouldShowTour && screenIsFocused) {
      start(TourID.CredentialOfferTour)
      dispatch({
        type: DispatchAction.UPDATE_SEEN_CREDENTIAL_OFFER_TOUR,
        payload: [true],
      })
    }
  }, [screenIsFocused])

  useEffect(() => {
    if (!agent) {
      DeviceEventEmitter.emit(
        EventTypes.ERROR_ADDED,
        new BifoldError(t('Error.Title1035'), t('Error.Message1035'), t('CredentialOffer.CredentialNotFound'), 1035)
      )
    }
  }, [])

  useEffect(() => {
    if (!credential) {
      DeviceEventEmitter.emit(
        EventTypes.ERROR_ADDED,
        new BifoldError(t('Error.Title1035'), t('Error.Message1035'), t('CredentialOffer.CredentialNotFound'), 1035)
      )
    }
  }, [])

  useEffect(() => {
    if (!(credential && isValidAnonCredsCredential(credential))) {
      return
    }

    const updateCredentialPreview = async () => {
      const { ...formatData } = await agent?.credentials.getFormatData(credential.id)
      const { offer, offerAttributes } = formatData
      const offerData = offer?.anoncreds ?? offer?.indy

      if (offerData) {
        credential.metadata.add(AnonCredsCredentialMetadataKey, {
          schemaId: offerData.schema_id,
          credentialDefinitionId: offerData.cred_def_id,
        })
      }

      if (offerAttributes) {
        credential.credentialAttributes = [...offerAttributes.map((item) => new CredentialPreviewAttribute(item))]
      }
    }

    const resolvePresentationFields = async () => {
      const identifiers = getCredentialIdentifiers(credential)
      const attributes = buildFieldsFromAnonCredsCredential(credential)
      const fields = await OCABundleResolver.presentationFields({ identifiers, attributes, language: i18n.language })
      return { fields }
    }

    /**
     * FIXME: Formatted data needs to be added to the record in AFJ extensions
     * For now the order here matters. The credential preview must be updated to
     * add attributes (since these are not available in the offer).
     * Once the credential is updated the presentation fields can be correctly resolved
     */
    setLoading(true)
    updateCredentialPreview()
      .then(() => resolvePresentationFields())
      .then(({ fields }) => {
        setOverlay({ ...overlay, presentationFields: (fields as Attribute[]).filter((field) => field.value) })
        setLoading(false)
      })
  }, [credential])

  const toggleDeclineModalVisible = () => setDeclineModalVisible(!declineModalVisible)

  const handleAcceptTouched = async () => {
    try {
      if (!(agent && credential && assertConnectedNetwork())) {
        return
      }

      setAcceptModalVisible(true)

      await agent.credentials.acceptOffer({ credentialRecordId: credential.id })
    } catch (err: unknown) {
      setButtonsVisible(true)
      const error = new BifoldError(t('Error.Title1024'), t('Error.Message1024'), (err as Error)?.message ?? err, 1024)
      DeviceEventEmitter.emit(EventTypes.ERROR_ADDED, error)
    }
  }
  const navigation2 = useNavigation<StackNavigationProp<TabStackParams>>()

  const handleDeclineTouched = async () => {
    try {
      if (agent && credential) {
        await agent.credentials.declineOffer(credential.id)
        await agent.credentials.sendProblemReport({
          credentialRecordId: credential.id,
          description: t('CredentialOffer.Declined'),
        })
      }

      toggleDeclineModalVisible()
      // navigation.getParent()?.navigate(TabStacks.HomeStack, { screen: Screens.Home })
      navigation2.navigate(TabStacks.CredentialStack,{screen:Screens.ListCredentials})
    } catch (err: unknown) {
      const error = new BifoldError(t('Error.Title1025'), t('Error.Message1025'), (err as Error)?.message ?? err, 1025)
      DeviceEventEmitter.emit(EventTypes.ERROR_ADDED, error)
    }
  }

  const header = () => {
    return (
      <>
        <ConnectionImage connectionId={credential?.connectionId} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText} testID={testIdWithKey('HeaderText')}>
            <Text>{credentialConnectionLabel || t('ContactDetails.AContact')}</Text>{' '}
            {t('CredentialOffer.IsOfferingYouACredential')}
          </Text>
        </View>
        {!loading && credential && (
          <View style={{ marginHorizontal: 15, marginBottom: 16 }}>
            <CredentialCard credential={credential} />
          </View>
        )}
      </>
    )
  }
  const screenHeight = Math.round(Dimensions.get('window').height)

  const getFontSize = () => {
    return screenHeight < 600 ? screenHeight * 0.015 : screenHeight * 0.017
  }

  const footer = () => {
    return (
      <View
        style={{
          paddingHorizontal: 25,
          paddingVertical: 16,
          paddingBottom: 26,
          backgroundColor: ColorPallet.brand.secondaryBackground,
        }}
      >
        {loading ? <RecordLoading /> : null}
        {/* {credentialConnectionLabel && goalCode === 'aries.vc.issue' ? (
          <ConnectionAlert connectionID={credentialConnectionLabel} />
        ) : null} */}
        <View style={styles.footerButton}>
          <Button
            title={t('Global.Accept')}
            accessibilityLabel={t('Global.Accept')}
            testID={testIdWithKey('AcceptCredentialOffer')}
            buttonType={ButtonType.Primary}
            onPress={handleAcceptTouched}
            disabled={!buttonsVisible}
          />
        </View>
        <View style={styles.footerButton}>
          <Button
            title={t('Global.Decline')}
            accessibilityLabel={t('Global.Decline')}
            testID={testIdWithKey('DeclineCredentialOffer')}
            buttonType={ButtonType.Secondary}
            onPress={toggleDeclineModalVisible}
            disabled={!buttonsVisible}
          />
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flexGrow: 1 }} edges={['bottom', 'left', 'right']}>
      <View style={{height:'100%', width:'100%'}}>
      <View style={{display:'flex',flexDirection:'row',alignItems:'center',height:'15%'}} >
            <TouchableOpacity  style={{width:48,height:48,backgroundColor:'white',display:'flex',justifyContent:'center',alignItems:'center',borderRadius:8,margin:'5%',shadowColor: '#212228', shadowOffset: { width: 0, height: 4, }, shadowOpacity: 0.1,shadowRadius: 12, elevation: 4,}}  onPress={ ()=>{navigation2.navigate(TabStacks.CredentialStack,{screen:Screens.ListCredentials})}}>
                <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
            </TouchableOpacity>
            <Text style={{fontSize:16,fontWeight:'bold',color:'black',marginLeft:'4%'}} >Details</Text>
        </View>
        <View style={{height:'70%',display:'flex',alignItems:'center'}}>

        <Document credential={credential} issueDate={Date.now().toString()}  />
        <AadharSchema fields={overlay.presentationFields || []}   /> 
      {/* <Record fields={overlay.presentationFields || []}  footer={footer} /> */}
     

      <CredentialOfferAccept visible={acceptModalVisible} credentialId={credentialId} />
      {/* <CommonRemoveModal
        usage={ModalUsage.CredentialOfferDecline}
        visible={declineModalVisible}
        onSubmit={handleDeclineTouched}
        onCancel={toggleDeclineModalVisible}
        /> */}
        </View>
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignSelf:'center', width: '90%', marginHorizontal: 'auto', marginTop: screenHeight < 600 ? '5%' : '14%' }}>
          <TouchableOpacity style={{ ...BUTTON_STYLE1, borderRadius: 10, backgroundColor: '#F0F5FF', width:'45%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#5869E6', paddingHorizontal: '6%', paddingVertical: '3%' }}  onPress={handleDeclineTouched}>
            <Text style={[ FONT_STYLE_1 as TextStyle, {fontSize: getFontSize(), color: '#5869E6' }]}>Decline</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              ...BUTTON_STYLE2,
              backgroundColor: '#5869E6',
              display: 'flex',
              width:'45%',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
              paddingHorizontal: '6%',
              paddingVertical: '3%'
            }}
            onPress={handleAcceptTouched}// Change onPress handler to onSkipTouched
          >

            <Text style={[FONT_STYLE_1 as TextStyle, {fontSize: getFontSize(), color: 'white' }]}>Add to Wallet</Text>
          </TouchableOpacity>
        </View>
        </View>
    </SafeAreaView>
  )
}

export default CredentialOffer