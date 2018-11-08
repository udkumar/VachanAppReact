import React, {Component} from 'react';
import {Modal, Text, TouchableHighlight, View, Alert} from 'react-native';

export default class AddData extends Component {
  state = {
    modalVisible: false,
  };

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  render() {
    return (
      <View style={{marginTop: 22, justifyContent: 'center',}}>
        <Modal
            transparent={true}
            animationType="fade"
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={{
              flex:1,
          justifyContent: 'center',
          alignSelf:'center',
          }}>
            <View 
            style={{
                justifyContent: 'center',
                alignItems: 'center', 
                backgroundColor : "#fff", 
                height: 300 ,
                width: 200,
                borderRadius:10,
                borderWidth: 1,
                borderColor: '#fff'
            }}
            >
              <Text>Hello World!</Text>

              <TouchableHighlight
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}>
                <Text>Hide Modal</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>

        <TouchableHighlight

          onPress={() => {
            this.setModalVisible(true);
          }}>
          <Text style={{textAlign:'right',}}>Show Modal</Text>
        </TouchableHighlight>
      </View>
    );
  }
}





// import React, { Component } from 'react';
// import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
// import Modal from 'react-native-modal'; // 2.4.0


// export default class Example extends Component {
//   state = {
//     visibleModal: null,
//   };

//   _renderButton = (text, onPress) => (
//     <TouchableOpacity onPress={onPress}>
//       <View style={styles.button}>
//         <Text>{text}</Text>
//       </View>
//     </TouchableOpacity>
//   );

//   _renderModalContent = () => (
//     <View style={styles.modalContent}>
//       <Text>Hello!</Text>
//       {this._renderButton('Close', () => this.setState({ visibleModal: null }))}
//     </View>
//   );

//   render() {
//     return (
//       <View style={styles.container}>
//         {this._renderButton('Sliding from the sides', () => this.setState({ visibleModal: 2 }))}
//         <Modal
//           isVisible={this.state.visibleModal === 2}
//           animationIn={'slideInLeft'}
//           animationOut={'slideOutRight'}
//         >
//           {this._renderModalContent()}
//         </Modal>
        
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   button: {
//     backgroundColor: 'lightblue',
//     padding: 12,
//     margin: 16,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 4,
//     borderColor: 'rgba(0, 0, 0, 0.1)',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     padding: 22,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 4,
//     borderColor: 'rgba(0, 0, 0, 0.1)',
//   },
//   bottomModal: {
//     justifyContent: 'flex-end',
//     margin: 0,
//   },
// });