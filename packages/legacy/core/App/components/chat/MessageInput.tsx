// import InputField from '../.. components/falcon/InputField'
import React from 'react'
import { Composer, InputToolbar, Send } from 'react-native-gifted-chat'
import Icon from 'react-native-vector-icons/Feather'

export const renderInputToolbar = (props: any, theme: any) => (
  <InputToolbar
    {...props}
    containerStyle={{
      justifyContent: 'center',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      alignSelf: 'center',
      backgroundColor: 'white',
      borderWidth: 2,
      width: '90%',
      borderRadius: 12,
      borderColor: '#CBCBCC',
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 2,
    }}
    textInputStyle={{ color: 'black' }} 
  />
);

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
    <Icon name="send" size={32} color={props.text ? '#5869E6': 'black'} />
  </Send>
)
