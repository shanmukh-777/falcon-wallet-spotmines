import { useNavigation } from '@react-navigation/core'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, Modal, Pressable, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Qr from '../../assets/icons/qr.svg'
import { hitSlop } from '../../constants'
import { useConfiguration } from '../../contexts/configuration'
import { useTheme } from '../../contexts/theme'
import { QrCodeScanError } from '../../types/error'
import { Screens } from '../../types/navigators'
import { testIdWithKey } from '../../utils/testable'
import InfoBox, { InfoBoxType } from '../misc/InfoBox'
import Ionicons from 'react-native-vector-icons/Ionicons';
import QRScannerTorch from './QRScannerTorch'
import ScanCamera from './ScanCamera'

interface Props {
  handleCodeScan: (value: string) => Promise<void>
  error?: QrCodeScanError | null
  enableCameraOnError?: boolean
}

const QRScanner: React.FC<Props> = ({ handleCodeScan, error, enableCameraOnError }) => {
  const navigation = useNavigation()
  const { showScanHelp, showScanButton } = useConfiguration()
  const [torchActive, setTorchActive] = useState(false)
  const [showInfoBox, setShowInfoBox] = useState(false)
  const { t } = useTranslation()
  const { ColorPallet, TextTheme } = useTheme()

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    viewFinder: {
      width: 250,
      height: 250,
      borderRadius: 24,
      borderWidth: 2,
      borderColor: ColorPallet.grayscale.white,
    },
    viewFinderContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    messageContainer: {
      marginHorizontal: 40,
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'center',
      paddingTop: 30,
    },
    icon: {
      color: ColorPallet.grayscale.white,
      padding: 4,
    },
    textStyle: {
      ...TextTheme.title,
      color: 'white',
      marginHorizontal: 10,
      textAlign: 'center',
    },
    iconContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      width: '100%',
      paddingHorizontal: '10%',
      position: 'absolute',
      top: '10%',
      zIndex: 2
  },
  iconButton: {
      backgroundColor: '#5869E6',
      padding: 12,
      borderRadius: 12,
      zIndex: 1
  },
  crossButton: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12
},
innerBox: {
  // position: 'absolute',
  width: 226,
  height: 226,
  borderRadius: 5, // Adjust the border radius here
  borderWidth: 5,
  borderColor: 'transparent',
  opacity: 0.75,
},
corner: {
  width: 85, // Adjust the width of the corner dashes
  height: 85, // Adjust the height of the corner dashes
  borderWidth: 5,
  borderColor: '#5869E6',
  position: 'absolute',
  borderRadius: 12
},
topLeft: {
  top: -1,
  left: -1,
  borderRightWidth: 0,
  borderBottomWidth: 0,
},
topRight: {
  top: -1,
  right: -1,
  borderLeftWidth: 0,
  borderBottomWidth: 0,
},
bottomLeft: {
  bottom: -1,
  left: -1,
  borderRightWidth: 0,
  borderTopWidth: 0,
},
bottomRight: {
  bottom: -2,
  right: -1,
  borderLeftWidth: 0,
  borderTopWidth: 0,
},
infoBox: {
  position: 'absolute',
  bottom: '10%',
  alignSelf:'center',
  backgroundColor: 'white',
  width: '90%',
  borderRadius: 12,
  paddingHorizontal: '3%',
  paddingVertical: '3%'
},
infoText: {
  fontWeight: 'bold',
  color: 'black'

}
  })
  const getFontSize = () => {
    return screenHeight < 600 ? screenHeight * 0.015 : screenHeight * 0.017;
};
const { height: screenHeight } = Dimensions.get('window');


  const styleForState = ({ pressed }: { pressed: boolean }) => [{ opacity: pressed ? 0.2 : 1 }]

  const toggleShowInfoBox = () => setShowInfoBox(!showInfoBox)

  return (
    <Modal style={styles.container}>
      <Modal visible={showInfoBox} animationType="fade" transparent>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 10,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.6)',
          }}
        >
          <InfoBox
            notificationType={InfoBoxType.Info}
            title={t('Scan.BadQRCode')}
            description={t('Scan.BadQRCodeDescription')}
            onCallToActionPressed={toggleShowInfoBox}
          />
        </View>
      </Modal>
      <ScanCamera handleCodeScan={handleCodeScan} error={error} enableCameraOnError={enableCameraOnError}></ScanCamera>
      <View style={{ flex: 1 }}>
        {/* <View style={styles.messageContainer}>
          {error ? (
            <>
              <Icon style={styles.icon} name="cancel" size={40} />
              <Text testID={testIdWithKey('ErrorMessage')} style={styles.textStyle}>
                {error.message}
              </Text>
            </>
          ) : (
            <>
              <Icon name="qrcode-scan" size={40} style={styles.icon} />
              <Text style={styles.textStyle}>{t('Scan.WillScanAutomatically')}</Text>
            </>
          )}
        </View> */}
         <View style={styles.iconContainer}>
                    {/* <TouchableOpacity style={styles.iconButton} >
                    <Qr/>
                    </TouchableOpacity> */}
                    <TouchableOpacity style={styles.crossButton} onPress={()=>navigation.goBack()}>
                        <Ionicons name="close" size={24} color="black" />
                    </TouchableOpacity>
                </View>
        <View style={styles.viewFinderContainer}>
          <View style={styles.viewFinder} />
        </View>
         {/* <View style={styles.viewFinderContainer}>
                    <View style={[styles.corner, styles.topLeft]} />
                    <View style={[styles.corner, styles.topRight]} />
                    <View style={[styles.corner, styles.bottomLeft]} />
                    <View style={[styles.corner, styles.bottomRight]} />
                </View> */}
        {/* {showScanButton && (
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Pressable
              accessibilityLabel={t('Scan.ScanNow')}
              accessibilityRole={'button'}
              testID={testIdWithKey('ScanNow')}
              onPress={toggleShowInfoBox}
              style={styleForState}
              hitSlop={hitSlop}
            >
              <Icon name="circle-outline" size={60} style={{ color: 'white', marginBottom: -15 }} />
            </Pressable>
          </View>
        )}

        <View style={{ marginHorizontal: 24, height: 24, marginBottom: 60, flexDirection: 'row' }}>
          {showScanHelp && (
            <Pressable
              accessibilityLabel={t('Scan.ScanHelp')}
              accessibilityRole={'button'}
              testID={testIdWithKey('ScanHelp')}
              // @ts-ignore
              onPress={() => navigation.navigate(Screens.ScanHelp)}
              style={styleForState}
              hitSlop={hitSlop}
            >
              <Icon name="help-circle" size={24} style={{ color: 'white' }} />
            </Pressable>
          )}

          <View style={{ width: 10, marginLeft: 'auto' }} />
          <QRScannerTorch active={torchActive} onPress={() => setTorchActive(!torchActive)} />
        </View> */}
           <View style={styles.infoBox}>
                    <Text style={styles.infoText}>
                        Scan QR code to contact others.
                    </Text>
                    <Text style={{ fontSize: getFontSize(), color: 'black' }}>
                        You will be able to add your VC provider or others as a contact after scanning the QR code on their website.
                    </Text>
                </View>
      </View>
    </Modal>
  )
}

export default QRScanner
