import React, {Component} from 'react';
import {NavigationActions} from 'react-navigation';
import PropTypes from 'prop-types';
import {ScrollView, Text, View,Image, StyleSheet,ImageBackground} from 'react-native';
import { DrawerActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons'
class DrawerScreen extends Component {
  
  render () {
    const valueProps  = this.props.navigation.state.routes[0].index == 1 ? this.props.navigation.state.routes[0].routes[1].params.photorUl : null
    return (
    
      <View>
        
        <ScrollView>
          <View>
            {/* <View style={{
                padding: 10,
                borderWidth: 0.5,
                borderColor: '#d6d7da'
            }}>
              <Text onPress={()=>{this.props.navigation.navigate('Bible')}}>
              Book
              </Text>
            </View> */}
              
             <View style={styles.headerContainer}>
                <ImageBackground source={require('../../assets/headerbook.jpeg')} style={{flex: 1, width: 280, justifyContent: 'center'}} >
                    <Text style={styles.headerText}>Header Portion</Text>
                   
                     <Image source={{uri:valueProps}}
                     style={{width: 100, height: 100, borderRadius: 150/2, marginLeft: 120}}
                   />  
                </ImageBackground>
            </View>
            <View style={{
                    padding: 10,
                    borderWidth: 0.5,
                    borderColor: '#d6d7da'
                }}>
              <Text onPress={()=>{this.props.navigation.navigate('History')}} 
              style={styles.customText}>
              History
              </Text>
              <View style={{ flex: 1,position: 'absolute',
               right: 180, alignItems:'flex-start',flexDirection: 'row', alignItems: 'center' }}>
             <Icon name="history" size={30} color="#040404"/>
            </View>
            </View>
            <View style={{
                    padding: 10,
                    borderWidth: 0.5,
                    borderColor: '#d6d7da'
                }}>
              <Text onPress={()=>{this.props.navigation.navigate('Settings')}}style={styles.customText}>
              Settings
              </Text>
              <View style={{ flex: 1,position: 'absolute',
               right: 180, alignItems:'flex-start',flexDirection: 'row', alignItems: 'center' }}>
             <Icon name="settings" size={30} color="#040404"/>
            </View>
            </View>
            <View style={{
                    padding: 10,
                    borderWidth: 0.5,
                    borderColor: '#d6d7da'
                }}>
              <Text onPress={()=>{this.props.navigation.navigate('Highlights')}}style={styles.customText}>
              Highlights
              </Text>
              <View style={{ flex: 1,position: 'absolute',
               right: 180, alignItems:'flex-start',flexDirection: 'row', alignItems: 'center' }}>
             <Icon name="highlight" size={30} color="#040404"/>
            </View>
            </View>
            <View style={{
                    padding: 10,
                    borderWidth: 0.5,
                    borderColor: '#d6d7da'
                }}>
              <Text onPress={()=>{this.props.navigation.navigate('Bookmarks')}}style={styles.customText}>
              Bookmarks
              </Text>
              <View style={{ flex: 1,position: 'absolute',
               right: 180, alignItems:'flex-start',flexDirection: 'row', alignItems: 'center' }}>
             <Icon name="bookmark" size={30} color="#040404"/>
            </View>
            </View>
            <View style={{
                    padding: 10,
                    borderWidth: 0.5,
                    borderColor: '#d6d7da'
                }}>
              <Text onPress={()=>{this.props.navigation.navigate('Notes')}}style={styles.customText}>
              Notes
              </Text>
              <View style={{ flex: 1,position: 'absolute',
               right: 180, alignItems:'flex-start',flexDirection: 'row', alignItems: 'center' }}>
             <Icon name="speaker-notes" size={30} color="#040404"/>
            </View>
            </View>
            <View style={{
                    padding: 10,
                    borderWidth: 0.5,
                    borderColor: '#d6d7da'
                }}>
              <Text onPress={()=>{this.props.navigation.navigate('Search')}}style={styles.customText}>
              Search
              </Text>
              <View style={{ flex: 1,position: 'absolute',
               right: 180, alignItems:'flex-start',flexDirection: 'row', alignItems: 'center' }}>
             <Icon name="search" size={30} color="#040404"/>
            </View>
            </View>
            <View style={{
                    padding: 10,
                    borderWidth: 0.5,
                    borderColor: '#d6d7da'
                }}>
              <Text onPress={()=>{this.props.navigation.navigate('Search')}}style={styles.customText}>
              Images
              </Text>
              <View style={{ flex: 1,position: 'absolute',
               right: 180, alignItems:'flex-start',flexDirection: 'row', alignItems: 'center' }}>
             <Icon name="image" size={30} color="#040404"/>
            </View>
            </View>
            <View style={{
                    padding: 10,
                    borderWidth: 0.5,
                    borderColor: '#d6d7da'
                }}>
              <Text onPress={()=>{this.props.navigation.navigate('GoogleMaps')}}style={styles.customText}>
              GoogleMaps
              </Text>
              <View style={{ flex: 1,position: 'absolute',
               right: 180, alignItems:'flex-start',flexDirection: 'row', alignItems: 'center' }}>
             <Icon name="map" size={30} color="#040404"/>
            </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  
  headerContainer: {
      height: 150,
  },
  headerText: {
    color: '#fff8f8',
},customText:{
   fontSize: 18,
   textAlign: 'center',
   color:'#040404'
  
}
})

export default DrawerScreen;