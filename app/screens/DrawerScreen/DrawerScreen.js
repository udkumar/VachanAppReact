import React, {Component} from 'react';
import {NavigationActions} from 'react-navigation';
import PropTypes from 'prop-types';
import {ScrollView, Text, View, StyleSheet,ImageBackground} from 'react-native';
import { DrawerActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons'
class DrawerScreen extends Component {
    constructor(props){
        super(props);
    }
  render () {
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
                    <Text style={styles.headerText}>You can display here logo or profile image</Text>
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
   textAlign: 'center'
  
}
})

export default DrawerScreen;