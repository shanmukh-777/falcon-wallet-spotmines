// 

import type { StackScreenProps } from '@react-navigation/stack'

import { CredentialExchangeRecord } from '@aries-framework/core'
import { useAgent } from '@aries-framework/react-hooks'
import { BrandingOverlay } from '@hyperledger/aries-oca'
import { Attribute, BrandingOverlayType, CredentialOverlay } from '@hyperledger/aries-oca/build/legacy'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DeviceEventEmitter, Image, ImageBackground, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

import CredentialCard from '../components/misc/CredentialCard'
import InfoBox, { InfoBoxType } from '../components/misc/InfoBox'
import CommonRemoveModal from '../components/modals/CommonRemoveModal'
import Record from '../components/record/Record'
import RecordRemove from '../components/record/RecordRemove'
import { ToastType } from '../components/toast/BaseToast'
import { EventTypes } from '../constants'
import { useConfiguration } from '../contexts/configuration'
import { useTheme } from '../contexts/theme'
import { BifoldError } from '../types/error'
import { CredentialMetadata, credentialCustomMetadata } from '../types/metadata'
import { CredentialStackParams, Screens } from '../types/navigators'
import { ModalUsage } from '../types/remove'
import {
  credentialTextColor,
  getCredentialIdentifiers,
  isValidAnonCredsCredential,
  toImageSource,
} from '../utils/credential'
import { formatTime, getCredentialConnectionLabel } from '../utils/helpers'
import { buildFieldsFromAnonCredsCredential } from '../utils/oca'
import { testIdWithKey } from '../utils/testable'

import {  TouchableOpacity, Modal, ScrollView, FlatList } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Octicons from 'react-native-vector-icons/Octicons';
import Document from './../components/falcon/Document';
import Dropdown  from '../components/falcon/Dropdown';
import { useNavigation } from '@react-navigation/native';
import { BUTTON_STYLE1, BUTTON_STYLE2 } from './../constants/fonts'
import AadharSchema from './../components/falcon/AadharSchema'

type CredentialDetailsProps = StackScreenProps<CredentialStackParams, Screens.CredentialDetails>

const paddingHorizontal = 24
const paddingVertical = 16
const logoHeight = 80

const CredentialDetails: React.FC<CredentialDetailsProps> = ({ navigation, route }) => {
  if (!route?.params) {
    throw new Error('CredentialDetails route prams were not set properly')
  }

  const { credential } = route?.params
  const { agent } = useAgent()
  const { t, i18n } = useTranslation()
  const { TextTheme, ColorPallet } = useTheme()
  const { OCABundleResolver } = useConfiguration()
  const [isRevoked, setIsRevoked] = useState<boolean>(false)
  const [revocationDate, setRevocationDate] = useState<string>('')
  const [preciseRevocationDate, setPreciseRevocationDate] = useState<string>('')
  const [isRemoveModalDisplayed, setIsRemoveModalDisplayed] = useState<boolean>(false)
  const [isRevokedMessageHidden, setIsRevokedMessageHidden] = useState<boolean>(
    (credential!.metadata.get(CredentialMetadata.customMetadata) as credentialCustomMetadata)
      ?.revoked_detail_dismissed ?? false
  )

  const [overlay, setOverlay] = useState<CredentialOverlay<BrandingOverlay>>({
    bundle: undefined,
    presentationFields: [],
    metaOverlay: undefined,
    brandingOverlay: undefined,
  })

  const credentialConnectionLabel = getCredentialConnectionLabel(credential)

  const styles = StyleSheet.create({
    container: {
      backgroundColor: overlay.brandingOverlay?.primaryBackgroundColor,
      display: 'flex',
    },
    secondaryHeaderContainer: {
      height: 1.5 * logoHeight,
      backgroundColor:
        (overlay.brandingOverlay?.backgroundImage
          ? 'rgba(0, 0, 0, 0)'
          : overlay.brandingOverlay?.secondaryBackgroundColor) ?? 'rgba(0, 0, 0, 0.24)',
    },
    primaryHeaderContainer: {
      paddingHorizontal,
      paddingVertical,
    },
    statusContainer: {},
    logoContainer: {
      top: -0.5 * logoHeight,
      left: paddingHorizontal,
      marginBottom: -1 * logoHeight,
      width: logoHeight,
      height: logoHeight,
      backgroundColor: '#ffffff',
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 1,
        height: 1,
      },
      shadowOpacity: 0.3,
    },
    textContainer: {
      color: credentialTextColor(ColorPallet, overlay.brandingOverlay?.primaryBackgroundColor),
      flexShrink: 1,
    },
  })

  useEffect(() => {
    if (!agent) {
      DeviceEventEmitter.emit(
        EventTypes.ERROR_ADDED,
        new BifoldError(t('Error.Title1033'), t('Error.Message1033'), t('CredentialDetails.CredentialNotFound'), 1033)
      )
    }
  }, [])

  useEffect(() => {
    if (!credential) {
      DeviceEventEmitter.emit(
        EventTypes.ERROR_ADDED,
        new BifoldError(t('Error.Title1033'), t('Error.Message1033'), t('CredentialDetails.CredentialNotFound'), 1033)
      )
    }
  }, [])

  useEffect(() => {
    if (!(credential && isValidAnonCredsCredential(credential))) {
      return
    }

    credential.revocationNotification == undefined ? setIsRevoked(false) : setIsRevoked(true)
    if (credential?.revocationNotification?.revocationDate) {
      const date = new Date(credential.revocationNotification.revocationDate)
      setRevocationDate(formatTime(date, { shortMonth: true }))
      setPreciseRevocationDate(formatTime(date, { includeHour: true }))
    }

    const params = {
      identifiers: getCredentialIdentifiers(credential),
      meta: {
        alias: credentialConnectionLabel,
        credConnectionId: credential.connectionId,
      },
      attributes: buildFieldsFromAnonCredsCredential(credential),
      language: i18n.language,
    }

    OCABundleResolver.resolveAllBundles(params).then((bundle) => {
      setOverlay({
        ...overlay,
        ...(bundle as CredentialOverlay<BrandingOverlay>),
        presentationFields: bundle.presentationFields?.filter((field) => (field as Attribute).value),
      })
    })
  }, [credential])

  useEffect(() => {
    if (credential?.revocationNotification) {
      const meta = credential!.metadata.get(CredentialMetadata.customMetadata)
      credential.metadata.set(CredentialMetadata.customMetadata, { ...meta, revoked_seen: true })
      agent?.credentials.update(credential)
    }
  }, [isRevoked])

  const handleOnRemove = () => {
    setIsRemoveModalDisplayed(true)
  }

  const handleSubmitRemove = async () => {
    try {
      if (!(agent && credential)) {
        return
      }

      await agent.credentials.deleteById(credential.id)

      navigation.pop()

      // FIXME: This delay is a hack so that the toast doesn't appear until the modal is dismissed
      await new Promise((resolve) => setTimeout(resolve, 1000))

      Toast.show({
        type: ToastType.Success,
        text1: t('CredentialDetails.CredentialRemoved'),
      })
    } catch (err: unknown) {
      const error = new BifoldError(t('Error.Title1032'), t('Error.Message1032'), (err as Error)?.message ?? err, 1032)
      DeviceEventEmitter.emit(EventTypes.ERROR_ADDED, error)
    }
  }

  const handleCancelRemove = () => {
    setIsRemoveModalDisplayed(false)
  }

  const handleDismissRevokedMessage = () => {
    setIsRevokedMessageHidden(true)
    const meta = credential!.metadata.get(CredentialMetadata.customMetadata)
    credential.metadata.set(CredentialMetadata.customMetadata, { ...meta, revoked_detail_dismissed: true })
    agent?.credentials.update(credential)
  }

  const callOnRemove = useCallback(() => handleOnRemove(), [])
  const callSubmitRemove = useCallback(() => handleSubmitRemove(), [])
  const callCancelRemove = useCallback(() => handleCancelRemove(), [])
  const callDismissRevokedMessage = useCallback(() => handleDismissRevokedMessage(), [])

  const CredentialCardLogo: React.FC = () => {
    return (
      <View style={styles.logoContainer}>
        {overlay.brandingOverlay?.logo ? (
          <Image
            source={toImageSource(overlay.brandingOverlay?.logo)}
            style={{
              resizeMode: 'cover',
              width: logoHeight,
              height: logoHeight,
              borderRadius: 8,
            }}
          />
        ) : (
          <Text style={[TextTheme.title, { fontSize: 0.5 * logoHeight, color: '#000' }]}>
            {(overlay.metaOverlay?.name ?? overlay.metaOverlay?.issuer ?? 'C')?.charAt(0).toUpperCase()}
          </Text>
        )}
      </View>
    )
  }

  const CredentialDetailPrimaryHeader: React.FC = () => {
    return (
      <View testID={testIdWithKey('CredentialDetailsPrimaryHeader')} style={styles.primaryHeaderContainer}>
        <View>
          <Text
            testID={testIdWithKey('CredentialIssuer')}
            style={[
              TextTheme.label,
              styles.textContainer,
              {
                paddingLeft: logoHeight + paddingVertical,
                paddingBottom: paddingVertical,
                lineHeight: 19,
                opacity: 0.8,
              },
            ]}
            numberOfLines={1}
          >
            {overlay.metaOverlay?.issuer}
          </Text>
          <Text
            testID={testIdWithKey('CredentialName')}
            style={[
              TextTheme.normal,
              styles.textContainer,
              {
                lineHeight: 24,
              },
            ]}
          >
            {overlay.metaOverlay?.name}
          </Text>
        </View>
      </View>
    )
  }

  const CredentialDetailSecondaryHeader: React.FC = () => {
    return (
      <>
        {overlay.brandingOverlay?.backgroundImage ? (
          <ImageBackground
            source={toImageSource(overlay.brandingOverlay?.backgroundImage)}
            imageStyle={{
              resizeMode: 'cover',
            }}
          >
            <View testID={testIdWithKey('CredentialDetailsSecondaryHeader')} style={styles.secondaryHeaderContainer} />
          </ImageBackground>
        ) : (
          <View testID={testIdWithKey('CredentialDetailsSecondaryHeader')} style={styles.secondaryHeaderContainer} />
        )}
      </>
    )
  }

  const CredentialRevocationMessage: React.FC<{ credential: CredentialExchangeRecord }> = ({ credential }) => {
    return (
      <InfoBox
        notificationType={InfoBoxType.Error}
        title={t('CredentialDetails.CredentialRevokedMessageTitle') + ' ' + revocationDate}
        description={
          credential?.revocationNotification?.comment
            ? credential.revocationNotification.comment
            : t('CredentialDetails.CredentialRevokedMessageBody')
        }
        onCallToActionLabel={t('Global.Dismiss')}
        onCallToActionPressed={callDismissRevokedMessage}
      />
    )
  }

  const header = () => {
    return OCABundleResolver.getBrandingOverlayType() === BrandingOverlayType.Branding01 ? (
      <View>
        {isRevoked && !isRevokedMessageHidden ? (
          <View style={{ padding: paddingVertical, paddingBottom: 0 }}>
            {credential && <CredentialRevocationMessage credential={credential} />}
          </View>
        ) : null}
        {credential && <CredentialCard credential={credential} style={{ margin: 16 }} />}
      </View>
    ) : (
      <View style={styles.container}>
        <CredentialDetailSecondaryHeader />
        <CredentialCardLogo />
        <CredentialDetailPrimaryHeader />
        {isRevoked && !isRevokedMessageHidden ? (
          <View style={{ padding: paddingVertical, paddingTop: 0 }}>
            {credential && <CredentialRevocationMessage credential={credential} />}
          </View>
        ) : null}
      </View>
    )
  }

  const footer = () => {
    return (
      <View style={{ marginBottom: 50 }}>
        {credentialConnectionLabel ? (
          <View
            style={{
              backgroundColor: ColorPallet.brand.secondaryBackground,
              marginTop: paddingVertical,
              paddingHorizontal,
              paddingVertical,
            }}
          >
            <Text testID={testIdWithKey('IssuerName')}>
              <Text style={[TextTheme.title, isRevoked && { color: ColorPallet.grayscale.mediumGrey }]}>
                {t('CredentialDetails.IssuedBy') + ' '}
              </Text>
              <Text style={[TextTheme.normal, isRevoked && { color: ColorPallet.grayscale.mediumGrey }]}>
                {credentialConnectionLabel}
              </Text>
            </Text>
          </View>
        ) : null}
        {isRevoked ? (
          <View
            style={{
              backgroundColor: ColorPallet.notification.error,
              marginTop: paddingVertical,
              paddingHorizontal,
              paddingVertical,
            }}
          >
            <Text testID={testIdWithKey('RevokedDate')}>
              <Text style={[TextTheme.title, { color: ColorPallet.notification.errorText }]}>
                {t('CredentialDetails.Revoked') + ': '}
              </Text>
              <Text style={[TextTheme.normal, { color: ColorPallet.notification.errorText }]}>
                {preciseRevocationDate}
              </Text>
            </Text>
            <Text
              style={[TextTheme.normal, { color: ColorPallet.notification.errorText, marginTop: paddingVertical }]}
              testID={testIdWithKey('RevocationMessage')}
            >
              {credential?.revocationNotification?.comment
                ? credential.revocationNotification.comment
                : t('CredentialDetails.CredentialRevokedMessageBody')}
            </Text>
          </View>
        ) : null}
        <RecordRemove onRemove={callOnRemove} />
      </View>
    )
  }

//VCDetails
const [modalVisible, setmodalVisible] = useState(false)

  const items = [
    { id: 'document', component: <Document credential={credential} issueDate={credential.createdAt.toDateString()} /> },
    { id: 'aadharSchema', component: <AadharSchema fields={overlay.presentationFields || []} /> },
    { id: 'dropdown', component: <Dropdown /> },

];
const renderItem = ({ item }: { item: any }) => (
  <View style={{ flex: 1, alignItems: 'center' }}>
      {item.component}
  </View>
);


  return (
    // <SafeAreaView style={{ flexGrow: 1 }} edges={['left', 'right']}>
    //   <Record fields={overlay.presentationFields || []} hideFieldValues header={header} footer={footer} />
    //   <CommonRemoveModal
    //     usage={ModalUsage.CredentialRemove}
    //     visible={isRemoveModalDisplayed}
    //     onSubmit={callSubmitRemove}
    //     onCancel={callCancelRemove}
    //   />
    // </SafeAreaView>
    <SafeAreaView >
      <ScrollView>
    <View style={{display:'flex',flexDirection:'row',width:'95%',marginHorizontal:'auto',justifyContent:'space-between',alignItems:'center'}}  >
        <View style={{display:'flex',flexDirection:'row',alignItems:'center'}} >
            <TouchableOpacity  style={{width:48,height:48,backgroundColor:'white',display:'flex',justifyContent:'center',alignItems:'center',borderRadius:8,margin:'8%',shadowColor: '#212228', shadowOffset: { width: 0, height: 4, }, shadowOpacity: 0.1,shadowRadius: 12, elevation: 4,}} onPress={navigation.goBack}>
                <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
            </TouchableOpacity>
            <Text style={{fontSize:16,fontWeight:'bold',color:'black'}} >Details</Text>
        </View>
        <View style={{display:'flex',flexDirection:'row',alignItems:'center',width:'20%',marginRight:'2%',justifyContent:'space-between'}} >
            <AntDesign name="delete" size={24} color="black" onPress={() => setmodalVisible(true)}  />
            <Octicons name="eye-closed" size={24} color="black" />
        </View>
    </View>
    <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id}
    />
    </ScrollView>

    <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={{flex:1,justifyContent:'flex-end',alignItems:'center'}} >
            <View style={{width:'100%',backgroundColor:'white',padding:'5%',borderTopLeftRadius:25,borderTopRightRadius:25}} >
                <Text  style={{fontSize:16,marginBottom:'5%',width:'90%',color:'black',fontWeight:'bold'}}>Are you sure you want to delete this credential from your wallet?</Text>
                <View style={{width:'100%',display:'flex',flexDirection:'row',justifyContent:'center',alignItems:'center',gap:8}} >
                    <TouchableOpacity style={{...BUTTON_STYLE1,backgroundColor:'#F0F5FF',display:'flex',justifyContent:'center',alignItems:'center',borderRadius:12,borderWidth:1,borderColor:'#5869E6',paddingVertical:'3%',width:'50%' }} onPress={() => setmodalVisible(false)}>
                        <Text style={{color:'#5869E6',fontSize:20}}>No</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  style={{...BUTTON_STYLE2,backgroundColor:'#5869E6',display:'flex',justifyContent:'center',alignItems:'center',borderRadius:12,paddingVertical:'3%',width:'50%' }} onPress={callSubmitRemove}>
                        <Text style={{color:'white',fontSize:20}}>Yes</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </Modal>
</SafeAreaView>
  )
}

export default CredentialDetails