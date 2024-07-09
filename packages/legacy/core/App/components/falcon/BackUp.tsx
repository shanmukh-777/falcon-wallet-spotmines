import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextStyle } from 'react-native';
import Icon from "react-native-vector-icons/AntDesign";
import { FONT_STYLE_2 } from '../../constants/fonts';
// import DocumentPicker  from 'react-native-document-picker';
import {
    Agent,
    AutoAcceptCredential,
    ConsoleLogger,
    HttpOutboundTransport,
    LogLevel,
    MediatorPickupStrategy,
    WsOutboundTransport
  } from '@aries-framework/core'

import { useAgent } from '@aries-framework/react-hooks'
import { agentDependencies } from '@aries-framework/react-native'

import { Config } from 'react-native-config'
import DocumentPicker, {
  DirectoryPickerResponse,
  DocumentPickerResponse,
  isInProgress
} from 'react-native-document-picker'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import indyLedgers from '../../configs/ledgers/indy'
import { ToastType } from '../../components/toast/BaseToast'
import { DispatchAction } from '../../contexts/reducers/store'
import { useStore } from '../../contexts/store'
import { useTheme } from '../../contexts/theme'
import { testIdWithKey } from '../../utils/testable'
import { useTranslation } from 'react-i18next';
import { useAppAgent } from '../../utils/agent';


const BackUp: React.FC = () => {
    

    // const handleFileUpload = async () => {
    //     try {
    //         const result = await DocumentPicker.pick({
    //             type: [DocumentPicker.types.zip],  // Restrict to zip files
    //         });

    //         if (result.length > 0) {
    //             setBackupPath(result[0].uri);
    //         }
    //     }catch (error) {
    //         if (DocumentPicker.isCancel(error)) {
    //             console.log('User cancelled the picker');
    //         } else {
    //             console.error('Error picking document', error);
    //         }
    //     }
    // };

   


    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
            <Text style={[styles.text, FONT_STYLE_2 as TextStyle]}>Select backup file</Text>
            </View>
            <TouchableOpacity style={styles.button}>
                <Icon name="addfile" size={24} color="white"/>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width:'90%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderColor: '#733DF5',
        borderWidth: 3,
        borderStyle: 'dashed',
        padding: 10,
        borderRadius: 10,
        marginTop: 20,
        backgroundColor: '#F8F9FA' // Adjust the background color as needed
    },
    textContainer: {
        width: '80%',
    },
    text: {
        color: 'black',
        fontSize: 14,
    },
    button: {
        backgroundColor: '#5869E6', // Adjust the color as per your theme
        padding: 8,
        borderRadius: 10,
    },
});

export default BackUp;
