import { StackScreenProps } from '@react-navigation/stack'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Button,
  DeviceEventEmitter,
  Dimensions,
  Modal,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

import { getVersion, getBuildNumber } from 'react-native-device-info'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/MaterialIcons'

import HeaderButton, { ButtonLocation } from '../components/buttons/HeaderButton'
import { useConfiguration } from '../contexts/configuration'
import { DispatchAction } from '../contexts/reducers/store'
import { useStore } from '../contexts/store'
import { useTheme } from '../contexts/theme'
import { Locales } from '../localization'
import { GenericFn } from '../types/fn'
import { Screens, SettingStackParams, Stacks } from '../types/navigators'
import { SettingIcon, SettingSection } from '../types/settings'
import { testIdWithKey } from '../utils/testable'
import AppbarSettings from  '../components/falcon/AppbarSettings'
import SettingsCard from '../components/falcon/SettingsCard'
import { EventTypes } from '../constants'
import { FONT_STYLE_3 } from '../constants/fonts'
import Ant from 'react-native-vector-icons/AntDesign'
import Oct from 'react-native-vector-icons/Octicons'
import FeatherIcon from 'react-native-vector-icons/Feather'
import { useAgent } from '@aries-framework/react-hooks'
import Toast from 'react-native-toast-message'
import { ToastType } from '../components/toast/BaseToast'
import { DownloadDirectoryPath } from 'react-native-fs'

type SettingsProps = StackScreenProps<SettingStackParams>

const touchCountToEnableBiometrics = 9

const Settings: React.FC<SettingsProps> = ({ navigation }) => {
  const { t, i18n } = useTranslation()
  const [store, dispatch] = useStore()
  const developerOptionCount = useRef(0)
  const { SettingsTheme, TextTheme, ColorPallet, Assets } = useTheme()
  const { settings, enableTours } = useConfiguration()
  const defaultIconSize = 24
  const styles = StyleSheet.create({
    container: {
      backgroundColor: ColorPallet.brand.primaryBackground,
      width: '100%',
    },
    section: {
      backgroundColor: SettingsTheme.groupBackground,
      paddingVertical: 24,
      flexGrow: 1,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingBottom: 0,
      marginBottom: -11,
      paddingHorizontal: 25,
    },
    sectionSeparator: {
      marginBottom: 10,
    },
    sectionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexGrow: 1,
      paddingHorizontal: 25,
    },
    itemSeparator: {
      borderBottomWidth: 1,
      borderBottomColor: ColorPallet.brand.primaryBackground,
      marginHorizontal: 25,
    },
    logo: {
      height: 64,
      width: '50%',
      marginVertical: 16,
    },
    footer: {
      marginVertical: 25,
      alignItems: 'center',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
    },
    closeButton: {
      marginTop: 20,
      padding: 10,
      backgroundColor: 'red',
      borderRadius: 5,
    },
    closeButtonText: {
      color: 'white',
    },
    containerm: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    toggleButton: {
      padding: 10,
      backgroundColor: '#2196F3',
      borderRadius: 5,
    },
    toggleButtonText: {
      color: '#fff',
      fontSize: 16,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContentm: {
      width: 300,
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 20,
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    iconRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 5,
    },
    iconText: {
      marginLeft: 10,
      fontSize: 16,
    },
    viewPhraseText: {
      color: '#2196F3',
      marginVertical: 20,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    localBackupButton: {
      padding: '4%',
      borderWidth: 1,
      borderColor: '#5869E6',
      borderRadius: 10,
      marginRight: 10,
    },
    cloudBackupButton: {
      padding: '4%',
      borderWidth: 1,
      borderColor: '#2196F3',
      borderRadius: 10,
      backgroundColor:'#5869E6',
      marginRight: 10,
    }
  })

  const currentLanguage = i18n.t('Language.code', { context: i18n.language as Locales })

  const incrementDeveloperMenuCounter = () => {
    if (developerOptionCount.current >= touchCountToEnableBiometrics) {
      developerOptionCount.current = 0
      dispatch({
        type: DispatchAction.ENABLE_DEVELOPER_MODE,
        payload: [true],
      })

      return
    }

    developerOptionCount.current = developerOptionCount.current + 1
  }

  const settingsSections: SettingSection[] = [
    {
      header: {
        icon: { name: 'settings' },
        title: t('Settings.AppSettings'),
      },
      data: [
        {
          title: t('Settings.ChangePin'),
          value: undefined,
          accessibilityLabel: t('Settings.ChangePin'),
          testID: testIdWithKey('Change Pin'),
          onPress: () =>
            navigation
              .getParent()
              ?.navigate(Stacks.SettingStack, { screen: Screens.CreatePIN, params: { updatePin: true } }),
        },
        {
          title: t('Global.Biometrics'),
          value: store.preferences.useBiometry ? t('Global.On') : t('Global.Off'),
          accessibilityLabel: t('Global.Biometrics'),
          testID: testIdWithKey('Biometrics'),
          onPress: () => navigation.navigate(Screens.UseBiometry),
        },
        
        {
          title: t('Settings.Language'),
          value: currentLanguage,
          accessibilityLabel: t('Settings.Language'),
          testID: testIdWithKey('Language'),
          onPress: () => navigation.navigate(Screens.Language),
        },
      ],
    },
    {
      header: {
        icon: { name: store.preferences.useConnectionInviterCapability ? 'person' : 'apartment', size: 30 },
        title: store.preferences.useConnectionInviterCapability ? store.preferences.walletName : t('Screens.Contacts'),
        iconRight: {
          name: 'edit',
          action: () => {
            navigation.navigate(Screens.NameWallet)
          },
          accessibilityLabel: t('NameWallet.EditWalletName'),
          testID: testIdWithKey('EditWalletName'),
          style: { color: ColorPallet.brand.primary },
        },
        titleTestID: store.preferences.useConnectionInviterCapability ? testIdWithKey('WalletName') : undefined,
      },
      data: [
        {
          title: t('Screens.Contacts'),
          accessibilityLabel: t('Screens.Contacts'),
          testID: testIdWithKey('Contacts'),
          onPress: () =>
            navigation
              .getParent()
              ?.navigate(Stacks.ContactStack, { screen: Screens.Contacts, params: { navigation: navigation } }),
        },
        {
          title: t('Settings.WhatAreContacts'),
          accessibilityLabel: t('Settings.WhatAreContacts'),
          testID: testIdWithKey('WhatAreContacts'),
          onPress: () => navigation.getParent()?.navigate(Stacks.ContactStack, { screen: Screens.WhatAreContacts }),
          value: undefined,
        },
      ],
    },
   
    ...(settings || []),
  ]

  if (enableTours) {
    const section = settingsSections.find((item) => item.header.title === t('Settings.AppSettings'))
    if (section) {
      section.data = [
        ...section.data,
        {
          title: t('Settings.AppGuides'),
          value: store.tours.enableTours ? t('Global.On') : t('Global.Off'),
          accessibilityLabel: t('Settings.AppGuides'),
          testID: testIdWithKey('AppGuides'),
          onPress: () => navigation.navigate(Screens.Tours),
        },
      ]
    }
  }

  if (store.preferences.developerModeEnabled) {
    const section = settingsSections.find((item) => item.header.title === t('Settings.AppSettings'))
    if (section) {
      section.data = [
        ...section.data,
        {
          title: t('Settings.Developer'),
          accessibilityLabel: t('Settings.Developer'),
          testID: testIdWithKey('DeveloperOptions'),
          onPress: () => navigation.navigate(Screens.Developer),
        },
      ]
    }
  }

  if (store.preferences.useVerifierCapability) {
    settingsSections.splice(1, 0, {
      header: {
        icon: { name: 'send' },
        title: t('Screens.ProofRequests'),
      },
      data: [
        {
          title: t('Screens.SendProofRequest'),
          accessibilityLabel: t('Screens.ProofRequests'),
          testID: testIdWithKey('ProofRequests'),
          onPress: () =>
            navigation.getParent()?.navigate(Stacks.ProofRequestsStack, {
              screen: Screens.ProofRequests,
              params: { navigation: navigation },
            }),
        },
      ],
    })

    const section = settingsSections.find((item) => item.header.title === t('Settings.AppSettings'))
    if (section) {
      section.data.splice(3, 0, {
        title: t('Settings.DataRetention'),
        value: store.preferences.useDataRetention ? t('Global.On') : t('Global.Off'),
        accessibilityLabel: t('Settings.DataRetention'),
        testID: testIdWithKey('DataRetention'),
        onPress: () => navigation.navigate(Screens.DataRetention),
      })
    }
  }

  if (store.preferences.useConnectionInviterCapability) {
    const section = settingsSections.find((item) => item.header.title === store.preferences.walletName)
    if (section) {
      section.data.splice(1, 0, {
        title: t('Settings.ScanMyQR'),
        accessibilityLabel: t('Settings.ScanMyQR'),
        testID: testIdWithKey('ScanMyQR'),
        onPress: () =>
          navigation.getParent()?.navigate(Stacks.ConnectStack, {
            screen: Screens.Scan,
            params: { defaultToConnect: true },
          }),
      })
    }
  }

  const SectionHeader: React.FC<{
    icon: SettingIcon
    iconRight?: SettingIcon
    title: string
    titleTestID?: string
  }> = ({ icon, iconRight, title, titleTestID }) =>
    // gate keep behind developer mode
    store.preferences.useConnectionInviterCapability ? (
      <View style={[styles.section, styles.sectionHeader, { justifyContent: iconRight ? 'space-between' : undefined }]}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Icon
            importantForAccessibility={'no-hide-descendants'}
            accessible={false}
            name={icon.name}
            size={icon.size ?? defaultIconSize}
            style={[{ marginRight: 10, color: SettingsTheme.iconColor }, icon.style]}
          />
          <Text
            testID={titleTestID}
            numberOfLines={1}
            accessibilityRole={'header'}
            style={[TextTheme.headingThree, { flexShrink: 1 }]}
          >
            {title}
          </Text>
        </View>
        {iconRight && (
          <HeaderButton
            buttonLocation={ButtonLocation.Right}
            accessibilityLabel={iconRight.accessibilityLabel!}
            testID={iconRight.testID!}
            onPress={iconRight.action!}
            icon={'pencil'}
            iconTintColor={TextTheme.headingThree.color}
          />
        )}
      </View>
    ) : (
      <View style={[styles.section, styles.sectionHeader]}>
        <Icon
          importantForAccessibility={'no-hide-descendants'}
          accessible={false}
          name={icon.name}
          size={24}
          style={{ marginRight: 10, color: SettingsTheme.iconColor }}
        />
        <Text accessibilityRole={'header'} style={[TextTheme.headingThree, { flexShrink: 1 }]}>
          {title}
        </Text>
      </View>
    )

  const SectionRow: React.FC<{
    title: string
    value?: string
    accessibilityLabel?: string
    testID?: string
    onPress?: GenericFn
  }> = ({ title, value, accessibilityLabel, testID, onPress }) => (
    <ScrollView horizontal style={styles.section} contentContainerStyle={{ flexGrow: 1 }}>
      <TouchableOpacity
        accessible={true}
        accessibilityLabel={accessibilityLabel}
        testID={testID}
        style={styles.sectionRow}
        onPress={onPress}
      >
        <Text style={[TextTheme.settingsText, { marginRight: 14 }]}>{title}</Text>
        <Text style={[TextTheme.settingsText, { color: ColorPallet.brand.link }]}>{value}</Text>
      </TouchableOpacity>
    </ScrollView>
  )
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [toggleState, setToggleState] = useState(false);
  
  const handleTogglePress = () => {
    setToggleState(!toggleState);
    setIsModalVisible(true);
  };
  
  const handleCloseModal = () => {
    setToggleState(false);
    setIsModalVisible(false);
  };

  const [showDisclosureModal, setShowDisclosureModal] = useState<boolean>(false)

  const recoveryPhraseRef = useRef();
  const [copied, setCopied] = useState(false);
  const RNFS = require('react-native-fs')
  const [loading, setLoading] = useState(false)
  const { agent } = useAgent()
  const [randomWords, setRandomWords] = useState('hello world 123 567')


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


const screenHeight = Math.round(Dimensions.get('window').height)

const getFontSizel = () => {
  return screenHeight < 600? screenHeight * 0.016 : screenHeight * 0.018
}

  return (
    // <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
    //   <SectionList
    //     renderItem={({ item: { title, value, accessibilityLabel, testID, onPress } }) => (
    //       <SectionRow
    //         title={title}
    //         accessibilityLabel={accessibilityLabel}
    //         testID={testID ?? 'NoTestIdFound'}
    //         value={value}
    //         onPress={onPress}
    //       />
    //     )}
    //     renderSectionHeader={({
    //       section: {
    //         header: { title, icon, iconRight, titleTestID },
    //       },
    //     }) => <SectionHeader icon={icon} iconRight={iconRight} title={title} titleTestID={titleTestID} />}
    //     ItemSeparatorComponent={() => (
    //       <View style={{ backgroundColor: SettingsTheme.groupBackground }}>
    //         <View style={[styles.itemSeparator]}></View>
    //       </View>
    //     )}
    //     SectionSeparatorComponent={() => <View style={[styles.sectionSeparator]}></View>}
    //     ListFooterComponent={() => (
    //       <View style={styles.footer}>
    //         <TouchableWithoutFeedback
    //           onPress={incrementDeveloperMenuCounter}
    //           disabled={store.preferences.developerModeEnabled}
    //         >
    //           <View>
    //             <Text style={TextTheme.normal} testID={testIdWithKey('Version')}>
    //               {`${t('Settings.Version')} ${getVersion()} ${t('Settings.Build')} (${getBuildNumber()})`}
    //             </Text>
    //             <Assets.svg.logo {...styles.logo} />
    //           </View>
    //         </TouchableWithoutFeedback>
    //       </View>
    //     )}
    //     sections={settingsSections}
    //     stickySectionHeadersEnabled={false}
    //   ></SectionList>
    // </SafeAreaView>

//     <View style={{width:'100%',height:'100%',display:'flex'}} >
//     <AppbarSettings name="Ashwin Mayank" mobile="+91 8451285125" />
//     <View style={{height:'97%',width:'100%'}} >
//         <ScrollView showsVerticalScrollIndicator={false} >
//             <SettingsCard icon={true} heading={"Change PIN"} context={"Edit and reset your PIN"} />
//             <SettingsCard icon={false} heading={"Biometrics"} context={"Enable biometrics"} />
//             <SettingsCard icon={false} heading={"Backup"} context={"Backup your wallet to cloud"}  />
//             <SettingsCard icon={true} heading={"Recovery phrase"} context={"Recovery phrase to restore your wallet"} />
//             <SettingsCard icon={true} heading={"Help"} context={"Support and FAQ"}/>
//             <SettingsCard icon={true} heading={"Network"} context={"Network"}  />
//         </ScrollView>
//     </View >

// </View >
<ScrollView showsVerticalScrollIndicator={false} >
<AppbarSettings name="Ashwin Mayank" mobile="+91 8451285125" />
<TouchableOpacity onPress={ () =>navigation
    .getParent()
    ?.navigate(Stacks.SettingStack, { screen: Screens.CreatePIN, params: { updatePin: true }})}>
  <SettingsCard icon={true} heading={"Change PIN"} context={"Edit and reset your PIN"} />
</TouchableOpacity>


  <SettingsCard icon={false} heading={"Biometrics"} context={"Enable biometrics"} />
  
  <SettingsCard icon={false} heading={"Backup"} context={"Backup your wallet to cloud"} onToggle={handleTogglePress}/>


  <TouchableOpacity onPress={ () =>navigation
    .getParent()
    ?.navigate(Stacks.SettingStack, { screen: Screens.RecoveryPhraseScreen})}>
  <SettingsCard icon={true} heading={"Recovery phrase"} context={"Recovery phrase to restore your wallet"} />
</TouchableOpacity>
<TouchableOpacity onPress={ () =>navigation
    .getParent()
    ?.navigate(Stacks.SettingStack, { screen: Screens.SupportScreen})}>
  <SettingsCard icon={true} heading={"Help"} context={"Support and FAQ"} />
</TouchableOpacity>
<TouchableOpacity  onPress={ () =>navigation
    .getParent()
    ?.navigate(Stacks.SettingStack, { screen: Screens.Networks})}>
  <SettingsCard icon={true} heading={"Network"} context={"Network"} />
</TouchableOpacity>
<Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseModal}
        style={{ shadowColor: '#212228', shadowOffset: { width: 0, height: 4, }, shadowOpacity: 0.1,shadowRadius: 12, elevation: 4,}}
      >
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
          <View style={{width:'80%',backgroundColor:'white',borderRadius:10,padding:'3%',display:'flex',alignContent:'center'}}>
            <Text style={{  fontSize: 18,fontWeight: 'bold',color:'black',marginBottom: 20,}}>Backing up your wallet</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 2, marginBottom: '5%' }}>
        <View style={{ borderRadius: 100 ,backgroundColor: '#F0F5FF', padding: screenHeight < 600? 2 : 4 }}>
          
          {/* <Image source={Logo} resizeMode="contain" style={styles.imagestyle} /> */}
          <Oct  name="person" size={24} color="#733DF5" />

        </View>
        <Text style={[FONT_STYLE_3 as TextStyle, {fontSize: getFontSizel(), color: 'black' }]}>Easily recover your digital identity.</Text>

      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 2, marginBottom: '5%' }}>
        <View style={{ borderRadius: 100 ,backgroundColor: '#F0F5FF', padding: screenHeight < 600? 2 : 4 }}>
          
          {/* <Image source={Logo} resizeMode="contain" style={styles.imagestyle} /> */}
          <Ant  name="clouduploado" size={24} color="#733DF5" />

        </View>
        <Text style={[FONT_STYLE_3 as TextStyle, {fontSize: getFontSizel(), color: 'black' }]}>Backup to your Google Cloud or iCloud.</Text>

      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 2, marginBottom: '5%' }}>
        <View style={{ borderRadius: 100 ,backgroundColor: '#F0F5FF', padding: screenHeight < 600? 2 : 4 }}>
          
          {/* <Image source={Logo} resizeMode="contain" style={styles.imagestyle} /> */}
          <FeatherIcon name="eye-off" size={24} color="#733DF5" />

        </View>
        <Text style={[FONT_STYLE_3 as TextStyle, {fontSize: getFontSizel(), color: 'black' }]}>Only you have access to your identity.</Text>

      </View>
            
           
            <TouchableOpacity onPress={()=>{navigation.navigate(Screens.RecoveryPhraseScreen)}}>
              <Text style={{textAlign:'center',color:'blue',fontSize:16,paddingTop:'10%',paddingBottom:'10%'}}>View phrase</Text>
            </TouchableOpacity>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.localBackupButton} onPress={exportWallet}>
                <Text style={{color:'#5869E6',fontSize:16}}>Local backup</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cloudBackupButton}>
                <Text style={{color:'white',fontSize:16}}>Cloud backup</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


</ScrollView>








  )
}

export default Settings
