import React, { Component } from 'react';
import { StyleSheet, ActivityIndicator, View, Alert,TextInput,Text,TouchableOpacity,Button } from 'react-native';
// import { Button, Input, Icon } from 'react-native-elements';
// import {Button} from 'native-base'
// import auth from '@react-native-firebase/auth';
import firebase from 'react-native-firebase'



export default class Reset extends Component {

    constructor(props){
        super(props)
        this.state ={
            email:'',
            isLoading:false
        }
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
            alert('Please check your email...')
           console.log(" on VAL RESET ",onVal)
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
              <View style={styles.preloader}>
                <ActivityIndicator size="large" color="#3E4095"/>
              </View>
            )
          }    
        return (
            <View style={styles.container}>  
            <TextInput
            style={styles.inputStyle}
            placeholder="Email"
            value={this.state.email}
            onChangeText={(val) => this.updateInputVal(val, 'email')}
          />
            <Button
              color="#3E4095"
              title="Reset Password"
              onPress={() => this.reset()}
            />  
            <Text 
            style={styles.loginText}
            onPress={() => this.props.navigation.goBack()}>
            Back to login
            </Text>                           
          </View>
        )
    }
    
}

// Reset.navigationOptions = ({ navigation }) => ({
//     title: 'Reset',
//     headerShown: false,
// });
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
  