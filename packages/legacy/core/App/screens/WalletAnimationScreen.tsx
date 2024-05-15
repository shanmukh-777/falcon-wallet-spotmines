// import { Loader } from '../../components'
import LoadingIndicator from './../components/animated/LoadingIndicator'
import Animation from './../assets/icons/animation.svg'

import { View, Text, Dimensions, Image, Animated, Easing } from 'react-native'
// import React, { useEffect } from 'react'
// import { useNavigation } from '@react-navigation/native'
import Logo from './../assets/icons/Logo.svg'
import { StackNavigationProp } from '@react-navigation/stack'
import { AuthenticateStackParams } from '../types/navigators'

import { Agent, ConsoleLogger, HttpOutboundTransport, LogLevel, WsOutboundTransport } from '@aries-framework/core'
import { useAgent } from '@aries-framework/react-hooks'
import { agentDependencies } from '@aries-framework/react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/core'
import { CommonActions } from '@react-navigation/native'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DeviceEventEmitter, StyleSheet } from 'react-native'
import { Config } from 'react-native-config'
import { SafeAreaView } from 'react-native-safe-area-context'

import { EventTypes, LocalStorageKeys } from '../constants'
import { useAnimatedComponents } from '../contexts/animated-components'
import { useAuth } from '../contexts/auth'
import { useConfiguration } from '../contexts/configuration'
import { DispatchAction } from '../contexts/reducers/store'
import { useStore } from '../contexts/store'
import { useTheme } from '../contexts/theme'
import { loadLoginAttempt } from '../services/keychain'
import { BifoldError } from '../types/error'
import { Screens, Stacks } from '../types/navigators'
import {
  LoginAttempt as LoginAttemptState,
  Migration as MigrationState,
  Preferences as PreferencesState,
  Onboarding as StoreOnboardingState,
  Tours as ToursState,
} from '../types/state'
import { getAgentModules, createLinkSecretIfRequired } from '../utils/agent'
import { migrateToAskar, didMigrateToAskar } from '../utils/migration'
import Wa1 from '../assets/icons/wa1.svg'
import Wa2 from '../assets/icons/wa2.svg'



const onboardingComplete = (state: StoreOnboardingState): boolean => {
  console.log("in onbaording complete function")
  return state.didCompleteTutorial && state.didAgreeToTerms && state.didCreatePIN && state.didConsiderBiometry
}

const resumeOnboardingAt = (
  
  state: StoreOnboardingState,
  enableWalletNaming: boolean | undefined,
  showPreface: boolean | undefined
): Screens => {
  console.log("in resumeOnboarding at function")
  if (
    (state.didSeePreface || !showPreface) &&
    state.didCompleteTutorial &&
    state.didAgreeToTerms &&
    state.didCreatePIN &&
    (state.didNameWallet || !enableWalletNaming) &&
    !state.didConsiderBiometry
  ) {
    return Screens.UseBiometry
  }

  if (
    (state.didSeePreface || !showPreface) &&
    state.didCompleteTutorial &&
    state.didAgreeToTerms &&
    state.didCreatePIN &&
    enableWalletNaming &&
    !state.didNameWallet
  ) {
    return Screens.NameWallet
  }

  if (
    (state.didSeePreface || !showPreface) &&
    state.didCompleteTutorial &&
    state.didAgreeToTerms &&
    !state.didCreatePIN
  ) {
    return Screens.CreatePIN
  }

  if ((state.didSeePreface || !showPreface) && state.didCompleteTutorial && !state.didAgreeToTerms) {
    return Screens.Terms
  }

  if (state.didSeePreface || !showPreface) {
    return Screens.Onboarding
  }

  return Screens.Preface
}

// useEffect(()=>{
// if(onboardingComplete){

// }
// })

/**
 * To customize this splash screen set the background color of the
 * iOS and Android launch screen to match the background color of
 * of this view.
 */
const WalletAnimationScreen: React.FC = () => {
  const [isInitAgentCalled, setIsInitAgentCalled] = useState(false)
  const { indyLedgers, showPreface } = useConfiguration()
  const { setAgent } = useAgent()
  const { t } = useTranslation()
  const [store, dispatch] = useStore()
  const navigation = useNavigation()
  const { getWalletCredentials } = useAuth()
  const { ColorPallet } = useTheme()
  const { height } = Dimensions.get('window');

  const { LoadingIndicator } = useAnimatedComponents()
  const wa1Position = useRef(new Animated.Value(-100)).current;
  const wa2Position = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(wa1Position, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }),
      Animated.timing(wa2Position, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }),
    ]).start();
  }, [wa1Position, wa2Position]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: ColorPallet.brand.primaryBackground,
    },
  })

  const loadAuthAttempts = async (): Promise<LoginAttemptState | undefined> => {
    const attempts = await loadLoginAttempt()
    if (attempts) {
      dispatch({
        type: DispatchAction.ATTEMPT_UPDATED,
        payload: [attempts],
      })
      return attempts
    }
  }

  useEffect(() => {
    if (store.authentication.didAuthenticate) {
      return
    }

    const initOnboarding = async (): Promise<void> => {
      console.log("in ininitOnboarding at function")
      try {
        // load authentication attempts from storage
        const attemptData = await loadAuthAttempts()

        const preferencesData = await AsyncStorage.getItem(LocalStorageKeys.Preferences)
        if (preferencesData) {
          const dataAsJSON = JSON.parse(preferencesData) as PreferencesState

          dispatch({
            type: DispatchAction.PREFERENCES_UPDATED,
            payload: [dataAsJSON],
          })
        }

        const migrationData = await AsyncStorage.getItem(LocalStorageKeys.Migration)
        if (migrationData) {
          const dataAsJSON = JSON.parse(migrationData) as MigrationState

          dispatch({
            type: DispatchAction.MIGRATION_UPDATED,
            payload: [dataAsJSON],
          })
        }

        const toursData = await AsyncStorage.getItem(LocalStorageKeys.Tours)
        if (toursData) {
          const dataAsJSON = JSON.parse(toursData) as ToursState

          dispatch({
            type: DispatchAction.TOUR_DATA_UPDATED,
            payload: [dataAsJSON],
          })
        }

        const data = await AsyncStorage.getItem(LocalStorageKeys.Onboarding)
        if (data) {
          const onboardingState = JSON.parse(data) as StoreOnboardingState
          dispatch({ type: DispatchAction.ONBOARDING_UPDATED, payload: [onboardingState] })
          if (onboardingComplete(onboardingState)) {
            // if they previously completed onboarding before wallet naming was enabled, mark complete
            if (!store.onboarding.didNameWallet) {
              dispatch({ type: DispatchAction.DID_NAME_WALLET, payload: [true] })
            }

            // if they previously completed onboarding before preface was enabled, mark seen
            if (!store.onboarding.didSeePreface) {
              dispatch({ type: DispatchAction.DID_SEE_PREFACE })
            }

            if (!attemptData?.lockoutDate) {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: Screens.EnterPIN }],
                })
              )
            } else {
              // return to lockout screen if lockout date is set
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: Screens.AttemptLockout }],
                })
              )
            }
            return
          } else {
            // If onboarding was interrupted we need to pickup from where we left off.
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [
                  { name: resumeOnboardingAt(onboardingState, store.preferences.enableWalletNaming, showPreface) },
                ],
              })
            )
          }
          return
        }
        // We have no onboarding state, starting from step zero.
        if (showPreface) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: Screens.Preface }],
            })
          )
        } else {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: Screens.Onboarding }],
            })
          )
        }
      } catch (err: unknown) {
        const error = new BifoldError(
          t('Error.Title1044'),
          t('Error.Message1044'),
          (err as Error)?.message ?? err,
          1044
        )
        DeviceEventEmitter.emit(EventTypes.ERROR_ADDED, error)
      }
    }

    initOnboarding()
  }, [store.authentication.didAuthenticate])

  useEffect(() => {
    if (!store.authentication.didAuthenticate || !store.onboarding.didConsiderBiometry) {
      setIsInitAgentCalled(false)
      return
    }

    const initAgent = async (): Promise<void> => {
      console.log("in initagent function")
      try {
        const credentials = await getWalletCredentials()

        if (!credentials?.id || !credentials.key) {
          // Cannot find wallet id/secret
          return
        }

        const newAgent = new Agent({
          config: {
            label: store.preferences.walletName || 'Aries Bifold',
            walletConfig: {
              id: credentials.id,
              key: credentials.key,
            },
            logger: new ConsoleLogger(LogLevel.trace),
            autoUpdateStorageOnStartup: true,
          },
          dependencies: agentDependencies,
          modules: getAgentModules({
            indyNetworks: indyLedgers,
            mediatorInvitationUrl: Config.MEDIATOR_URL,
          }),
        })
        const wsTransport = new WsOutboundTransport()
        const httpTransport = new HttpOutboundTransport()

        newAgent.registerOutboundTransport(wsTransport)
        newAgent.registerOutboundTransport(httpTransport)

        // If we haven't migrated to Aries Askar yet, we need to do this before we initialize the agent.
        if (!didMigrateToAskar(store.migration)) {
          newAgent.config.logger.debug('Agent not updated to Aries Askar, updating...')

          await migrateToAskar(credentials.id, credentials.key, newAgent)

          newAgent.config.logger.debug('Successfully finished updating agent to Aries Askar')
          // Store that we migrated to askar.
          dispatch({
            type: DispatchAction.DID_MIGRATE_TO_ASKAR,
          })
        }

        await newAgent.initialize()

        await createLinkSecretIfRequired(newAgent)

        setAgent(newAgent)
        // navigation.dispatch(
        //   CommonActions.reset({
        //     index: 0,
        //     routes: [{ name: Stacks.TabStack }],
        //   })
        // )
      } catch (err: unknown) {
        const error = new BifoldError(
          t('Error.Title1045'),
          t('Error.Message1045'),
          (err as Error)?.message ?? err,
          1045
        )
        DeviceEventEmitter.emit(EventTypes.ERROR_ADDED, error)
      }
    }

    initAgent()
  }, [store.authentication.didAuthenticate, store.onboarding.didConsiderBiometry])



//   return (
//     <SafeAreaView>
//       <View style={{ backgroundColor: '#733DF5', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//         {/* <Image source={falcon} resizeMode='contain' className="w-32 h-32 mb-3" /> */}
//         <Logo width={150} height={150} />
//         <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>Falcon ID</Text>
//       </View>
//     </SafeAreaView>
//   )
// }


// const WalletAnimationScreen: React.FC<WalletAnimationScreenProps> = () => {
  // const navigation = useNavigation()

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     navigation.navigate('HomeScreen')
  //   }, 2000)

  //   return () => {
  //     console.log('SplashScreen unmounted')
  //     clearTimeout(timer)
  //   }
  // }, [navigation])



  return (
    <View style={{ backgroundColor: '#F0F5FF', width: '100%', height: '100%', position: 'relative' }}>
      <View style={{ width: '100%', height: '80%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {/* <Image source={animation} resizeMode='contain' /> */}
        {/* //<Animation /> */}
        <Animated.View style={{ position: 'absolute', top: '30%', transform: [{ translateY: wa1Position }] }}>
        <Wa1 width={250} height={250} />
      </Animated.View>
      <Animated.View style={{ position: 'absolute',bottom:'5%', transform: [{ translateY: wa2Position }] }}>
        <Wa2 width={300} height={300} />
      </Animated.View>
      </View>
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: '20%' }}>
        <LoadingIndicator />
        <Text style={{ alignSelf: 'center', color: '#5869E6' }}>Creating your wallet</Text>
      </View>
    </View>
  )
}

export default WalletAnimationScreen