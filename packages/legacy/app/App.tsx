import {
  AgentProvider,
  TourProvider,
  homeTourSteps,
  credentialsTourSteps,
  credentialOfferTourSteps,
  proofRequestTourSteps,
  CommonUtilProvider,
  AuthProvider,
  ConfigurationProvider,
  NetworkProvider,
  StoreProvider,
  ThemeProvider,
  theme,
  initLanguages,
  initStoredLanguage,
  translationResources,
  ErrorModal,
  toastConfig,
  RootStack,
  NetInfo,
  defaultConfiguration,
  animatedComponents,
  AnimatedComponentsProvider,
} from '@hyperledger/aries-bifold-core'
import * as React from 'react'
import { useEffect, useMemo,useState } from 'react'
import { StatusBar,StatusBarStyle } from 'react-native'
import { isTablet } from 'react-native-device-info'
import Orientation from 'react-native-orientation-locker'
import SplashScreen from 'react-native-splash-screen'
import Toast from 'react-native-toast-message'
import * as Font from 'react-native';
import PlusJakartaSansRegular from '../core/App/assets/fonts/static/PlusJakartaSans-Regular.ttf';
import { useColorScheme } from 'react-native';

initLanguages(translationResources)

const App = () => {
  useMemo(() => {
    initStoredLanguage().then()
  }, [])

  useEffect(() => {
    // Hide the native splash / loading screen so that our
    // RN version can be displayed.
    SplashScreen.hide()
  }, [])

  if (!isTablet()) {
    Orientation.lockToPortrait()
  }

  const colorScheme = useColorScheme();
  // const [statusBarStyle, setStatusBarStyle] = useState('dark-content'); // Default to dark-content
  const [statusBarStyle, setStatusBarStyle] = useState<StatusBarStyle>('dark-content'); // Default to dark-content
  const [statusBarBackgroundColor, setStatusBarBackgroundColor] = useState('white'); // Default background color

  useEffect(() => {
    // Check the color scheme and set the status bar style and background color accordingly
    if (colorScheme === 'light') {
      setStatusBarStyle('dark-content'); // For light mode, use dark-content for black text
      setStatusBarBackgroundColor('white'); // Set light mode background color
    } else {
      setStatusBarStyle('light-content'); // For dark mode, use light-content for white text
      setStatusBarBackgroundColor('black'); // Set dark mode background color
    }
  }, [colorScheme]);


  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'PlusJakartaSans-Regular': PlusJakartaSansRegular,
        // Add more fonts as needed
      });
    };

    loadFonts();
  }, []);



  return (
    <StoreProvider>
      <AgentProvider>
        <ThemeProvider value={theme}>
          <AnimatedComponentsProvider value={animatedComponents}>
            <ConfigurationProvider value={defaultConfiguration}>
              <CommonUtilProvider>
                <AuthProvider>
                  <NetworkProvider>
                    {/* <StatusBar
                      hidden={false}
                      barStyle="light-content"
                      backgroundColor={theme.ColorPallet.brand.primary}
                      translucent={false}
                    /> */}
                    <StatusBar
                      hidden={false}
                      // barStyle="dark-content"
                      barStyle={statusBarStyle}
                      // backgroundColor="white"
                      backgroundColor={statusBarBackgroundColor} // Set your desired background color
                      translucent={false}
                    />
                    <NetInfo />
                    <ErrorModal />
                    <TourProvider
                      homeTourSteps={homeTourSteps}
                      credentialsTourSteps={credentialsTourSteps}
                      credentialOfferTourSteps={credentialOfferTourSteps}
                      proofRequestTourSteps={proofRequestTourSteps}
                      overlayColor={'gray'}
                      overlayOpacity={0.7}
                    >
                      <RootStack />
                    </TourProvider>
                    <Toast topOffset={15} config={toastConfig} />
                  </NetworkProvider>
                </AuthProvider>
              </CommonUtilProvider>
            </ConfigurationProvider>
          </AnimatedComponentsProvider>
        </ThemeProvider>
      </AgentProvider>
    </StoreProvider>
  )
}

export default App
