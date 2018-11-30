import React, {Component} from 'react';
import {NavigationActions} from 'react-navigation';
import PropTypes from 'prop-types';
import {ScrollView, Text, View} from 'react-native';
import { DrawerActions } from 'react-navigation';

class DrawerScreen extends Component {
    constructor(props){
        super(props);
    }
  navigateToScreen = (route) => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
//     this.props.navigation.dispatch(navigateAction);
//     props.navigation.navigate('DrawerClose');
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
            <View style={{
                    padding: 10,
                    borderWidth: 0.5,
                    borderColor: '#d6d7da'
                }}>
              <Text onPress={()=>{this.props.navigation.navigate('History')}}>
              History
              </Text>
            </View>
            <View style={{
                    padding: 10,
                    borderWidth: 0.5,
                    borderColor: '#d6d7da'
                }}>
              <Text onPress={()=>{this.props.navigation.navigate('Settings')}}>
              Settings
              </Text>
            </View>
            <View style={{
                    padding: 10,
                    borderWidth: 0.5,
                    borderColor: '#d6d7da'
                }}>
              <Text onPress={()=>{this.props.navigation.navigate('Highlights')}}>
              Highlights
              </Text>
            </View>
            <View style={{
                    padding: 10,
                    borderWidth: 0.5,
                    borderColor: '#d6d7da'
                }}>
              <Text onPress={()=>{this.props.navigation.navigate('Bookmarks')}}>
              Bookmarks
              </Text>
            </View>
            <View style={{
                    padding: 10,
                    borderWidth: 0.5,
                    borderColor: '#d6d7da'
                }}>
              <Text onPress={()=>{this.props.navigation.navigate('Notes')}}>
              Notes
              </Text>
            </View>
            <View style={{
                    padding: 10,
                    borderWidth: 0.5,
                    borderColor: '#d6d7da'
                }}>
              <Text onPress={()=>{this.props.navigation.navigate('Search')}}>
              Search
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}



export default DrawerScreen;