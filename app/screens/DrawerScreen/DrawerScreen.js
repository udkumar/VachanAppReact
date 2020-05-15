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

  onLogin=()=>{
    if (this.state.initializing){this.setState({initializing:false})}
    this.unsubscriber = firebase.auth().onAuthStateChanged((user)=>{
      this.setState({user})
      if (!user) {
        this.props.navigation.navigate('ProfilePage') 
      }
      else{
        console.log("user  ",user._user.email)
        this.setState({user})
        this.props.navigation.navigate('ProfilePage')
      }
    })
  }
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
    const valueProps  = this.props.navigation.state.routes[0].index == 1 ? (this.props.navigation.state.routes[0].routes[1].params ? this.props.navigation.state.routes[0].routes[1].params.photorUl : null) : null
 
    const iconName = [
      // {icon:'local-library',pressIcon:'Home',},
      {icon:'info',pressIcon:'About'},
      {icon:'bookmark',pressIcon:'BookMarks'},
      {icon:'border-color',pressIcon:'Highlights'},
      {icon:'note',pressIcon:'Notes'},
      {icon:'history',pressIcon:'History'},
      {icon:'search',pressIcon:'Search'},

      // {icon:'insert-comment',pressIcon:'Commentary'},
      // {icon:'image',pressIcon:'Infographics'},

      // {icon:'description',pressIcon:'Articles'},
      // {icon:'thumb-up',pressIcon:'Subscribe'},
      // {icon:'help',pressIcon:'FAQ & Help Videos'},
      // {icon:'comment',pressIcon:'Feedback'},
      // {icon:'contacts',pressIcon:'Contact Us'},
      // {icon:'account-circle',pressIcon:'Account'},
      // {icon:}

      {icon:'settings',pressIcon:'Settings'},
    ]
    
    return (
      <ScrollView style={{flex:1}}> 
          <View style={styles.headerContainer}>
                <ImageBackground source={require('../../assets/headerbook.jpeg')} style={{flex: 1, width: 280, justifyContent: 'center'}} >
                     <Image source={{uri:valueProps}}
                     style={{width: 100, height: 100, borderRadius: 150/2, marginLeft: 120}}
                   />  
                    <Text onPress={this.onLogin} style={styles.headerText}>Login/Sign Up</Text>
                </ImageBackground>
            </View>
        {
          iconName.map((iconName,index)=>
                <TouchableOpacity 
                onPress={()=>{this.props.navigation.navigate(iconName.pressIcon)}} 
                style={{
                  flex:1,
                    flexDirection:"row",
                    padding:8,
                    borderWidth: 0.3,
                    borderColor: '#d6d7da'
                }}>
                  <Icon name={iconName.icon} size={20} style={{paddingRight:16}}/>
                  <Text 
                    style={{fontSize:16}}>
                    {iconName.pressIcon}
                  </Text>
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
    color: '#fff8f8',
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
