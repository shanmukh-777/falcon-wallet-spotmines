import { View, Text, Image, Dimensions } from 'react-native'
import React from 'react'

//ContactListitem.tsx
import type {
    BasicMessageRecord,
    ConnectionRecord,
    CredentialExchangeRecord,
    ProofExchangeRecord,
} from '@aries-framework/core'

import { useBasicMessagesByConnectionId } from '@aries-framework/react-hooks'
import { StackNavigationProp } from '@react-navigation/stack'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, TouchableOpacity } from 'react-native'

import { useStore } from '../../contexts/store'
import { useTheme } from '../../contexts/theme'
import { useCredentialsByConnectionId } from '../../hooks/credentials'
import { useProofsByConnectionId } from '../../hooks/proofs'
import { Role } from '../../types/chat'
import { ContactStackParams, Screens, Stacks } from '../../types/navigators'
import {
    formatTime,
    getConnectionName,
    getCredentialEventLabel,
    getCredentialEventRole,
    getProofEventLabel,
    getProofEventRole,
} from '../../utils/helpers'
import { testIdWithKey } from '../../utils/testable'
import University from '../../assets/icons/university.svg'


interface CondensedMessage {
    text: string
    createdAt: Date
}
interface Props {
    contact: ConnectionRecord
    navigation: StackNavigationProp<ContactStackParams, Screens.Contacts>
}
interface ChatLogProps {
    contact: ConnectionRecord;
    // image: any;
    noofmessages: number;
    messages: any;
    truncateText: boolean;
    navigation: StackNavigationProp<ContactStackParams, Screens.Contacts>
}

const ChatLog: React.FC<ChatLogProps> = ({ contact, noofmessages, messages, truncateText , navigation}) => {
    const getFontSizem = () => {
        const screenHeight = Math.round(Dimensions.get('window').height);
        return screenHeight < 600 ? screenHeight * 0.015 : screenHeight * 0.017;
    };

    const getFontSizel = () => {
        const screenHeight = Math.round(Dimensions.get('window').height);
        return screenHeight < 600 ? screenHeight * 0.013 : screenHeight * 0.013;
    }

    const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    //ContactListitem.tsx
    const { t } = useTranslation()
    const { TextTheme, ColorPallet, ListItems } = useTheme()
    const basicMessages = useBasicMessagesByConnectionId(contact.id)
    const credentials = useCredentialsByConnectionId(contact.id)
    const proofs = useProofsByConnectionId(contact.id)
    const [message, setMessage] = useState<CondensedMessage>({ text: '', createdAt: contact.createdAt })
    const [store] = useStore()
  
    useEffect(() => {
      const transformedMessages: Array<CondensedMessage> = basicMessages.map((record: BasicMessageRecord) => {
        return {
          text: record.content,
          createdAt: record.updatedAt || record.createdAt,
        }
      })
  
      transformedMessages.push(
        ...credentials.map((record: CredentialExchangeRecord) => {
          const role = getCredentialEventRole(record)
          const userLabel = role === Role.me ? `${t('Chat.UserYou')} ` : ''
          const actionLabel = t(getCredentialEventLabel(record) as any)
          return {
            text: `${userLabel}${actionLabel}.`,
            createdAt: record.updatedAt || record.createdAt,
          }
        })
      )
  
      transformedMessages.push(
        ...proofs.map((record: ProofExchangeRecord) => {
          const role = getProofEventRole(record)
          const userLabel = role === Role.me ? `${t('Chat.UserYou')} ` : ''
          const actionLabel = t(getProofEventLabel(record) as any)
  
          return {
            text: `${userLabel}${actionLabel}.`,
            createdAt: record.updatedAt || record.createdAt,
          }
        })
      )
  
      // don't show a message snippet for the initial connection
      const connectedMessage = {
        text: '',
        createdAt: contact.createdAt,
      }
  
      setMessage([...transformedMessages.sort((a: any, b: any) => b.createdAt - a.createdAt), connectedMessage][0])
    }, [basicMessages, credentials, proofs])
  
    const navigateToContact = useCallback(() => {
      setMessagesViewed(true) 
      navigation
        .getParent()
        ?.navigate(Stacks.ContactStack, { screen: Screens.Chat, params: { connectionId: contact.id } })
    }, [contact])
  
    const contactLabel = useMemo(
      () => getConnectionName(contact, store.preferences.alternateContactNames),
      [contact, store.preferences.alternateContactNames]
    )
    const contactLabelAbbr = useMemo(
      () => contactLabel?.charAt(0).toUpperCase(),
      [contact, store.preferences.alternateContactNames]
    )
    const [unreadCount, setUnreadCount] = useState<number>(0)

    useEffect(() => {
      // Calculate the count of unread basic messages
      const unreadBasicMessages = basicMessages.filter((msg: BasicMessageRecord) => msg.createdAt > message.createdAt)
      // Calculate the count of unread credentials
      const unreadCredentials = credentials.filter((record: CredentialExchangeRecord) => record.createdAt > message.createdAt)
      // Calculate the count of unread proofs
      const unreadProofs = proofs.filter((record: ProofExchangeRecord) => record.createdAt > message.createdAt)
    
      // Calculate the total count of unread messages
      const totalUnreadCount = unreadBasicMessages.length + unreadCredentials.length + unreadProofs.length
      setUnreadCount(totalUnreadCount)
    
      // Your existing logic to display the last message...
    }, [basicMessages, credentials, proofs])

    const [messagesViewed, setMessagesViewed] = useState<boolean>(false)





useEffect(() => {
    // Reset unread count when messages are viewed
    if (messagesViewed) {
      setUnreadCount(0)
    }
  }, [messagesViewed])




    return (
        <TouchableOpacity onPress={navigateToContact} testID={testIdWithKey('Contact')} accessibilityLabel={t('ContactDetails.AContact')} >
        <View style={{ width: '95%', marginHorizontal: 'auto', display: 'flex', padding: '2%', flexDirection: 'row', alignSelf: 'center', borderBottomWidth: 1, borderColor: '#B9B9B9' }} >
            <View style={{ display: 'flex', flexDirection: 'row', width: '80%', alignItems: 'center' ,height:40}} >
                 <University  style={{marginRight:'5%'}} />
                <Text style={{
                    color: 'black',
                    fontSize: getFontSizem(),
                    fontWeight: '500',
                    fontFamily: 'plus-jakarta-sans',
                    maxWidth: '80%', // Set maximum width for the text container
                    overflow: 'hidden', // Hide overflow
                    // textOverflow: 'ellipsis',
                }} numberOfLines={1}>{contactLabel}</Text>
            </View>
            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '20%' }}>
                <Text style={{ fontSize: getFontSizel(), color: '#8E8E8E' }}>{formatTime(message.createdAt, { shortMonth: true, trim: true })}</Text>
                {unreadCount > 0  && 
                    <View style={{ borderRadius: 900, backgroundColor: '#5869E6', width: 23, height: 23, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {/* <Text style={{ fontSize: getFontSizel(), color: 'white' }}>{}</Text> */}
                         <Text style={{ fontSize: getFontSizel(), color: 'white' }}>{unreadCount}</Text>
                    </View>
                }
            </View>
        </View >
        </TouchableOpacity>
    )
}

export default ChatLog