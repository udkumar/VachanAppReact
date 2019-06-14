import React, {Component} from "react";
import { ScrollView,View,KeyboardAvoidingView,TextInput,TouchableOpacity ,Dimensions,Image,Picker,StyleSheet, Text,ImageBackground } from "react-native";
const { width, height } = Dimensions.get("window");
import Icon from 'react-native-vector-icons/MaterialIcons'


export default class Account extends Component {
  render() {
    return (
      <KeyboardAvoidingView behavior='padding' >
       <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
        <View>
        <Image 
              style={[{width:width,height:width/1.5}]} 
              source={require('../../assets/img.jpeg')} 
        /> 
          <View style={{zIndex:1,position:'absolute',bottom:0,right:0}}>
              <Icon name='photo-camera' size={32} />
          </View>
            
        </View>
        
        <View>
        
          <View>
              <TextInput
                  style={{height:height/15, width:width/1.4, backgroundColor:'transparent'}}
                  placeholder="User Name "
                  value={"XYZ"}
                  onChangeText={(fname) => this.setState({fname})}
                  underlineColorAndroid="transparent"
              />
            <View style={{borderBottomColor:'#A9A9A9',borderBottomWidth:1,marginHorizontal:4}}/>
          </View>
          
          <View>
              <TextInput
                  style={{height:height/15, width:width/1.4, backgroundColor:'transparent'}}
                  placeholder="Mobile Number"
                  value={"1234567890"}
                  onChangeText={(fname) => this.setState({fname})}
                  underlineColorAndroid="transparent"
              />
            <View style={{borderBottomColor:'#A9A9A9',borderBottomWidth:1,marginHorizontal:4}}/>
          </View>
          
          <View>
              <TextInput
                  style={{height:height/15, width:width/1.4, backgroundColor:'transparent'}}
                  placeholder="EmailId"
                  editable={false}
                  value={"abc12@gmail.com"}
                  onChangeText={(fname) => this.setState({fname})}
                  underlineColorAndroid="transparent"
              />
            <View style={{borderBottomColor:'#A9A9A9',borderBottomWidth:1,marginHorizontal:4}}/>
          </View>
          
        </View> 
        <View style={{justifyContent:'center',alignItems:'center',margin:20}}>
        <TouchableOpacity style={{backgroundColor:"#3F51B5",paddingVertical:10,paddingHorizontal:20}}>
            <Text>Save Changes</Text>
        </TouchableOpacity>
        </View>
        {/* <Button
        title="Learn More"
        color="#841584"
        /> */}
      </ScrollView>
      </KeyboardAvoidingView>
    )
  }
}


