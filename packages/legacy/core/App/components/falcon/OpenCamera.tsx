import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextStyle, Alert } from 'react-native';
import { Camera, CameraPermissionStatus, useCameraDevice } from 'react-native-vision-camera';
import Icon from 'react-native-vector-icons/Feather';
import { FONT_STYLE_2 } from '../../constants/fonts';

const OpenCamera: React.FC = () => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<CameraPermissionStatus>('denied');
  const cameraRef = useRef<Camera>(null);
  const device = useCameraDevice('front');

  useEffect(() => {
    const requestPermissions = async () => {
      const status = await Camera.requestCameraPermission();
      setCameraPermission(status);
    };

    requestPermissions();
  }, []);

  const handleCameraButtonPress = () => {
    if (cameraPermission === 'granted') {
      setIsCameraOpen(true);
    } else {
      Alert.alert('Camera Permission', 'Camera permission is required to take a photo.');
    }
  };

  const handleCapture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePhoto();
      console.log('Captured Photo:', photo);
      setIsCameraOpen(false);
      // Handle the captured photo as needed (e.g., save or display it)
    }
  };

  if (device == null) {
    return <Text>Loading...</Text>; // Add proper loading handling
  }

  return (
    <View style={styles.container}>
      {!isCameraOpen ? (
        <View style={styles.imageContainer}>
          <Text style={{ ...FONT_STYLE_2 as TextStyle, color: 'black', fontSize: 14 }}>Open camera to click photo</Text>
          <TouchableOpacity onPress={handleCameraButtonPress} style={styles.cameraButton}>
            <Icon name="camera" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        <Camera
          style={StyleSheet.absoluteFill}
          ref={cameraRef}
          device={device}
          isActive={isCameraOpen}
          photo={true}
          // permissionDialogTitle={'Permission to use camera'}
          // permissionDialogMessage={'We need your permission to use your camera phone'}
        >
          <TouchableOpacity onPress={handleCapture} style={styles.captureButton}>
            <Text style={{ color: 'white', fontSize: 18 }}>Capture</Text>
          </TouchableOpacity>
        </Camera>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderColor: '#733DF5',
    borderWidth: 3,
    backgroundColor: 'white',
    borderStyle: 'dashed',
    padding: 10,
    borderRadius: 10,
  },
  imageContainer: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cameraButton: {
    backgroundColor: 'red',
    padding: 3,
    borderRadius: 12,
  },
  captureButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#5869E6',
    padding: 10,
    borderRadius: 5,
  },
});

export default OpenCamera;