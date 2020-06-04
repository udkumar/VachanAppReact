
import React, {Component } from 'react';
import { StyleSheet, ActivityIndicator, View, Text, Alert,TextInput,TouchableOpacity,Button } from 'react-native';
// import { , Input, Icon } from 'react-native-elements';
// import {Button} from 'native-base'
// import auth from '@react-native-firebase/auth';
import firebase from 'react-native-firebase'
import {userInfo} from '../../store/action/'
import {connect} from 'react-redux'


import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


class Register extends Component {
    constructor(props){
        super(props)
        this.state ={
            // email:'',
            // password:'',
            // showLoading:'',
            displayName: '',
            email: '', 
            password: '',
            cpassword:'',
            passwordVisible:true,
            isLoading: false
        }
    }
    updateInputVal = (val, prop) => {
      const state = this.state;
      state[prop] = val;
      this.setState(state);
    }
    registerUser = () => {
      if(this.state.email === '' && this.state.password === '') {
        Alert.alert('Enter details to signup!')
      } else {
        this.setState({
          isLoading: true,
        })
        if(this.state.cpassword === this.state.password){
        firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then((res) => {
            res.user.updateProfile({
              displayName: this.state.displayName,
              // phoneNumber:
            })
            this.props.userInfo({email:res.user._user.email,uid:res.user._user.uid,userName:res.user._user.displayName,phoneNumber:null})
            // this.props.navigation.navigate('Bible')
            console.log('User registered successfully!',res)
            // this.setState({
            //   isLoading: false,
            //   displayName: '',
            //   email: '', 
            //   password: ''
            // })
          // this.props.navigation.navigate('Login')
        })
        .catch(error =>{
          if(error.code === 'auth/weak-password'){
            Alert.alert("Weak password")

          }
          if(error.code === 'auth/email-already-in-use'){
            Alert.alert("Email already in use")

          }
          if(error.code === 'auth/invalid-email'){
            Alert.alert("Invalid Email")
          }
          this.setState({isLoading:false })
        })   
      }
      else{
        Alert.alert("Password and confirm password donot match")
        this.setState({isLoading:false})
      }   
      }
    }
  
    render(){
          if(this.state.isLoading){
            return(
              <View style={styles.preloader}>
                <ActivityIndicator size="large" color="#3E4095"/>
              </View>
            )
          }    
          return (
            <View style={styles.container}>  
              <TextInput
                style={styles.inputStyle}
                placeholder="Name"
                value={this.state.displayName}
                onChangeText={(val) => this.updateInputVal(val, 'displayName')}
              />      
              <TextInput
                style={styles.inputStyle}
                placeholder="Email"
                value={this.state.email}
                onChangeText={(val) => this.updateInputVal(val, 'email')}
              />
              <View>
              <TextInput
                style={styles.inputStyle}
                placeholder="Password"
                value={this.state.password}
                onChangeText={(val) => this.updateInputVal(val, 'password')}
                maxLength={15}
                secureTextEntry={this.state.passwordVisible}
              />   
            <Icon name={this.state.passwordVisible ? 'eye-off' : 'eye'} size={24} style={{alignSelf:'flex-end',position: 'absolute', right: 10, bottom:30}} onPress={()=>this.setState({passwordVisible:!this.state.passwordVisible})}/>
            </View>
            <View>
              <TextInput
                style={styles.inputStyle}
                placeholder="Confirm Password"
                value={this.state.cpassword}
                onChangeText={(val) => this.updateInputVal(val, 'cpassword')}
                maxLength={15}
                secureTextEntry={this.state.passwordVisible}
              />   
            <Icon name={this.state.passwordVisible ? 'eye-off' : 'eye'} size={24} style={{alignSelf:'flex-end',position: 'absolute', right: 10, bottom:30}} onPress={()=>this.setState({passwordVisible:!this.state.passwordVisible})}/>
            </View>
              <Button
                color="#3E4095"
                title="Signup"
                onPress={() => this.registerUser()}
              />
              <Text 
                style={styles.loginText}
                onPress={() => this.props.navigation.goBack()}>
                Already Registered? Click here to login
              </Text>                          
            </View>
          );
    }
    
}

const mapStateToProps = state =>{
  return{
      language: state.updateVersion.language,
      versionCode:state.updateVersion.versionCode,

      email:state.userInfo.email,
      uid:state.userInfo.uid,
      userName:state.userInfo.userName,
      phoneNumber:state.userInfo.phoneNumber
  }
}
const mapDispatchToProps = dispatch =>{
  return {
   userInfo:(payload)=>dispatch(userInfo(payload))
  }
}

export  default connect(mapStateToProps,mapDispatchToProps)(Register)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: 35,
    backgroundColor: '#fff'
  },
  inputStyle: {
    width: '100%',
    marginBottom: 15,
    paddingBottom: 15,
    alignSelf: "center",
    borderColor: "#ccc",
    borderBottomWidth: 1
  },
  loginText: {
    color: '#3740FE',
    marginTop: 25,
    textAlign: 'center'
  },
  preloader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  }
});