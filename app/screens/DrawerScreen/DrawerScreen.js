import React, {Component} from 'react';
import {NavigationActions} from 'react-navigation';
import PropTypes from 'prop-types';
import {ScrollView, Text, View, StyleSheet,ImageBackground,TouchableOpacity} from 'react-native';
import { DrawerActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons'
class DrawerScreen extends Component {
  
  render () {
    const valueProps  = this.props.navigation.state.routes[0].index == 1 ? this.props.navigation.state.routes[0].routes[1].params.photorUl : null

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
          <View style={styles.headerContainer}>
                <ImageBackground source={require('../../assets/headerbook.jpeg')} style={{flex: 1, width: 280, justifyContent: 'center'}} >
                    <Text style={styles.headerText}>Header Portion</Text>
                   
                     <Image source={{uri:valueProps}}
                     style={{width: 100, height: 100, borderRadius: 150/2, marginLeft: 120}}
                   />  
                </ImageBackground>
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