import React, {Component} from 'react';
import {NavigationActions} from 'react-navigation';
import PropTypes from 'prop-types';
import {ScrollView, Text, View, StyleSheet,ImageBackground,TouchableOpacity} from 'react-native';
import { DrawerActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons'
class DrawerScreen extends Component {
    constructor(props){
        super(props);
    }
  render () {
    const iconName = [
      {icon:'local-library',pressIcon:'Bible',},
      {icon:'history',pressIcon:'History'},
      {icon:'search',pressIcon:'Search'},
      {icon:'settings',pressIcon:'Settings'},
      {icon:'map',pressIcon:'GoogleMaps'},
      {icon:'image',pressIcon:'Images'}
    ]
    return (
      <ScrollView>
          <View style={{height:120}}>
            <ImageBackground source={require('../../assets/headerbook.jpeg')} style={{flex: 1, width: 280, justifyContent: 'center'}} />
          </View>
        {
          iconName.map((iconName,index)=>
         <View style={{
                    padding: 16,
                    borderWidth: 0.5,
                    borderColor: '#d6d7da'
                }}>
                <View>
                <TouchableOpacity onPress={()=>{this.props.navigation.navigate(iconName.pressIcon)}} style={{flex:1,flexDirection:"row"}}>
                  <Icon name={iconName.icon} size={32}/>
                  <Text 
                    style={{padding:6,fontSize:16}}>
                    {iconName.pressIcon}
                  </Text>
              </TouchableOpacity>
            </View>
            </View>
          )

        }
        
      </ScrollView>
    );
  }
}


export default DrawerScreen;