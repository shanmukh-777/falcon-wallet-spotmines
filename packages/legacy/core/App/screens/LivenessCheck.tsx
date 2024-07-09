import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Image, Alert, TextStyle } from 'react-native'
import { FONT_STYLE_2, FONT_STYLE_1, BUTTON_STYLE2 } from './../constants/fonts'
import Icon from 'react-native-vector-icons/Feather'
import { useNavigation } from '@react-navigation/core'
import { Screens } from './../types/navigators'
import {WebView} from "react-native-webview"

const OpenCamera = () => {
  const navigation = useNavigation()
  const [showwebView,setShowWebView] = useState(false)

  const WebViewComponent = () => {
    return <WebView source={{ uri: 'https://aadhaar-liveness-check.vercel.app/' }} style={{ flex: 1 }} />;
  }

  return (
    <>
    {showwebView ? 
      (<WebViewComponent />)
      :
      (
        <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100%',
        paddingTop: '50%',
      }}
    >
      <View
        style={{
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
        }}
      >
        <View
          style={{
            width: '90%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={[FONT_STYLE_2 as TextStyle, { color: 'black', fontSize: 14 }]}>Open camera to click photo</Text>
          <TouchableOpacity style={{ backgroundColor: 'blue', padding: 2, borderRadius: 12 }} onPress={() => setShowWebView(true)}>
            <Icon name="camera" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
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
      onPress={() => {
        navigation.navigate(Screens.Terms)
      }}
    >
      <Text style={{ fontSize: 14, color: 'white' }}>Confirm</Text>
    </TouchableOpacity>
    </View>
      )
    }
    </>
  )


}

export default OpenCamera

