import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { BUTTON_STYLE1 } from '../../constants/fonts'

import { Attribute, Field } from '@hyperledger/aries-oca/build/legacy'
import { useTranslation } from 'react-i18next'
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import startCase from 'lodash.startcase'
import { isDataUrl } from '../../utils/helpers'
import RecordBinaryField from './../../components/record/RecordBinaryField'
import RecordDateIntField from './../../components/record/RecordDateIntField'
import { CaptureBaseAttributeType } from '@hyperledger/aries-oca'
import { hiddenFieldValue } from '../../constants'
import { testIdWithKey } from '../../utils/testable'

export const validEncoding = 'base64'
export const validFormat = new RegExp('^image/(jpeg|png|jpg)')
interface AttributeValueParams {
  field: Attribute
  shown?: boolean
  style?: Record<string, unknown>
}

export const AttributeValue: React.FC<AttributeValueParams> = ({ field, style, shown }) => {
  // console.log(field.value)
  // return <Text>{field.value}</Text>
  shown = true
  if (
    (field.encoding == validEncoding && field.format && validFormat.test(field.format) && field.value) ||
    isDataUrl(field.value)
  ) {
    return <RecordBinaryField attributeValue={field.value as string} style={style} shown={shown} />
  }
  if (field.type == CaptureBaseAttributeType.DateInt || field.type == CaptureBaseAttributeType.DateTime) {
    return <RecordDateIntField field={field} style={style} shown={shown} />
  }
  return <Text testID={testIdWithKey('AttributeValue')}>{shown ? field.value : hiddenFieldValue}</Text>
}

export interface RecordProps {
  fields: Field[]
  // hideFieldValues?: boolean
  field?: (field: Field, index: number, fields: Field[]) => React.ReactElement | null
}

// const AadharSchema = ({ aadharschema }) => {
const AadharSchema: React.FC<RecordProps> = ({ fields, field }) => {
  const { t } = useTranslation()
  // const [shown, setShown] = useState<boolean[]>([])
  const [showAll, setShowAll] = useState<boolean>(false)

  return (
    <View style={[styles.container, BUTTON_STYLE1]}>
      {fields.map((field, index) => (
        <View style={styles.row} key={index}>
          {/* <Text style={styles.label}>{field.label ?? startCase(field.name || '')}</Text> */}
          <Text style={styles.label}>{field.label ?? startCase(field.name || '')}</Text>
          {/* <Text style={styles.value}>{shown[index] ? field.value : 'Hidden Value'}</Text> */}
          <Text style={styles.value}>
            {' '}
            <AttributeValue field={field as Attribute} />
          </Text>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '93%',
    backgroundColor: 'white',
    flexDirection: 'column',
    paddingVertical: '3%',
    paddingHorizontal: '4%',
    borderRadius: 8,
    borderWidth:2,
    borderColor:'#CBCBCC'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2%',
   
  },
  label: {
    flex: 1,
    color: '#636363',
  },
  value: {
    flex: 1,
    textAlign: 'left',
    color: 'black',
  },
})

export default AadharSchema
