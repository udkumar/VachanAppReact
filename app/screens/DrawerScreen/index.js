import React, {Component} from 'react';
import {NavigationActions} from 'react-navigation';
import PropTypes from 'prop-types';
import {ScrollView, Text, View, StyleSheet,ImageBackground,TouchableOpacity,Image} from 'react-native';
import { DrawerActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons'

import {connect} from 'react-redux'

// import auth from 'react-native-firebase';
import firebase from 'react-native-firebase'
import AsyncStorageUtil from '../../utils/AsyncStorageUtil'
import {AsyncStorageConstants} from '../../utils/AsyncStorageConstants'




class DrawerScreen extends Component {
  constructor(props){
    super(props)
    this.unsubscriber = null
    this.state = {
      initializing:true,
      user:''
    }
  }

  // onLogin=()=>{
  //   if (this.state.initializing){this.setState({initializing:false})}
  //   this.unsubscriber = firebase.auth().onAuthStateChanged((user)=>{
  //     this.setState({user})
  //     if (!user) {
  //       this.props.navigation.navigate('Auth') 
  //     }
  //     else{
  //       console.log("user  ",user._user.email)
  //       this.setState({user})
  //       this.props.navigation.navigate('Auth')
  //     }
  //   })
  // }
  async componentDidMount(){
    var email = await AsyncStorageUtil.getItem(AsyncStorageConstants.Keys.BackupRestoreEmail)
    this.setState({email})
  }
  // componentWillUnmount(){
  //   if(this.unsubscriber) {
  //     this.unsubscriber();
  //   }
  // }
  render () {
    // const valueProps  = this.props.navigation.state.routes[0].index == 1 ? (this.props.navigation.state.routes[0].routes[1].params ? this.props.navigation.state.routes[0].routes[1].params.photorUl : null) : null
 
    const iconName = [
      {icon:'bookmark',pressIcon:'BookMarks'},
      {icon:'border-color',pressIcon:'Highlights'},
      {icon:'note',pressIcon:'Notes'},
      {icon:'history',pressIcon:'History'},
      {icon:'search',pressIcon:'Search'},
      {icon:'settings',pressIcon:'Settings'},
      {icon:'info',pressIcon:'About'},

    ]
    
    return (
      <ScrollView> 
          <View style={styles.headerContainer}>
                <ImageBackground source={require('../../assets/headerbook.jpeg')} style={{flex:1,width: 280,}} >
                    <View style={{position:'absolute',bottom:0,left:0}}>
                    <Image
                      style={{width: 50,height: 50,alignSelf:'center',padding:8}}
                      source={require('../../assets/bcs_old_favicon.png')}
                    />
                    <TouchableOpacity style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',}}  onPress={()=>{this.props.navigation.navigate('Auth')}}>
                    <View style={{flexDirection:'row',padding:8,alignItems:'center',justifyContent:'center'}}>
                    <Icon name='account-circle' size={20} color={'#fff'} style={{paddingRight:16}}/>
                    <Text style={styles.headerText}>Login/Sign Up</Text>
                    </View>
                    <Icon name='chevron-right' size={20} color={'#fff'} style={{paddingRight:16}}/>
                    </TouchableOpacity>
                    </View>
                </ImageBackground>
            </View>
        {
          iconName.map((iconName,index)=>
                <TouchableOpacity 
                onPress={()=>{this.props.navigation.navigate(iconName.pressIcon)}} 
                style={{
                    flex:1,
                    flexDirection:"row",
                    justifyContent:'space-between',
                    alignItems:'center',
                    paddingHorizontal:8,
                    paddingVertical:12,
                    borderWidth: 0.3,
                    borderColor: '#d6d7da'
                }}>
                    <View 
                    style={{
                      flexDirection:"row",
                  }}>
                      <Icon name={iconName.icon} size={20} style={{paddingRight:16}}/>
                      <Text 
                        style={{fontSize:16}}>
                        {iconName.pressIcon}
                      </Text>
                    </View>
                    <Icon name='chevron-right' size={20} style={{paddingRight:16}}/>
              </TouchableOpacity>
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
    // padding:8,
    color: '#fff8f8',
    // textDecorationLine: 'underline',
    // lineHeight:6
},customText:{
   fontSize: 18,
   textAlign: 'center',
   color:'#040404'
  
}
})

const mapStateToProps = state =>{
  return{
    sizeFile:state.updateStyling.sizeFile,
    colorFile:state.updateStyling.colorFile,
  }
}


export  default connect(mapStateToProps,null)(DrawerScreen)
