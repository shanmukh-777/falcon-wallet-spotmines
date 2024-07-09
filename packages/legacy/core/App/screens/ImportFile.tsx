import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, PermissionsAndroid } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import BackUp from '../components/falcon/BackUp'
import { useNavigation, NavigationProp } from '@react-navigation/native'
import { BUTTON_STYLE2 } from '../constants/fonts'
// import DocumentPicker  from 'react-native-document-picker';
import { getAgentModules, createLinkSecretIfRequired } from '../utils/agent'
import {
  Agent,
  AutoAcceptCredential,
  ConsoleLogger,
  HttpOutboundTransport,
  LogLevel,
  MediatorPickupStrategy,
  WsOutboundTransport,
} from '@aries-framework/core'
import {DownloadDirectoryPath} from 'react-native-fs'
import { FileSystem } from 'react-native-file-access'
import { useAgent } from '@aries-framework/react-hooks'
import { agentDependencies } from '@aries-framework/react-native'

import { Config } from 'react-native-config'
import DocumentPicker, {
  DirectoryPickerResponse,
  DocumentPickerResponse,
  isInProgress,
} from 'react-native-document-picker'
import Toast from 'react-native-toast-message'
import indyLedgers from '../configs/ledgers/indy'
import { ToastType } from '../components/toast/BaseToast'
import { DispatchAction } from '../contexts/reducers/store'
import { useStore } from '../contexts/store'
import { useTheme } from '../contexts/theme'
import { testIdWithKey } from '../utils/testable'
import { useTranslation } from 'react-i18next'
import { useAppAgent } from '../utils/agent'

const ImportFile: React.FC = () => {
  const navigation = useNavigation<NavigationProp<any>>()
  const screenHeight = Math.round(Dimensions.get('window').height)
  const getFontSizel = () => {
    return screenHeight < 600 ? screenHeight * 0.016 : screenHeight * 0.018
  }
  const getFontSizem = () => {
    return screenHeight < 600 ? screenHeight * 0.015 : screenHeight * 0.025
  }

  const [agentInitDone, setAgentInitDone] = useState(false)
  const [initAgentInProcess, setInitAgentInProcess] = useState(false)
  const [copiedText, setCopiedText] = useState('')

  const [backupPath, setBackupPath] = useState<string>('')

  const [pin, setPin] = useState('')
  const [pinTwo, setPinTwo] = useState('')
  const [loading, setLoading] = useState(false)
  const [, dispatch] = useStore()
  const { t } = useTranslation()
  const { ColorPallet } = useTheme()
  const { agent } = useAgent()
  const { setAgent } = useAgent()
  const [result, setResult] = React.useState<
    Array<DocumentPickerResponse> | DirectoryPickerResponse | undefined | null
  >()
  const [paraphrase, setParaphrase] = useState(
    'lemon jazz banana ice cream flower elephant kangaroo apple happiness dog grape cherry'
  )
   
    const getcontent=async()=>{
      const grants = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
      console.log(grants)
    }


    useEffect(()=>{
     getcontent()
    })


  // const getPath = (fileName: string) => ${RNFS.ExternalStorageDirectoryPath}/${fileName}
  // const getPath=`/storage/emulated/0/Download/falconBackup-6022`
  // const getPath = (fileName: string) => `/storage/emulated/0/Download/falconBackup-1720361238357`
  const getPath=(fileName: string) =>`${DownloadDirectoryPath}/falconBackup-1720361248357`
  const importWallet = async (fileName: string) => {
    // TODO: Show loading indicator here
    // dispatch({ type: DispatchAction.LOADING_ENABLED })

    //Flag to protect the init process from being duplicated
    setInitAgentInProcess(true)

    try {
      const newAgent = new Agent({
                config: {
                  label: 'Aries Bifold',
                },
                dependencies: agentDependencies,
                modules: getAgentModules({
                  indyNetworks: indyLedgers,
                  mediatorInvitationUrl: Config.MEDIATOR_URL,
                }),
            })
      console.log('getPath(path)', getPath(fileName))

      await newAgent.wallet
        .import(
          { id: 'wallet4', key: '123' },
          {
            path: getPath(fileName),
            key: paraphrase,
          }
        )
        .then(async (res) => {
          await newAgent.wallet.initialize({ id: 'wallet4', key: '123' })
          const wsTransport = new WsOutboundTransport()
          const httpTransport = new HttpOutboundTransport()

          newAgent.registerOutboundTransport(wsTransport)
          newAgent.registerOutboundTransport(httpTransport)

          await newAgent.initialize()

          setAgent(newAgent) // -> This will set the agent in the global provider
          // setAgentInitDone(true)

          // saveData(newAgent)
          setLoading(false)
          Toast.show({
            type: ToastType.Success,
            text1: 'Wallet Imported Successfully',
            text2: getPath(fileName),
            visibilityTime: 3000,
            position: 'top',
          })
          //   dispatch({ type: DispatchAction.LOADING_DISABLED })
          //   dispatch({
          //     type: DispatchAction.DID_SHOW_IMPORT_WALLET,
          //   })
        })
        .catch((err: Object) => {
          console.log(err)
          setLoading(false)
          Toast.show({
            type: ToastType.Error,
            text1: 'Error',
            text2: 'Please use correct paraphrase',
            visibilityTime: 3000,
            position: 'top',
          })
        })
    } catch (e: unknown) {
      Toast.show({
        type: ToastType.Error,
        text1: t('Global.Failure'),
        text2: (e as Error)?.message || t('Error.Unknown'),
        visibilityTime: 2000,
        position: 'top',
      })
    }

    setInitAgentInProcess(false)
  }


//   try {
//     const newAgent = new Agent({
//         config: {
//           label: 'Aries Bifold',
//         },
//         dependencies: agentDependencies,
//         modules: getAgentModules({
//           indyNetworks: indyLedgers,
//           mediatorInvitationUrl: Config.MEDIATOR_URL,
//         }),
//     })

//     await newAgent.wallet
//       .import(
//         { id: 'wallet4', key: '123' },
//         {
//           path: getPath(fileName),
//           key: paraphrase,
//         }
//       )
//         await newAgent.wallet.initialize({ id: 'wallet4', key: '123' })
//         const wsTransport = new WsOutboundTransport()
//         const httpTransport = new HttpOutboundTransport()

//         newAgent.registerOutboundTransport(wsTransport)
//         newAgent.registerOutboundTransport(httpTransport)

//         await newAgent.initialize()

//         setAgent(newAgent) // -> This will set the agent in the global provider
//         Toast.show({
//           type: ToastType.Success,
//           text1: 'Wallet Imported Successfully',
//           text2: getPath(fileName),
//           visibilityTime: 3000,
//           position: 'bottom',
//         })
//         dispatch({ type: DispatchAction.LOADING_DISABLED })
//         dispatch({
//           type: DispatchAction.DID_SHOW_IMPORT_WALLET,
//         })
//       })
//       .catch((err: Object) => {
//         console.log(err)
//         Toast.show({
//           type: ToastType.Error,
//           text1: 'Error',
//           text2: 'Please use correct paraphrase',
//           visibilityTime: 3000,
//           position: 'bottom',
//         })
//       })
//   } catch (e: unknown) {
//     Toast.show({
//       type: ToastType.Error,
//       text2: (e as Error)?.message || t('Error.Unknown'),
//       visibilityTime: 2000,
//       position: 'bottom',
//     })
//   }

//   setInitAgentInProcess(false)
// }



  return (
    <SafeAreaView>
      <View style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ width: '100%', height: '90%', display: 'flex' }}>
          <TouchableOpacity
           onPress={() => {
            navigation.goBack()
          }}
            style={{
              width: 48,
              height: 48,
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 8,
              margin: '8%',
              shadowColor: '#212228',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 4,
            }}
          >
            <Icon
              name="arrow-left"
              size={24}
              color="black"
             
            />
          </TouchableOpacity>
          <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: getFontSizem(), fontWeight: 'bold', alignSelf: 'center', color: 'black' }}>
              Import backup file
            </Text>
            <Text
              style={{
                fontSize: getFontSizel(),
                textAlign: 'center',
                color: '#8E8E8E',
                marginTop: '2%',
                marginBottom: '10%',
              }}
            >
              Please select your backup zip file to restore your wallet with your credentials.
            </Text>

            <BackUp />
          </View>
        </View>
        <TouchableOpacity
           onPress={() => importWallet('falconBackup-1720361238357')}
          style={{
            backgroundColor: '#5869E6',
            ...BUTTON_STYLE2,
            height: '8%',
            width: '90%',
            borderRadius: 12,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '7%',
            padding: '2%',
          }}
        >
          <Text style={{ fontSize: getFontSizel(), color: 'white' }}>Import</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default ImportFile
