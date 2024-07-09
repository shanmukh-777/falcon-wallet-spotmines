import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { borderRadius } from 'theme';

const Dropdown = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };
    const styles = StyleSheet.create({
        bordercase: {
            borderWidth: 1,
            borderColor: '#CBCBCC',
            width:'100%',
            backgroundColor:'white',
            margin:5
        },
    })


    return (
        <View  style={styles.bordercase}>
            <TouchableOpacity onPress={toggleDropdown} style={[styles.bordercase,{borderRadius:100}]} >
                <View style={{display:'flex',flexDirection:'row',width:'100%',justifyContent:'space-between',padding:5}}>
                    <Text style={{fontSize:14}}>Custom ledgers</Text>
                    <Feather name={dropdownOpen ? 'chevron-up' : 'chevron-down'} size={30} color="black" />
                </View>
            </TouchableOpacity>
            {dropdownOpen && (
                <View>
                    <View style={{display:'flex',flexDirection:'row',justifyContent:'flex-start',alignItems:'flex-start',gap:4,paddingHorizontal:7,paddingVertical:4}} >
                        <MaterialCommunityIcons name="code-tags" size={32} color="#733DF5" />
                        <Text style={{fontWeight:'bold',fontSize:14}}>bcovrin-prod</Text>
                    </View>
                    <View style={{display:'flex',flexDirection:'row',justifyContent:'flex-start',alignItems:'flex-start',gap:4,paddingHorizontal:7,paddingVertical:4}} >
                        <MaterialCommunityIcons name="code-tags" size={32} color="#733DF5" />
                        <Text  style={{fontWeight:'bold',fontSize:14}} >bcovrin-prod</Text>
                    </View>
                    <View  style={{display:'flex',flexDirection:'row',justifyContent:'flex-start',alignItems:'flex-start',gap:4,paddingHorizontal:7,paddingVertical:4}}>
                        <MaterialCommunityIcons name="code-tags" size={32} color="#733DF5" />
                        <Text  style={{fontWeight:'bold',fontSize:14}}>bcovrin-prod</Text>
                    </View>
                </View>

            )}


        </View>
    );
};



export default Dropdown;

