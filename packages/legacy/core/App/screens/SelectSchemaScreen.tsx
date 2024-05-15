import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Octicons from 'react-native-vector-icons/Octicons'
import Document from './../components/falcon/Document';
import SelectSchema  from './../components/falcon/SelectSchema';
import { useNavigation } from '@react-navigation/native'
import { Attribute, CredentialOverlay, Field } from '@hyperledger/aries-oca/build/legacy'
import { BrandingOverlay } from '@hyperledger/aries-oca'

export interface RecordProps {
    fields: Field[]
    // hideFieldValues?: boolean
    field?: (field: Field, index: number, fields: Field[]) => React.ReactElement | null
  }

  const SelectSchemaScreen: React.FC<RecordProps> = ({ fields, field }) => {    // const { selectedDocument, aadharschema } = route.params;
    const navigation = useNavigation();
    const schemaList = [
        { key: 'name', label: 'Name' },
        { key: 'Sex', label: 'Sex' },
        { key: 'Aadhaarno', label: 'Aadhaar no.' },
        { key: 'Address', label: 'Address' },
        { key: 'VID', label: 'VID' },
        { key: 'Issuedate', label: 'Issue date' },
        { key: 'DOB', label: 'DOB' },
    ];
    const [selectedSchemas, setSelectedSchemas] = useState([]);
    const [overlay, setOverlay] = useState<CredentialOverlay<BrandingOverlay>>({
        bundle: undefined,
        presentationFields: [],
        metaOverlay: undefined,
        brandingOverlay: undefined,
      })

    // const handleSchemaSelect = (selectedSchemas) => {
    //     console.log('Selected Schemas:', selectedSchemas);
    //     const selectedAadharSchemas = schemaList
    //         .filter((schema) => selectedSchemas.includes(schema.key))
    //         .map((schema) => aadharschema[schema.key]);
    //     console.log('Selected Aadhar Schemas:', selectedAadharSchemas);
    //     setSelectedSchemas(selectedSchemas);
    // };
    // useEffect(() => {
    //     setSelectedSchemas([]);
    // }, [route.params]);

    // const showDetails = () => {
    //     navigation.navigate("SelectedSchema", { selectedSchemas, aadharschema, schemaList, selectedDocument });
    // };

    return (
        <SafeAreaView >
            <View style={{display:'flex',width:'100%',height:'100%',alignItems:'center'}}>
                <View style={{display:'flex',flexDirection:'row',alignItems:'center',width:'90%',height:'10%',marginHorizontal:'auto'}} >
                    <TouchableOpacity style={{width:48,height:48,backgroundColor:'white',display:'flex',justifyContent:'center',alignItems:'center',borderRadius:8,margin:'8%', marginLeft:0,  shadowColor: '#212228', shadowOffset: { width: 0, height: 4, }, shadowOpacity: 0.1,shadowRadius: 12, elevation: 4, }} onPress={navigation.goBack}>
                        <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={{fontSize:16,fontWeight:'bold',color:'black'}} >Select Details</Text>
                </View>
                {/* <Document credential={credential} issueDate={credential.createdAt.toDateString()} /> */}
                <View style={{display:'flex',alignItems:'center',width:'90%',height:'60%',marginHorizontal:'auto'}}>
                    <SelectSchema fields={overlay.presentationFields || []}  />
                </View>
                <TouchableOpacity style={{width:'90%',display:'flex',height:'7%',justifyContent:'center',alignItems:'center',backgroundColor:'#5869E6',borderRadius:12}}>
                    <Text  style={{color:"white"}}>Show Details</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    )
}

export default SelectSchemaScreen