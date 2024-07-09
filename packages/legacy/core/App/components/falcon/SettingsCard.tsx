import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, DeviceEventEmitter } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
// import ToggleButton from '../DesignSystem/ToggleBuutton';
import { useNavigation } from '@react-navigation/native';
import ToggleBuutton from './ToggleBuutton';
import { EventTypes } from '../../constants'
import { useStore } from '../../contexts/store'
import { useAuth } from '../../contexts/auth';
import { DispatchAction } from '../../contexts/reducers/store'


interface settingcardprops{
    icon:boolean,
    heading:string,
    context:string,
    onToggle?: () => void;
}

const SettingsCard:React.FC <settingcardprops> = ({ icon, heading, context,onToggle}) => {
    const [showHelloWorld, setShowHelloWorld] = useState(false);
    const navigation = useNavigation();
    const { isBiometricsActive, commitPIN, disableBiometrics } = useAuth()
    const handleTogglePress = () => {
        setShowHelloWorld(!showHelloWorld);
    }
    const [store, dispatch] = useStore()
    const [biometryEnabled, setBiometryEnabled] = useState(store.preferences.useBiometry)
    const [backupEnabled, setBackupEnabled] = useState(false)

    useEffect(() => {
       
        if (biometryEnabled) {
          commitPIN(biometryEnabled).then(() => {
            dispatch({
              type: DispatchAction.USE_BIOMETRY,
              payload: [biometryEnabled],
            })
          })
        } else {
          disableBiometrics().then(() => {
            dispatch({
              type: DispatchAction.USE_BIOMETRY,
              payload: [biometryEnabled],
            })
          })
        }
      }, [biometryEnabled])


    const toggleSwitch = () => {
      // If the user is toggling biometrics on/off they need
      // to first authenticate before this action is accepted
      // if (screenUsage === UseBiometryUsage.ToggleOnOff) {
      //   setCanSeeCheckPIN(true)
      //   DeviceEventEmitter.emit(EventTypes.BIOMETRY_UPDATE, true)
      //   return
      // }
      DeviceEventEmitter.emit(EventTypes.BIOMETRY_UPDATE, true)
        console.log("togle orejfj")
      setBiometryEnabled((previousState) => !previousState)

    //     setBiometryEnabled((previousState) => !previousState)
      
    //   DeviceEventEmitter.emit(EventTypes.BIOMETRY_UPDATE, false)
    }


    const screenHeight = Math.round(Dimensions.get('window').height);
    const getFontSizeh = () => {
        return screenHeight < 600 ? screenHeight * 0.015 : screenHeight * 0.020;
    };
    const getFontSize = () => {
        return screenHeight < 600 ? screenHeight * 0.015 : screenHeight * 0.017;
    };

    const handleBackupToggle = () => {
      setBackupEnabled((previousState) => !previousState);
      if (onToggle) onToggle();
    };

    return (
        <View  style={{backgroundColor:'white',width:'100%',display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center',borderBottomWidth:1,borderBottomColor:'#B9B9B9' ,paddingHorizontal:15,paddingVertical:10,marginBottom:'3%'}}>
            <View style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'flex-start',gap:3,width:'80%'}}>
                <Text style={[styles.title, { fontSize: getFontSizeh() }]}>{heading}</Text>

                <Text style={{ fontSize: getFontSize(),color:'#898A8E' }}>{context}</Text>
            </View>
            {heading === "Biometrics" ? (
        icon ? <Entypo name="chevron-right" size={32} color="black" /> : <ToggleBuutton onPress={toggleSwitch} bioenabled={biometryEnabled} backup={backupEnabled} />
      ) : heading === "Backup" ? (
        icon ? <Entypo name="chevron-right" size={32} color="black" /> : <ToggleBuutton onPress={handleBackupToggle} bioenabled={biometryEnabled} backup={backupEnabled} />
      ) : (
        icon ? <Entypo name="chevron-right" size={32} color="black" /> : <ToggleBuutton onPress={handleBackupToggle} bioenabled={biometryEnabled} backup={backupEnabled} />
      )}
                </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontWeight: '700',
        fontFamily: 'plus-jakarta-sans',
        color: '#000',
    },
    arrow: {
        fontSize: 20,
        marginTop: 10,
    },
});

export default SettingsCard;
