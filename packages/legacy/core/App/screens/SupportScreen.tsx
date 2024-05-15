import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import LinearGradient from 'react-native-svg';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import  QandA  from '../components/falcon/QandA'
import { useNavigation } from '@react-navigation/native'

const SupportScreen = () => {
    const navigation = useNavigation();
    return (
        <SafeAreaView  style={{flex:1,backgroundColor:'white'}}>
            {/* <LinearGradient
                // colors={['#F0F5FF', '#FFFFFF']}
                style={{ flex: 1 }}
                // start={{ x: 0, y: 0 }}
                end={{ x: 0.3, y: 0.3 }}
            > */}



                <View style={{display:'flex',flexDirection:'row',alignItems:'center',backgroundColor:'white'}}>
                    <TouchableOpacity onPress={()=>navigation.goBack()} style={{width:48,height:48,backgroundColor:'white',display:'flex',justifyContent:'center',alignItems:'center',borderRadius:12,margin:'8%',marginRight:'4%',shadowColor: '#212228', shadowOffset: { width: 0, height: 4, }, shadowOpacity: 0.1,shadowRadius: 12, elevation: 4,}} >
                        <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={{fontSize:20,color:'black'}}>Help</Text>
                </View>
                <View style={{marginLeft:'3%'}} >
                    <ScrollView showsVerticalScrollIndicator={false} >
                        <QandA question={'lorem nfjsfbgrsdf ehjd ekjdfhn ekjsdn '} answer={'lorem hfbed fgr dng vrbsdnbfjvhrbds v  vrhfdbncgvjhn '} />
                        <QandA question={'lorem nfjsfbgrsdf ehjd ekjdfhn ekjsdn '} answer={'lorem hfbed fgr dng vrbsdnbfjvhrbds v hdscxg vrhfdbncgvjhn '} />
                        <QandA question={'lorem nfjsfbgrsdf ehjd ekjdfhn ekjsdn '} answer={'lorem hfbed fgr dng vrbsdnbfjvhrbds vvbrhdscxg vrhfdbncgvjhn '} />
                        {/* <QandA question={'lorem nfjsfbgrsdf ehjd ekjdfhn ekjsdn ehjd ekjdfhn ehjd'} answer={'lorem hfbed fgr dng vrbsdnbfjvhrbds v rhdbxvjhrf gv rsdbhjvrbdshgv rhbdcghjvbrhdscxg vrhfdbncgvjhn '} />
                        <QandA question={'lorem nfjsfbgrsdf ehjd ekjdfhn ekjsdn ehjd ekjdfhn ehjd'} answer={'lorem hfbed fgr dng vrbsdnbfjvhrbds v rhdbxvjhrf gv rsdbhjvrbdshgv rhbdcghjvbrhdscxg vrhfdbncgvjhn '} />
                        <QandA question={'lorem nfjsfbgrsdf ehjd ekjdfhn ekjsdn ehjd ekjdfhn ehjd'} answer={'lorem hfbed fgr dng vrbsdnbfjvhrbds v rhdbxvjhrf gv rsdbhjvrbdshgv rhbdcghjvbrhdscxg vrhfdbncgvjhn '} />
                        <QandA question={'lorem nfjsfbgrsdf ehjd ekjdfhn ekjsdn ehjd ekjdfhn ehjd'} answer={'lorem hfbed fgr dng vrbsdnbfjvhrbds v rhdbxvjhrf gv rsdbhjvrbdshgv rhbdcghjvbrhdscxg vrhfdbncgvjhn '} />
                        <QandA question={'lorem nfjsfbgrsdf ehjd ekjdfhn ekjsdn ehjd ekjdfhn ehjd'} answer={'lorem hfbed fgr dng vrbsdnbfjvhrbds v rhdbxvjhrf gv rsdbhjvrbdshgv rhbdcghjvbrhdscxg vrhfdbncgvjhn '} />
                        <QandA question={'lorem nfjsfbgrsdf ehjd ekjdfhn ekjsdn ehjd ekjdfhn ehjd'} answer={'lorem hfbed fgr dng vrbsdnbfjvhrbds v rhdbxvjhrf gv rsdbhjvrbdshgv rhbdcghjvbrhdscxg vrhfdbncgvjhn '} />
                        <QandA question={'lorem nfjsfbgrsdf ehjd ekjdfhn ekjsdn ehjd ekjdfhn ehjd'} answer={'lorem hfbed fgr dng vrbsdnbfjvhrbds v rhdbxvjhrf gv rsdbhjvrbdshgv rhbdcghjvbrhdscxg vrhfdbncgvjhn '} />
                        <QandA question={'lorem nfjsfbgrsdf ehjd ekjdfhn ekjsdn ehjd ekjdfhn ehjd'} answer={'lorem hfbed fgr dng vrbsdnbfjvhrbds v rhdbxvjhrf gv rsdbhjvrbdshgv rhbdcghjvbrhdscxg vrhfdbncgvjhn '} />
                        <QandA question={'lorem nfjsfbgrsdf ehjd ekjdfhn ekjsdn ehjd ekjdfhn ehjd'} answer={'lorem hfbed fgr dng vrbsdnbfjvhrbds v rhdbxvjhrf gv rsdbhjvrbdshgv rhbdcghjvbrhdscxg vrhfdbncgvjhn '} /> */}

                    </ScrollView>
                </View>
        </SafeAreaView >
    )
}

export default SupportScreen