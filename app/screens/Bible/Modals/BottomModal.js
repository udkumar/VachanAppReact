import React from 'react';
// import Button from 'react-native-button';
import Modal from 'react-native-modalbox';
// import Slider from 'react-native-slider';

import {
  AppRegistry,
  Text,
  StyleSheet,
  ScrollView,
  View,
  TextInput,
  Button,
  Slider,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
// import HighLights from '../screens/Highlights/Highlights';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
import SplitScreen from './SplitScreen'

// var screen = Dimensions.get('window');

export default class BottomTab extends React.Component {

  constructor(props) {
    super(props)
    console.log("props "+JSON.stringify(props))
   
  }
  
  render() {
    return (
        <View style={{flex:1}}>
            <View 
                style={{
                    position:'absolute', 
                    bottom:0,
                    width: width,
                    // height:50, 
                    backgroundColor:'#3F51B5',
                    flexDirection:'row',
                    justifyContent:'center',
                }}
            >
            <View 
                style={{
                    flexDirection:'row',
                    width:width/5,
                    justifyContent:'center',
                    alignItems:'center',
                    marginVertical:4
                }}>
                <TouchableOpacity 
                    onPress={()=>this.prop.showScreen(!this.props.show)}
                >
                <Text style={{textAlign:'center',color:'white', }}>
                    NotePad
                </Text>
                <Icon 
                    name={'border-color'} 
                    color="white" size={24}  
                    style={{
                        alignSelf:'center',
                    }} 
                />
                </TouchableOpacity>
            </View>
            <View 
                style={{ width: 1,
                    backgroundColor:'white',
                    marginVertical:8,
                }} 
            />
            <View 
                style={{
                    flexDirection:'row',
                    width:width/5,
                    justifyContent:'center',
                    alignItems:'center',
                }}
            >  
              
            <TouchableOpacity 
            //   onPress={this.addToNotes} 
            >        
                <Text style={{textAlign:'center',color:'white', }}>
                  Resources
                </Text>
                <Icon 
                    name={'library-books'} 
                    color="white" 
                    size={24} 
                    style={{
                        alignSelf:'center',
                    }} 
                />
            </TouchableOpacity>
            </View>
            <View 
                style={{ width: 1,
                    backgroundColor:'white',
                    marginVertical:8,
                }} 
            />
            <View 
                style={{
                    flexDirection:'row',
                    width:width/5,
                    justifyContent:'center',
                    alignItems:'center',
                }}>   
            <TouchableOpacity 
            //   onPress={this.addToShare} 
            >       
                <Text style={{textAlign:'center',color:'white', }}>
                  Audio
                </Text>
                <Icon 
                    name={'headset'} 
                    color="white" 
                    size={24} 
                    style={{
                        alignSelf:'center',
                    }}  
                />
            </TouchableOpacity>
            </View>
            <View 
                style={{ width: 1,
                    backgroundColor:'white',
                    marginVertical:8
                }} 
            />
            <View 
                style={{
                    flexDirection:'row',
                    width:width/5,
                    justifyContent:'center',
                    alignItems:'center',
                }}
            >   
              <TouchableOpacity 
            //   onPress={this.addToShare}  
              >       
                <Text style={{textAlign:'center',color:'white', }}>
                  Images
                </Text>
                <Icon 
                    name={'photo-album'} 
                    color="white" 
                    size={24} 
                    style={{
                        alignSelf:'center',
                    }}  
                />
              </TouchableOpacity>
            </View> 
            <View 
                style={{ width: 1,
                    backgroundColor:'white',
                    marginVertical:8,
                }} 
            />
            <View 
                style={{
                    flexDirection:'row',
                    width:width/5,
                    justifyContent:'center',
                    alignItems:'center',
                }}>   
              <TouchableOpacity 
            //   onPress={this.addToShare}  
              >       
                <Text style={{textAlign:'center',color:'white', }}>
                  Video
                </Text>
                <Icon 
                    name={'video-library'}  
                    color="white" 
                    size={24} 
                    style={{
                        alignSelf:'center',
                    }}  
                />
              </TouchableOpacity>
            </View>  
         
         </View>
           
        </View>
    
    );
  }

}


