// TODO: export this from @aries-framework/anoncreds
import { AnonCredsCredentialMetadataKey } from '@aries-framework/anoncreds/build/utils/metadata'
import { CredentialPreviewAttribute } from '@aries-framework/core'
import { useCredentialById } from '@aries-framework/react-hooks'
import { BrandingOverlay } from '@hyperledger/aries-oca'
import { Attribute, CredentialOverlay } from '@hyperledger/aries-oca/build/legacy'
import { useIsFocused } from '@react-navigation/core'
import { StackScreenProps } from '@react-navigation/stack'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DeviceEventEmitter, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BUTTON_STYLE1 ,BUTTON_STYLE2} from '../constants/fonts'
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
import { TabStacks, NotificationStackParams, Screens } from '../types/navigators'
import { ModalUsage } from '../types/remove'
import { TourID } from '../types/tour'
import { useAppAgent } from '../utils/agent'
import { getCredentialIdentifiers, isValidAnonCredsCredential } from '../utils/credential'
import { getCredentialConnectionLabel } from '../utils/helpers'
import { buildFieldsFromAnonCredsCredential } from '../utils/oca'
import { testIdWithKey } from '../utils/testable'

import CredentialOfferAccept from './CredentialOfferAccept'
import Document from '../components/falcon/Document'
import CredentialDetails from '../screens/CredentialDetails'

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
    // console.log(overlay.presentationFields)
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
      navigation.getParent()?.navigate(TabStacks.HomeStack, { screen: Screens.Home })
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
        {credentialConnectionLabel && goalCode === 'aries.vc.issue' ? (
          <ConnectionAlert connectionID={credentialConnectionLabel} />
        ) : null}
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
      <Record fields={overlay.presentationFields || []} footer={footer} />
      {/* <CredentialDetails /> */}
      {/* <Document credential={credential} issueDate={credential?.updatedAt?.toISOString()}  /> */}
      <CredentialOfferAccept visible={acceptModalVisible} credentialId={credentialId} />
      <CommonRemoveModal
        usage={ModalUsage.CredentialOfferDecline}
        visible={declineModalVisible}
        onSubmit={handleDeclineTouched}
        onCancel={toggleDeclineModalVisible}
      />
    </SafeAreaView>
  //   <SafeAreaView>
  //   <View
  //     style={{
  //       width: '100%',
  //       height: '85%',
  //       display: 'flex',
  //       alignItems: 'center',
  //       marginTop: '10%',
        
  //     }}>
  //     <Text
  //       style={{fontSize: 20, alignSelf: 'center', marginBottom: '6%',color:'black'}}>
  //       Do you want to form a connection with Benagluru University?
  //     </Text>
  //     <View
  //       style={{
  //         width: '93%',
  //         marginHorizontal: 'auto',
  //         backgroundColor: 'white',
  //         height:'15%',
  //         display: 'flex',
  //         flexDirection: 'row',
  //         justifyContent: 'flex-start',
  //         alignItems: 'center',
  //         borderRadius: 20,
  //         shadowColor: '#212228', shadowOffset: { width: 0, height: 4, }, shadowOpacity: 0.1,shadowRadius: 12, elevation: 4,
  //       }}>
  //       <View
  //         style={{
  //           height: '90%',
  //           backgroundColor: '#47C2D0',
  //           width: '5%',
  //           borderTopLeftRadius: 20,
  //           borderBottomLeftRadius: 20,
  //           borderWidth: 2,
  //           borderColor: 'white',
  //         }}
  //       />

  //       <View
  //         style={{
  //           display: 'flex',
  //           flexDirection: 'column',
  //           justifyContent: 'flex-start',
  //           alignItems: 'flex-start',
  //           paddingHorizontal: 15,
  //           paddingVertical: 10,
  //           width: '90%',
  //         }}>
  //         <View
  //           style={{
  //             display: 'flex',
  //             flexDirection: 'row',
  //             justifyContent: 'center',
  //             alignItems: 'center',
  //           }}>
  //           {/* <Image source={university} /> */}

  //           <Text style={{color: 'black', marginBottom: 1, fontSize: 15}}>
  //             Benguluru University
  //           </Text>
  //         </View>
  //         <View
  //           style={{
  //             width: '100%',
  //             height: 4,
  //             backgroundColor: 'black',
  //             marginBottom: 2,
  //           }}
  //         />
  //         {/* <ErrAndSucSt type="success" message="contact is verified" /> */}
  //       </View>
  //     </View>
  //   </View>
  //   <View
  //     style={{
  //       width: '100%',
  //       display: 'flex',
  //       flexDirection: 'row',
  //       justifyContent: 'center',
  //       alignItems: 'center',
  //       gap: 8,
  //     }}>
  //     <TouchableOpacity
  //       style={{
  //         ...BUTTON_STYLE1,
  //         backgroundColor: '#F0F5FF',
  //         display: 'flex',
  //         justifyContent: 'center',
  //         alignItems: 'center',
  //         borderRadius: 12,
  //         borderWidth: 1,
  //         borderColor: '#5869E6',
  //         paddingVertical: '3%',
  //         width: '45%',
  //       }}
  //       // onPress={() => setmodalVisible(false)}
  //       >
  //       <Text style={{color: '#5869E6', fontSize: 20}}>No</Text>
  //     </TouchableOpacity>
  //     <TouchableOpacity
  //       style={{
  //         ...BUTTON_STYLE2,
  //         backgroundColor: '#5869E6',
  //         display: 'flex',
  //         justifyContent: 'center',
  //         alignItems: 'center',
  //         borderRadius: 8,
  //         width: '45%',
  //         paddingVertical: '3%',
  //       }}
  //       // onPress={CommonRemoveModal}
  //       >
  //       <Text style={{color: 'white', fontSize: 20}}>Yes</Text>
  //     </TouchableOpacity>
  //     <CredentialOfferAccept visible={acceptModalVisible} credentialId={credentialId}/>
  //   </View>
  // </SafeAreaView>
  )
}

export default CredentialOffer
