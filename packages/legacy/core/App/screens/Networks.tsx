import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import QandA from '../components/falcon/QandA'
import ManageLedgers from '../components/falcon/ManageLeaders'
// import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'

const Networks = () => {
    const navigation = useNavigation();
    return (
        <SafeAreaView style={{flex:1,}}>
          
                <View style={{display:'flex',alignItems:'center',flexDirection:'row'}}>
                    <View style={{display:'flex',flexDirection:'row',alignItems:'center',width:'90%'}} >
                        <TouchableOpacity style={{   shadowColor: '#212228', shadowOffset: { width: 0, height: 4, }, shadowOpacity: 0.1,shadowRadius: 12, elevation: 4,height:48,width:48,backgroundColor:'white',display:'flex',justifyContent:'center',alignItems:'center',borderRadius:12,margin:'8%',marginRight:'4%'}}>
                            <MaterialCommunityIcons name="arrow-left" size={24} color="black" onPress={() => { navigation.goBack()}}/>
                        </TouchableOpacity>
                        <Text style={{ fontWeight: '800',fontSize:20 ,color:'black'}} >Network</Text>
                    </View>
                    <MaterialIcons name="add" size={24} color="blue" />
                </View>
                <View style={{marginLeft:'3%'}}>
                    <ScrollView showsVerticalScrollIndicator={false} >
                        <QandA question={'custom Network'} answer='jfbdhf dhfbdjfbrh fdhfbhf f'/>
                        <QandA question={'Preconfigured network'} answer='bdfjdbnf fdhfbffhbfgh'/>
                    </ScrollView>
                </View>
            
        </SafeAreaView >
    )
}

export default Networks