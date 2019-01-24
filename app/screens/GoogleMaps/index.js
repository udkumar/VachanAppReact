import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,Image,
  View
} from 'react-native';
 
import Swiper from 'react-native-swiper';
 
const styles = StyleSheet.create({
  wrapper: {
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  }
})
 
export default class SwiperMap extends Component {
  render(){
    return (
      <Swiper style={styles.wrapper} showsButtons={true} autoplay={true}>
     
        <View style={styles.slide1}>
        <Image
          
          source={require('../../assets/img1.jpg')}
        />
        </View>
        <View style={styles.slide2}>
        <Image
          
          source={require('../../assets/img2.jpg')}
        />
        </View>
        <View style={styles.slide3}>
        <Image
          
          source={require('../../assets/img3.jpg')}
        />
        </View>
      </Swiper>
    );
  }
}
 