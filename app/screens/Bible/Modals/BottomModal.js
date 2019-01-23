import React from 'react';

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

var screen = Dimensions.get('window');

export default class Example extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
            <View 
                style={{
                    position:'absolute', 
                    bottom:0,
                    width: width, 
                    height: 68, 
                    backgroundColor:'#3F51B5',
                    flexDirection:'row',
                    justifyContent:'center'
                }}
            >
            <View 
                style={{
                    flexDirection:'row',
                    width:width/5,
                    justifyContent:'center',
                    alignItems:'center',
                }}>
                <TouchableOpacity 
                onPress={this.props.showScreen}  
                >
                <Text style={{textAlign:'center',color:'white', }}>
                    IRVNotes
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
              onPress={this.props.showSummaryScreen}

            >        
                <Text style={{textAlign:'center',color:'white', }}>
                  Summary
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
            onPress={this.props.showAudioScreen} 
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
             onPress={this.props.showImageScreen} 
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
            onPress={this.props.showVideoScreen} 
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
    
    );
  }

}


const styles = StyleSheet.create({

  wrapper: {
    paddingTop: 50,
    flex: 1
  },

  modal: {
    justifyContent: 'center',
    alignItems: 'center'
  },

  modal2: {
    height: 230,
    backgroundColor: "#3B5998"
  },

  modal3: {
    height: 300,
    width: 300
  },

  modal4: {
    height: 300
  },

  btn: {
    margin: 10,
    backgroundColor: "#3B5998",
    color: "white",
    padding: 10
  },

  btnModal: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 50,
    height: 50,
    backgroundColor: "transparent"
  },

  text: {
    color: "black",
    fontSize: 22
  }

});
