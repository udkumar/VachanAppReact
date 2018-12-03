import React from 'react';
// import Button from 'react-native-button';
import Modal from 'react-native-modalbox';
// import Slider from 'react-native-slider';

import {
  AppRegistry,
  Text,
  StyleSheet,
  View,
  Dimensions,
  FlatList,
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
// import HighLights from '../screens/Highlights/Highlights';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

var screen = Dimensions.get('window');
export default class BottomTab extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
        grid:[1,2,3,4],
    }
  }
 


  render() {
    return (
      <Modal>
        <View 
        style={{
            position:'absolute', 
            bottom:0,
            width: width, 
            // height:height,
            backgroundColor:'#3F51B5',
            flexDirection:'row',
            justifyContent:'center',
        }}
        // onLayout ={this.props.resizeModal}
      >
        <View>
          <Text>Hello</Text>
            {/* <FlatList
                data={this.state.grid}
                numColumns={4}
                renderItem={({item}) => 
                    <TouchableOpacity 
                    style={{
                      flex:0.25,
                      borderRightWidth:1, 
                      borderBottomWidth:1,
                      height:height,
                      justifyContent:"center"
                    }}
                    >
                      <Text>{item}</Text>
                    </TouchableOpacity>
                }
            />  */}
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
