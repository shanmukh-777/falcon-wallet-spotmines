// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
// import { FONT_STYLE_2, FONT_STYLE_3 } from './../../constants/fonts';

// interface IData {
//   item1: JSX.Element;
//   item2: JSX.Element;
//   item3: JSX.Element;
//   item4: JSX.Element;
// }

// const ServiceHeadings: React.FC = () => {
//   const [selectedItem, setSelectedItem] = useState('item1');
//   const { height: screenHeight } = Dimensions.get('window');
//   const data: IData = {
//     item1: (
//       <Text>
//         Your digital identity will be <Text style={{color: '#733DF5'}}>safeguarded</Text> under your control. Empower yourself with <Text style={{color: '#733DF5'}}>secure digital identity management.</Text>
//       </Text>
//     ),
//     item2: (
//       <Text>
//         Ensure <Text style={{color: '#733DF5'}}>your data remains exclusively yours</Text>. Your information is protected with cutting-edge encryption technology.
//       </Text>
//     ),
//     item3: (
//       <Text>
//         Preserve your privacy and data security by sharing your data selectively.  <Text style={{color: '#733DF5'}}>Effortlessly</Text> and <Text style={{color: '#733DF5'}}>securely</Text> control the data you share.
//       </Text>
//     ),
//     item4: (
//       <Text>
//         Your wallet, your rules.<Text style={{color: '#733DF5'}}>Easily backup your wallet</Text> to popular cloud platforms. Gain complete control over your data.
//       </Text>
//     ),
//   };

//   const handleItemClick = (item: string) => {
//     setSelectedItem(item);
//   };

//   const getButtonStyle = (item: string) => {
//     return selectedItem === item
//       ? { color: '#733DF5' }
//       : { color: '#898A8E' };
//   };

//   const getFontSize = () => {
//     return screenHeight < 600 ? screenHeight * 0.015 : screenHeight * 0.017;
//   };

//   const getSpace = () => {
//     return screenHeight < 600 ? screenHeight * 0.015 : screenHeight * 0.026;
//   };

//   return (

//     <View style={{ marginTop: screenHeight < 600 ? '1%' : '5%' }}>
//             <View style={{ marginBottom: getSpace() }}>
//                 <Text style={{ textAlign: 'justify', fontSize: getFontSize(), ...FONT_STYLE_3, color: 'black' }}>{data[selectedItem]}</Text>
//             </View>

//             <View style={{display:'flex',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
//                 <TouchableOpacity onPress={() => handleItemClick('item1')} style={[getButtonStyle('item1'),{marginRight:'2%'}]} >
//                     <Text  style={{ fontSize: getFontSize(),color:selectedItem=='item1'?'#733DF5':'#8E8E8E' }}>Identity</Text>
//                 </TouchableOpacity>
//                 <View style={{width:8,height:8,marginRight:'2%',borderRadius:100,backgroundColor:'#733DF5'}}/>
//                 <TouchableOpacity onPress={() => handleItemClick('item2')}  style={[getButtonStyle('item2'),{marginRight:'2%'}]} >
//                     <Text  style={{ fontSize: getFontSize(),color:selectedItem=='item2'?'#733DF5':'#8E8E8E' }} >Encryption</Text>
//                 </TouchableOpacity>
//                 <View style={{width:8,height:8,marginRight:'2%',borderRadius:100,backgroundColor:'#733DF5'}}/>
//                 <TouchableOpacity onPress={() => handleItemClick('item3')}  style={[getButtonStyle('item3'),{marginRight:'2%'}]} >
//                     <Text style={{ fontSize: getFontSize() ,color:selectedItem=='item3'?'#733DF5':'#8E8E8E'}}>Share</Text>
//                 </TouchableOpacity>
//                 <View style={{width:8,height:8,marginRight:'2%',borderRadius:100,backgroundColor:'#733DF5'}}/>
//                 <TouchableOpacity onPress={() => handleItemClick('item4')}  style={[getButtonStyle('item4'),{marginRight:'2%'}]} >
//                     <Text  style={{ fontSize: getFontSize(),color:selectedItem=='item4'?'#733DF5':'#8E8E8E' }}>Backup</Text>
//                 </TouchableOpacity>
//             </View>
//         </View >
//   )
// };

// export default ServiceHeadings;

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, TouchableOpacityProps, ViewStyle, TextStyle } from 'react-native';
import { FONT_STYLE_2, FONT_STYLE_3 } from './../../constants/fonts';

interface IData {
  item1: JSX.Element;
  item2: JSX.Element;
  item3: JSX.Element;
  item4: JSX.Element;
}

const ServiceHeadings: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<'item1' | 'item2' | 'item3' | 'item4'>('item1');
  const { height: screenHeight } = Dimensions.get('window');
  const data: IData = {
    item1: (
      <Text>
        Your digital identity will be <Text style={{color: '#733DF5'}}>safeguarded</Text> under your control. Empower yourself with <Text style={{color: '#733DF5'}}>secure digital identity management.</Text>
      </Text>
    ),
    item2: (
      <Text>
        Ensure <Text style={{color: '#733DF5'}}>your data remains exclusively yours</Text>. Your information is protected with cutting-edge encryption technology.
      </Text>
    ),
    item3: (
      <Text>
        Preserve your privacy and data security by sharing your data selectively.  <Text style={{color: '#733DF5'}}>Effortlessly</Text> and <Text style={{color: '#733DF5'}}>securely</Text> control the data you share.
      </Text>
    ),
    item4: (
      <Text>
        Your wallet, your rules.<Text style={{color: '#733DF5'}}>Easily backup your wallet</Text> to popular cloud platforms. Gain complete control over your data.
      </Text>
    ),
  };

  const handleItemClick = (item: 'item1' | 'item2' | 'item3' | 'item4') => {
    setSelectedItem(item);
  };

  const getButtonStyle = (item: 'item1' | 'item2' | 'item3' | 'item4'): TextStyle => {
    return selectedItem === item
      ? { color: '#733DF5' }
      : { color: '#898A8E' };
  };

  

  const getFontSize = () => {
    return screenHeight < 600 ? screenHeight * 0.015 : screenHeight * 0.017;
  };

  const getSpace = () => {
    return screenHeight < 600 ? screenHeight * 0.015 : screenHeight * 0.026;
  };

  return (

    <View style={{ marginTop: screenHeight < 600 ? '1%' : '5%' }}>
            <View style={{ marginBottom: getSpace() }}>
                <Text style={[FONT_STYLE_3 as TextStyle,{ textAlign: 'justify', fontSize: getFontSize(),  color: 'black' }]}>{data[selectedItem]}</Text>

            </View>

            <View style={{display:'flex',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                <TouchableOpacity onPress={() => handleItemClick('item1')} style={[getButtonStyle('item1'),{marginRight:'2%'}]} >
                    <Text  style={{ fontSize: getFontSize(),color:selectedItem=='item1'?'#733DF5':'#8E8E8E' }}>Identity</Text>
                </TouchableOpacity>
                <View style={{width:8,height:8,marginRight:'2%',borderRadius:100,backgroundColor:'#733DF5'}}/>
                <TouchableOpacity onPress={() => handleItemClick('item2')}  style={[getButtonStyle('item2'),{marginRight:'2%'}]} >
                    <Text  style={{ fontSize: getFontSize(),color:selectedItem=='item2'?'#733DF5':'#8E8E8E' }} >Encryption</Text>
                </TouchableOpacity>
                <View style={{width:8,height:8,marginRight:'2%',borderRadius:100,backgroundColor:'#733DF5'}}/>
                <TouchableOpacity onPress={() => handleItemClick('item3')}  style={[getButtonStyle('item3'),{marginRight:'2%'}]} >
                    <Text style={{ fontSize: getFontSize() ,color:selectedItem=='item3'?'#733DF5':'#8E8E8E'}}>Share</Text>
                </TouchableOpacity>
                <View style={{width:8,height:8,marginRight:'2%',borderRadius:100,backgroundColor:'#733DF5'}}/>
                <TouchableOpacity onPress={() => handleItemClick('item4')}  style={[getButtonStyle('item4'),{marginRight:'2%'}]} >
                    <Text  style={{ fontSize: getFontSize(),color:selectedItem=='item4'?'#733DF5':'#8E8E8E' }}>Backup</Text>
                </TouchableOpacity>
            </View>
        </View >
  )
};

export default ServiceHeadings;
