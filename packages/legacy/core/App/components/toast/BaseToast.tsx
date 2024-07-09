import React from 'react'
import { View, Text, useWindowDimensions, StyleSheet, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

import { useTheme } from '../../contexts/theme'
import { GenericFn } from '../../types/fn'
import { testIdWithKey } from '../../utils/testable'

interface BaseToastProps {
  title?: string
  body?: string
  toastType: string
  onPress?: GenericFn
  onShow?: GenericFn
  onHide?: GenericFn
}

export enum ToastType {
  Success = 'success',
  Info = 'info',
  Warn = 'warn',
  Error = 'error',
}

const BaseToast: React.FC<BaseToastProps> = ({ title, body, toastType, onPress = () => null }) => {
  const { TextTheme, borderRadius, borderWidth, ColorPallet } = useTheme()
  const { width } = useWindowDimensions()
  const iconSize = 24
  let iconName = ''
  let backgroundColor = ''
  let borderColor = ''
  let iconColor = ''
  let textColor = ''
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'flex-start',
      flexDirection: 'row',
      marginTop: 25,
      borderWidth,
      borderRadius:20
    },
    textContainer: {
      flexShrink: 1,
      marginVertical: 15,
      marginRight: 10,
    },
    icon: {
      marginTop: 15,
      marginHorizontal: 15,
    },
    title: {
      fontWeight: TextTheme.bold.fontWeight,
    },
    body: {
      marginTop: 10,
    },
  })
  switch (toastType) {
    case ToastType.Success:
      iconName = 'check-circle-outline'
      // backgroundColor = ColorPallet.notification.success
      // borderColor = ColorPallet.notification.successBorder
      // iconColor = ColorPallet.notification.successIcon
      // textColor = ColorPallet.notification.successText
      iconName = 'error',
      backgroundColor='#F0F5FF',
      borderColor='#F0F5FF',
      iconColor='#5869E6'
      textColor='#5869E6'
      break

    case ToastType.Info:
      iconName = 'info-outline'
      // backgroundColor = ColorPallet.notification.info
      // borderColor = ColorPallet.notification.infoBorder
      // iconColor = ColorPallet.notification.infoIcon
      // textColor = ColorPallet.notification.infoText
      iconName = 'error',
      backgroundColor='#ced9ed',
      borderColor='#ced9ed',
      iconColor='#5869E6'
      textColor='#5869E6'
      break

    case ToastType.Warn:
      iconName = 'report-gmailerrorred'
      // backgroundColor = ColorPallet.notification.warn
      // borderColor = ColorPallet.notification.warnBorder
      // iconColor = ColorPallet.notification.warnIcon
      // textColor = ColorPallet.notification.warnText
      // iconName = 'error',
      backgroundColor='#F0F5FF',
      borderColor='#F0F5FF',
      iconColor='#5869E6'
      textColor='#5869E6'
      break

    case ToastType.Error:
      iconName = 'error-outline',
      // backgroundColor = ColorPallet.notification.error
      // borderColor = ColorPallet.notification.errorBorder
      backgroundColor='#f2dcdc',
      borderColor='#f2dcdc',
      // iconColor = ColorPallet.notification.errorIcon
      iconColor='#5869E6'
      // textColor = ColorPallet.notification.errorText
      textColor='#5869E6'
      break

    default:
      throw new Error('ToastType was not set correctly.')
  }

  return (
    <TouchableOpacity activeOpacity={1} onPress={() => onPress()}>
      <View style={[styles.container, { backgroundColor, borderColor, width: width - width * 0.1 }]}>
        <Icon style={[styles.icon]} name={iconName} color={iconColor} size={iconSize} />
        <View style={[styles.textContainer]}>
          <Text style={[TextTheme.normal, styles.title, { color: textColor }]} testID={testIdWithKey('ToastTitle')}>
            {title}
          </Text>
          <Text style={[TextTheme.normal, styles.body, { color: textColor }]} testID={testIdWithKey('ToastBody')}>
            {body}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default BaseToast
