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
import BottomModal from "./BottomModal";

export default class Example extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      isDisabled: false,
      swipeToClose: true,
      sliderValue: 0.3,
      show:false,
      // styleHeight:{height:null}
    };
    // this.resizeModal = this.resizeModal.bind(this)
    this.onOpen =this.onOpen.bind(this)
    this.showScreen = this.showScreen.bind(this)
  }

  onClose() {
    console.log('Modal just closed');
  }

  onOpen(){
    console.log("reference function ")
    this.refs.modal1.open()
    
  }

  onClosingState(state) {
    console.log('the open/close of the swipeToClose just changed');
  }
  componentDidMount(){
      this.props.onRef(this)
  }
  // resizeModal(ev) {
  //   this.setState({styleHeight: {height: ev.nativeEvent.layout.height}});
  // }
  showScreen(value){
    console.log("state value "+this.state.show)
    this.setState({show:value})
   
    console.log("state value after "+this.state.show)
  }

  render() {
    return (
        <Modal 
            position={"bottom"} 
            ref={"modal1"}
            swipeArea={100}
            style={{
              height : this.state.show ? height : 52
            }}
            backdrop={true}
            coverScreen	={false}
            backdrop='bottom'
            coverScreen={false}
            swipeToClose={true}
            backdropOpacity={0}
        >
            <BottomModal
              // resizeModal2={this.resizeModal}
              showScreen = {this.showScreen}
              show={this.state.show}
            />
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
