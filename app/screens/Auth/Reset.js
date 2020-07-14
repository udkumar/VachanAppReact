import React, { Component } from 'react';
import { StyleSheet, ActivityIndicator, View, Alert,TextInput,Text,TouchableOpacity,Button } from 'react-native';
// import { Button, Input, Icon } from 'react-native-elements';
// import {Button} from 'native-base'
// import auth from '@react-native-firebase/auth';
import firebase from 'react-native-firebase'
import {styles} from './styles.js'
import {connect} from 'react-redux'
import Color from '../../utils/colorConstants'


class Reset extends Component {

    constructor(props){
        super(props)
        this.state ={
            email:'',
            isLoading:false
        }
        this.styles = styles(this.props.colorFile, this.props.sizeFile);  
    }
    updateInputVal = (val, prop) => {
        const state = this.state;
        state[prop] = val;
        this.setState(state);
      }

    reset = () => {
        if(this.state.email === '' && this.state.password === '') {
            Alert.alert('Enter details to signin!')
          }else {
        this.setState({
            isLoading: true,
        })
        firebase.auth().sendPasswordResetEmail(this.state.email)
        .then((onVal) =>{
          // Alert.alert(
          //   'Save Changes ? ',
          //   'Do you want to save the note ',
          //   [
          //     {text: 'Cancel', onPress: () => {return}},
          //     {text: 'No', onPress: () => { this.props.navigation.dispatch(NavigationActions.back()) }},
          //     {text: 'Yes', onPress: () => this.saveNote()},
          //   ],
          // )
            alert('We will attempt to send a reset password email to '+ this.state.email +'\n'+"Click the email to Continue")
           this.setState({
            isLoading: false,
        })
        })
        .catch((error)=>{
            console.log("erro ",error)
            if(code === 'auth/user-not-found'){
                Alert.alert(" user not found ")
            }
    //         if (onError.toString().contains("ERROR_USER_NOT_FOUND")) {
    //             Alert.alert(" user not found ")
    //         }
    //         else if (onError.toString().contains("An internal error has occurred")) {
    //         Alert.alert("An internal error has occurred ")
    //    }
        this.setState({
            isLoading: false,
        })
        })
    }
    }
    render(){
        if(this.state.isLoading){
            return(
              <View style={this.styles.preloader}>
                <ActivityIndicator size="large" color={Color.Blue_Color}/>
              </View>
            )
          }    
        return (
            <View style={this.styles.container}>
              <View style={{display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: 35}}>
            <Text style={this.styles.textStyle}>Enter your email address and we'll send a link to reset your password.</Text>
            <TextInput
            style={this.styles.inputStyle}
            placeholderTextColor={this.styles.placeholderColor.color}
            placeholder="Enter email"
            value={this.state.email}
            onChangeText={(val) => this.updateInputVal(val, 'email')}
          />
            <Button
              color={Color.Blue_Color}
              title="Reset Password"
              onPress={() => this.reset()}
            />  
            <Text 
            style={this.styles.loginText}
            onPress={() => this.props.navigation.goBack()}>
            Back to login
            </Text>     
            </View>                        
          </View>
        )
    }
    
}

// Reset.navigationOptions = ({ navigation }) => ({
//     title: 'Reset',
//     headerShown: false,
// });

  
const mapStateToProps = state =>{
  return{
      email:state.userInfo.email,
      uid:state.userInfo.uid,
      photo:state.userInfo.photo,
      userName:state.userInfo.userName,

      sizeFile:state.updateStyling.sizeFile,
      colorFile:state.updateStyling.colorFile,
  }
}
// const mapDispatchToProps = dispatch =>{
//   return {
//    userInfo:(payload)=>dispatch(userInfo(payload))
//   }
// }

export  default connect(mapStateToProps,null)(Reset)