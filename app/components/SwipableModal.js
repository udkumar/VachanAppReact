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

var screen = Dimensions.get('window');

export default class Example extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      isDisabled: false,
      swipeToClose: true,
      sliderValue: 0.3
    };
  }

  onClose() {
    console.log('Modal just closed');
  }

  onOpen = () =>  {
    console.log("reference function ")
    this.refs.modal1.open()
    // this.ref.open()
  }

  onClosingState(state) {
    console.log('the open/close of the swipeToClose just changed');
  }
  componentDidMount(){
      this.props.onRef(this)
  }
 

  render() {
    return (
        <Modal 
            style={{height:68}}
            position={"bottom"} 
            ref={"modal1"}
            swipeArea={100}
            backdrop={true}
            coverScreen	={false}
            backdrop='bottom'
            coverScreen={false}
            swipeToClose={true}
            backdropOpacity={0}
        >
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
                // onPress={()=>this.refs.modal2.open}  

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
        </Modal>
    
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
