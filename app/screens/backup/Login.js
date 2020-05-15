import React, {Component} from 'react';
import { StyleSheet, ActivityIndicator, View, Text, Alert,TextInput,TouchableOpacity,Button,BackHandler} from 'react-native';
// import { Button } from 'native-base';
// import auth from '@react-native-firebase/auth';
import firebase from 'react-native-firebase'
import {AsyncStorageConstants} from '../../utils/AsyncStorageConstants';
import AsyncStorageUtil from '../../utils/AsyncStorageUtil';
import DbQueries from '../../utils/dbQueries'
import {userInfo} from '../../store/action/'
import {connect} from 'react-redux'



 class Login extends Component {
    // static navigationOptions = {
    //     header: null,
    //     };
    constructor(props){
        super(props)
        this.state = {
            email:'revant@gmail.com',
            password:'123456',
            showLoading:false
        }
    }

    login = async() => {
        this.setState({showLoading:true})
        try {
            const doLogin = await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password);
            this.setState({showLoading:false})
            if(doLogin.user){
                this.props.userInfo({email:doLogin.user._user.email,uid:doLogin.user._user.uid,userName:doLogin.user._user.displayName,phoneNumber:null})
            }
        } catch (e) {
            console.log(" ERROR  ",e)
            this.setState({showLoading:false});
        }
    }
    render(){
        return (
            <View style={styles.container}>
                <View style={styles.formContainer}>
                    {/* <View style={styles.activity}>
                    {
                    this.state.showLoading &&
                    <ActivityIndicator size="large" color="#0000ff" />
                    }
                        </View> */}
                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{ fontSize: 28, height: 50  }}>Please Login!</Text>
                    </View>
                    <View style={styles.subContainer}>
                    <TextInput
                            style={styles.textInputStyle}
                            value={this.state.email}
                            onChangeText={email => this.setState({ email })}
                            placeholder='Email'
                            autoCapitalize='none'/>
                    </View>
                    <View style={styles.subContainer}>
                    <TextInput
                        style={styles.textInputStyle}
                        value={this.state.password}
                        onChangeText={password => this.setState({ password })}
                        placeholder='Password'
                        autoCapitalize='none'/>
                    </View>
                    <View style={styles.subContainer}>
                    <Button
                        onPress={this.login}
                        style={styles.textInput}
                        title="Login"
                        color="#3E4095"
                    />
                     
                    </View>
                    <View style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                        <Text onPress={()=>this.props.navigation.navigate('Reset')}>Forgot Password?</Text>
                    </View>
                    {/* <View style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                        <Text onPress={()=>this.props.navigation.navigate('Bible')}>Use as a Guest</Text>
                    </View> */}
                    <View style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                        <Text onPress={()=>this.props.navigation.navigate('Register')}>Not a user?</Text>
                    </View>
                    
                </View>
            </View>
        )
    }

}

// Login.navigationOptions = ({ navigation }) => ({
//     title: 'Login',
//     headerShown: false,
// });

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    formContainer: {
        flex:1,
        alignContent:'center',
        justifyContent:'center',
        height: 400,
        padding: 20
    },
    subContainer: {
        marginBottom: 10,
        // padding: 5,
    },
    activity: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textInput: {
        fontSize: 18,
        margin: 5,
        width: 200
    },
    textInputStyle:{
        height: 40,
        width:300, 
        borderColor: 'gray', 
        borderWidth: 1,
        // marginVertical:
    },
})

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
  
  export  default connect(mapStateToProps,mapDispatchToProps)(Login)