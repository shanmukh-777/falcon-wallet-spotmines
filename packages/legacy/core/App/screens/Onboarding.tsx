import { useNavigation } from '@react-navigation/core'
import { useFocusEffect } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { Ref, useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Animated, BackHandler, FlatList, View, useWindowDimensions , TextStyle} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import HeaderButton, { ButtonLocation } from '../components/buttons/HeaderButton'
import { Pagination } from '../components/misc/Pagination'
import { DispatchAction } from '../contexts/reducers/store'
import { useStore } from '../contexts/store'
import { AuthenticateStackParams, Screens } from '../types/navigators'
import { testIdWithKey } from '../utils/testable'

import { Text, Image, TouchableOpacity, Dimensions } from 'react-native'
import ServiceHeadings from './../components/falcon/ServiceHeadings'
import Amico11 from './../assets/icons/amico11.svg'
import Amico12 from './../assets/icons/amico12.svg'
import Amico13 from './../assets/icons/amico13.svg'
import { FONT_STYLE_1, FONT_STYLE_2, FONT_STYLE_3, BUTTON_STYLE1, BUTTON_STYLE2 } from './../constants/fonts';

export interface OnboardingStyleSheet {
  container: Record<string, any>
  carouselContainer: Record<string, any>
  pagerContainer: Record<string, any>
  pagerDot: Record<string, any>
  pagerDotActive: Record<string, any>
  pagerDotInactive: Record<string, any>
  pagerPosition: Record<string, any>
  pagerNavigationButton: Record<string, any>
}

interface OnboardingProps {
  pages: Array<Element>
  nextButtonText: string
  previousButtonText: string
  style: OnboardingStyleSheet
  disableSkip?: boolean
}

// const Onboarding: React.FC<OnboardingProps> = ({
//   pages,
//   nextButtonText,
//   previousButtonText,
//   style,
//   disableSkip = false,
// }) => {
//   const [activeIndex, setActiveIndex] = useState(0)
//   const flatList: Ref<FlatList> = useRef(null)
//   const scrollX = useRef(new Animated.Value(0)).current
//   const { t } = useTranslation()
//   const navigation = useNavigation<StackNavigationProp<AuthenticateStackParams>>()
//   const [, dispatch] = useStore()
//   const { width } = useWindowDimensions()

//   const onViewableItemsChangedRef = useRef(({ viewableItems }: any) => {
//     if (!viewableItems[0]) {
//       return
//     }

//     setActiveIndex(viewableItems[0].index)
//   })

//   const viewabilityConfigRef = useRef({
//     viewAreaCoveragePercentThreshold: 60,
//   })

//   const onScroll = Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
//     useNativeDriver: false,
//   })

//   const next = () => {
//     if (activeIndex + 1 < pages.length) {
//       flatList?.current?.scrollToIndex({
//         index: activeIndex + 1,
//         animated: true,
//       })
//     }
//   }

//   const previous = () => {
//     if (activeIndex !== 0) {
//       flatList?.current?.scrollToIndex({
//         index: activeIndex - 1,
//         animated: true,
//       })
//     }
//   }

//   const renderItem = useCallback(
//     ({ item, index }: { item: Element; index: number }) => (
//       <View key={index} style={[{ width }, style.carouselContainer]}>
//         {item as React.ReactNode}
//       </View>
//     ),
//     []
//   )

//   const onSkipTouched = () => {
//     dispatch({
//       type: DispatchAction.DID_COMPLETE_TUTORIAL,
//     })

//     navigation.navigate(Screens.Terms)
//   }

//   useEffect(() => {
//     !disableSkip &&
//       navigation.setOptions({
//         headerRight: () => (
//           <HeaderButton
//             buttonLocation={ButtonLocation.Right}
//             accessibilityLabel={t('Onboarding.SkipA11y')}
//             testID={testIdWithKey('Skip')}
//             onPress={onSkipTouched}
//             icon="chevron-right"
//             text={t('Global.Skip')}
//           />
//         ),
//       })

//     if (!disableSkip && activeIndex + 1 === pages.length) {
//       navigation.setOptions({
//         headerRight: () => false,
//       })
//     }
//   }, [activeIndex])

//   useFocusEffect(
//     useCallback(() => {
//       const onBackPress = () => {
//         BackHandler.exitApp()

//         return true
//       }

//       BackHandler.addEventListener('hardwareBackPress', onBackPress)

//       return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress)
//     }, [])
//   )

//   return (
//     <SafeAreaView style={style.container} edges={['left', 'right', 'bottom']}>
//       <FlatList
//         ref={flatList}
//         horizontal
//         pagingEnabled
//         showsHorizontalScrollIndicator={false}
//         style={[{ width }]}
//         data={pages}
//         renderItem={renderItem}
//         viewabilityConfig={viewabilityConfigRef.current}
//         onViewableItemsChanged={onViewableItemsChangedRef.current}
//         onScroll={onScroll}
//         scrollEventThrottle={16}
//       />
//       <Pagination
//         pages={pages}
//         activeIndex={activeIndex}
//         nextButtonText={nextButtonText}
//         previousButtonText={previousButtonText}
//         scrollX={scrollX}
//         style={style}
//         next={next}
//         previous={previous}
//       />
//     </SafeAreaView>
//   )
// }
const Onboarding: React.FC<OnboardingProps> = ({
}) => {
  // const navigation = useNavigation()
  const navigation = useNavigation<StackNavigationProp<AuthenticateStackParams>>()
  const screenHeight = Math.round(Dimensions.get('window').height)
  const imageComponents = [Amico11, Amico12, Amico13]
  const screenWidth = Math.round(Dimensions.get('window').width)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [walletInitialized, setWalletInitialized] = useState(false)
  const [networkConnected, setNetworkConnected] = useState(false)
  const [, dispatch] = useStore()

  const [activeIndex, setActiveIndex] = useState(0)
  const styles = {
    border: {
      borderColor: '#5869E6',
      borderWidth: 1,
    },
  }

  const getFontSizeh = () => {
    return screenHeight < 600 ? screenHeight * 0.015 : screenHeight * 0.025
  }
  const getFontSize = () => {
    return screenHeight < 600 ? screenHeight * 0.015 : screenHeight * 0.017
  }
  const getSpace = () => {
    return screenHeight < 600 ? screenHeight * 0.015 : screenHeight * 0.08
  }
  const onSkipTouched = () => {
    dispatch({
      type: DispatchAction.DID_COMPLETE_TUTORIAL,
    })

    // navigation.navigate(Screens.Terms)
    navigation.navigate(Screens.CreatePIN)

  }


  const dynamicStyles = {
    container: {
      position: 'absolute' as 'absolute',
      top: screenHeight < 600 ? screenHeight * 0.05 : screenHeight * 0.12,
      left: screenHeight < 600 ? screenWidth * 0.1 : screenWidth * 0.15,
      width: screenHeight < 600 ? screenWidth * 0.7 : undefined,
    },
  }

  useEffect(() => {
    console.log(screenHeight)
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageComponents.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  return (
    <SafeAreaView>
      <View style={{ width: '100%', height: '100%', position: 'relative', backgroundColor: 'white' }}>
        <View style={{ width: '100%', height: '40%', backgroundColor: '#5869E6', borderBottomRightRadius: 800, opacity: 0.3 }} />

        {React.createElement(imageComponents[currentImageIndex], { style: dynamicStyles.container })}

        <View style={{ width: '90%', marginHorizontal: 'auto', height: '43%', paddingTop: '20%', display: 'flex', alignSelf:'center' }}>
          {/* <Text style={{ ...FONT_STYLE_2, fontSize: getFontSizeh(), color: 'black' }}>My Identity, My Wallet</Text> */}
          <Text style={[FONT_STYLE_2 as TextStyle, { fontSize: getFontSizeh(), color: 'black' }]}>My Identity, My Wallet</Text>
          <ServiceHeadings />
          <Text style={{ fontSize: getFontSize(), marginTop: getSpace(), width: '80%', color: 'black', alignContent: 'flex-start' }}>
            By clicking, I accept the <Text style={{ color: '#5869E6' }}>terms of service</Text> and <Text style={{ color: '#5869E6' }}>privacy policy</Text>.
          </Text>
        </View>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignSelf:'center', width: '90%', marginHorizontal: 'auto', marginTop: screenHeight < 600 ? '5%' : '14%' }}>
          <TouchableOpacity style={{ ...BUTTON_STYLE1, borderRadius: 10, backgroundColor: '#F0F5FF', display: 'flex', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#5869E6', paddingHorizontal: '6%', paddingVertical: '3%' }}  onPress={()=>{navigation.navigate(Screens.ImportFile)}} >
            <Text style={[ FONT_STYLE_1 as TextStyle, {fontSize: getFontSize(), color: '#5869E6' }]}>Recover Wallet</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              ...BUTTON_STYLE2,
              backgroundColor: '#5869E6',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
              paddingHorizontal: '6%',
              paddingVertical: '3%'
            }}
            onPress={onSkipTouched} // Change onPress handler to onSkipTouched
          >

            <Text style={[FONT_STYLE_1 as TextStyle, {fontSize: getFontSize(), color: 'white' }]}>Create Wallet</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>)

}


export default Onboarding