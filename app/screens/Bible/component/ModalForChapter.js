import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  Button,
  View,
  SafeAreaView,
} from 'react-native';
import Modal from 'react-native-modal';

export default class ModalForChapter extends Component {
  state = {
    visibleModalId: null,
  };

  renderModalContent = () => (
    <View style={styles.content}>
      <Text style={styles.contentTitle}>Hi 👋!</Text>
      <Button
        onPress={() => this.setState({ visibleModal: null })}
        title="Close"
      />
    </View>
  );



  render() {
    return (
      <View style={styles.container}>
       
       
        <Button
          onPress={() => this.setState({ visibleModal: 'backdropPress' })}
          title="Close on backdrop press"
        />
       
        <Modal
          isVisible={this.state.visibleModal === 'backdropPress'}
         
          onBackdropPress={() => this.setState({ visibleModal: null })}
        >
          {this.renderModalContent()}
        </Modal>
    
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  content: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  scrollableModal: {
    height: 300,
  },
  scrollableModalContent1: {
    height: 200,
    backgroundColor: '#87BBE0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollableModalText1: {
    fontSize: 20,
    color: 'white',
  },
  scrollableModalContent2: {
    height: 200,
    backgroundColor: '#A9DCD3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollableModalText2: {
    fontSize: 20,
    color: 'white',
  },
  customBackdrop: {
    flex: 1,
    backgroundColor: '#87BBE0',
    alignItems: 'center',
  },
  customBackdropText: {
    marginTop: 10,
    fontSize: 17,
  },
});