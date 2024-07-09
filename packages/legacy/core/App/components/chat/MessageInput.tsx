// import InputField from '../.. components/falcon/InputField'
import React, { useState } from 'react'
import { Text, TextInput, View } from 'react-native'
import { Composer, InputToolbar, Send } from 'react-native-gifted-chat'
import Icon from 'react-native-vector-icons/Feather'


export const renderInputToolbar = (props: any, theme: any) => (
  
  // <View style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
  //   <View style={{width:'50%',borderWidth:2,borderColor:'red'}}>
  //     <Text>Requets</Text>
  //   </View>
  //   <InputToolbar {...props} containerStyle={{right:0,width:'50%',height:'auto',backgroundColor:'white',color:'black',borderWidth:1,borderColor:'#5869E6',paddingHorizontal:15,paddingVertical:7,borderRadius:10,}} placeholder='Enter your name' placeholderTextColor={'grey'} 
  //                          />
     <InputToolbar
      {...props}
      containerStyle={{
        justifyContent: 'center',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        position:'absolute',
        alignSelf: 'center',
        backgroundColor: 'white',
        borderWidth: 2,
        width: '100%',
        borderRadius: 12,
        borderColor: '#CBCBCC',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
      }}
      textInputStyle={{ color: 'black' }}
    /> 
  // </View>
)

// export const renderComposer = (props: any, theme: any, placeholder: string) => (
//   <Composer
//     {...props}
//     textInputStyle={{
//       ...theme.inputText,
//     }}
//     placeholder={placeholder}
//     placeholderTextColor={theme.placeholderText}
//     // the placeholder is read by accessibility features when multiline is enabled so a label is not necessary (results in double announcing if used)
//     textInputProps={{ accessibilityLabel: '' }}
//   />
// )

export const renderSend = (props: any, theme: any) => (
  <Send
    {...props}
    alwaysShowSend={true}
    disabled={!props.text}
    containerStyle={{
      ...theme.sendContainer,
    }}
  >
    <Icon name="send" size={32} color={props.text ? '#5869E6' : 'black'} />
  </Send>
)
