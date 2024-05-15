import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

interface QandAprops{
    question:string
    answer:string
}

const QandA: React.FC<QandAprops> = ({ question, answer }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);


    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };



    return (
        <View style={styles.bordercase}>
            <TouchableOpacity onPress={toggleDropdown}  >
                <View  style={{display:'flex',flexDirection:'row',width:'100%',justifyContent:'space-between',alignItems:'center',padding:4}}>
                    <Text  style={{fontSize:17,width:'90%',color:'black'}}>{question} </Text>
                    <Feather name={dropdownOpen ? 'chevron-up' : 'chevron-down'} size={30} color="black" />
                </View>
            </TouchableOpacity>
            {dropdownOpen && (
                <Text style={{width:'100%',paddingHorizontal:3,fontSize:17,color:'black'}}>
                    {answer}
                </Text>
            )}
        </View>
    );
};



export default QandA;

const styles = StyleSheet.create({
    bordercase: {
        borderWidth: 1,
        borderColor: '#CBCBCC',
        width:'90%',
        margin:'3%',
        borderRadius:12,
        padding:'2%'
    },
})