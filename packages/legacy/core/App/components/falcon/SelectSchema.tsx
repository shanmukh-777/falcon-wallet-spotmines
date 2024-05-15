import { Field } from '@hyperledger/aries-oca/build/legacy';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import startCase from 'lodash.startcase'

 interface RecordProps {

    fields: Field[]
    // hideFieldValues?: boolean
    field?: (field: Field, index: number, fields: Field[]) => React.ReactElement | null
  }

  const SelectSchema: React.FC<RecordProps> = ({ fields, field }) => {
    const [selectedSchemas, setSelectedSchemas] = useState([]);

    // useEffect(() => {
    //     // Call onSchemaSelect whenever selectedSchemas change
    //     onSchemaSelect(selectedSchemas);
    // }, [selectedSchemas, onSchemaSelect]);

    // const handleCheckboxToggle = (schema) => {
    //     console.log("checkbox toggled");
    //     const isSelected = selectedSchemas.includes(schema);
    //     if (isSelected) {
    //         setSelectedSchemas(selectedSchemas.filter((selected) => selected !== schema));
    //     } else {
    //         setSelectedSchemas([...selectedSchemas, schema]);
    //     }
    // };

    return (
        <View  style={{padding:'2%',borderWidth:2,borderColor:'#CBCBCC',width:'100%',borderRadius:20}}>
          {fields.map((field, index) => (
                <View key={index} style={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center',gap:10}}>
                    <Text >{field.label ?? startCase(field.name || '')}</Text>
                    <TouchableOpacity onPress={() => handleCheckboxToggle(item.key)}>
                        <View style={[styles.checkbox, selectedSchemas.includes(item.key) && styles.checked]}>
                            {selectedSchemas.includes(item.key) && <Text style={styles.checkMark}>&#10003;</Text>}
                        </View>
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({

    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: '#CBCBCC',
        marginRight: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checked: {
        backgroundColor: '#5869E6',
    },
    labelText: {
        marginRight: 10,
    },
    checkMark: {
        color: 'white',
        fontSize: 12,
    },
});

export default SelectSchema;

