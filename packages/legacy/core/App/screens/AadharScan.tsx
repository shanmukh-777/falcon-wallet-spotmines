// import { View, Text } from 'react-native'
// import React from 'react'

// const AadharScan = () => {
//   return (
//     <View>
//       <Text style={{color:'black'}}>AadharScan</Text>
//     </View>
//   )
// }

// export default AadharScan;

/////2

// import React, { useState, useEffect, useCallback } from 'react';
// import { View, Text, StyleSheet, Alert } from 'react-native';
// import { Camera, useCameraDevices } from 'react-native-vision-camera';
// import { scanBarcodes, BarcodeFormat } from 'vision-camera-code-scanner';
// import { runOnJS } from 'react-native-reanimated';

// const AadharScan = () => {
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [hasPermission, setHasPermission] = useState(false);
//   const devices = useCameraDevices();
//   const [device, setDevice] = useState(null); // Use the back camera

//   // Request camera permissions on mount
//   useEffect(() => {
//     const requestCameraPermission = async () => {
//       try {
//         const permission = await Camera.requestCameraPermission();
//         console.log(permission)
//         setHasPermission(permission === 'granted');
//       } catch (error) {
//         console.error('Failed to request camera permission:', error);
//       }
//     };
//     requestCameraPermission();
//   }, []);

//   useEffect(() => {
//     if (devices && devices.length > 0) {
//       const backCamera = devices.find((d) => d.position === 'back');
//       if (backCamera) {
//         setDevice(backCamera);
//       }
//     }
//   }, [devices]);

//   // Frame processor function to handle barcode scanning
//   const frameProcessor = useCallback((frame) => {
//     'worklet'; // Ensures the function runs as a worklet
//     if (isProcessing) return; // Prevent multiple scans
  
//     const barcodes = scanBarcodes(frame, [BarcodeFormat.QR_CODE]);
//     if (barcodes.length > 0) {
//       runOnJS(setIsProcessing)(true);
//       const barcode = barcodes[0];
//       console.log('Scanned Aadhar Data:', barcode.displayValue);
  
//       // Provide feedback to the user
//       runOnJS(Alert.alert)("Aadhar Scanned", `Data: ${barcode.displayValue}`, [
//         { text: "OK", onPress: () => runOnJS(setIsProcessing)(false) }
//       ]);
//     }
//   }, [isProcessing]);

//   if (!hasPermission) {
//     return (
//       <View style={styles.loading}>
//         <Text style={{ color: 'black' }}>Requesting camera permission...</Text>
//       </View>
//     );
//   }

//   if (device == null) {
//     return (
//       <View style={styles.loading}>
//         <Text style={{ color: 'black' }}>Loading camera...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Camera
//         style={styles.camera}
//         device={device}
//         isActive={true}
//         frameProcessor={frameProcessor}
//         frameProcessorFps={5} // Adjust the frame processing rate as needed
//       >
//         <View style={styles.overlay}>
//           <Text style={styles.instructions}>Align your Aadhar card within the frame to scan</Text>
//         </View>
//       </Camera>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   camera: {
//     flex: 1,
//     width: '100%',
//   },
//   overlay: {
//     position: 'absolute',
//     top: 0,
//     bottom: 0,
//     left: 0,
//     right: 0,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay for better contrast
//   },
//   instructions: {
//     color: 'white',
//     fontSize: 18,
//     textAlign: 'center',
//     paddingHorizontal: 20,
//   },
//   loading: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default AadharScan;

//////3

// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import QRCodeScanner from 'react-native-qrcode-scanner';

// const AadharScan: React.FC = () => {
//   const [data, setData] = useState('Scan something');
//   const navigation = useNavigation();

//   return (
//     <QRCodeScanner
//       onRead={({ data }) => setData(data)}
//       reactivate={true}
//       reactivateTimeout={500}
//       topContent={
//         <View>
//           <Text>{data}</Text>
//         </View>
//       }
//     />
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   centerText: {
//     fontSize: 18,
//     color: '#fff',
//     marginBottom: 20,
//   },
//   dataContainer: {
//     marginTop: 20,
//     padding: 10,
//     backgroundColor: '#f2f2f2',
//     borderRadius: 5,
//   },
// });

// export default AadharScan;




//////4


import React, { useCallback, useEffect, useState } from 'react'
import { StyleSheet, Vibration, View, useWindowDimensions, Text, Button } from 'react-native'
import { useOrientationChange, OrientationType } from 'react-native-orientation-locker'
import { Camera, useCameraDevice, useCodeScanner, CameraPermissionStatus } from 'react-native-vision-camera'
// import { parseString } from 'react-native-xml2js'
import {WebView} from "react-native-webview"


const AadharScan: React.FC = () => {
  // const [orientation, setOrientation] = useState(OrientationType.PORTRAIT)
  // const [cameraActive, setCameraActive] = useState(true)
  // const [hasPermission, setHasPermission] = useState<CameraPermissionStatus>('not-determined')

  // const orientationDegrees: { [key: string]: string } = {
  //   [OrientationType.PORTRAIT]: '0deg',
  //   [OrientationType['LANDSCAPE-LEFT']]: '270deg',
  //   [OrientationType['PORTRAIT-UPSIDEDOWN']]: '180deg',
  //   [OrientationType['LANDSCAPE-RIGHT']]: '90deg',
  // }
  // const invalidQrCodes = new Set<string>()
  // const device = useCameraDevice('back')

  // useOrientationChange((orientationType) => {
  //   setOrientation(orientationType)
  // })

  // useEffect(() => {
  //   const requestPermission = async () => {
  //     const status =  Camera.getCameraPermissionStatus()
  //     if (status !== 'granted') {
  //       const permission = await Camera.requestCameraPermission()
  //       setHasPermission(permission)
  //     } else {
  //       setHasPermission(status)
  //     }
  //   }
  //   requestPermission()
  // }, [])



  // const codeScanner = useCodeScanner({
  //   codeTypes: ['qr', 'ean-13'],
  //   onCodeScanned: (codes) => {
  //     codes.forEach((code) => {
  //       console.log(code.value);
  //     });
  //   }
  // });
  

  // if (hasPermission !== 'granted') {
  //   return (
  //     <View style={styles.permissionContainer}>
  //       <Text style={styles.permissionText}>Camera access is required to scan QR codes</Text>
  //       <Button title="Request Permission" onPress={async () => {
  //         const permission = await Camera.requestCameraPermission()
  //         setHasPermission(permission)
  //       }} />
  //     </View>
  //   )
  // }


  const WebViewComponent = () => {
    return <WebView source={{ uri: 'https://aadhaar-liveness-check.vercel.app/aadhaar' }} style={{ flex: 1 }} />;
  }
  
  return (
    // <View style={[StyleSheet.absoluteFill, { transform: [{ rotate: orientationDegrees[orientation] ?? '0deg' }] }]}>
    //   {device && (
    //     // <Camera
    //     //   style={StyleSheet.absoluteFill}
    //     //   device={device}
    //     //   torch="off"
    //     //   isActive={cameraActive}
    //     //   codeScanner={codeScanner}
    //     // />
    //     <Camera style={StyleSheet.absoluteFill} device={device} isActive={cameraActive} codeScanner={codeScanner} />
    //   )}
    // </View>
    <WebViewComponent/>
  )
}

const styles = StyleSheet.create({
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  permissionText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
})

export default AadharScan