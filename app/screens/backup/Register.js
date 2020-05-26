import React, {Component } from 'react';
import { StyleSheet, ActivityIndicator, View, Text, Alert,TextInput,TouchableOpacity,Button } from 'react-native';
// import { , Input, Icon } from 'react-native-elements';
// import {Button} from 'native-base'
// import auth from '@react-native-firebase/auth';
import firebase from 'react-native-firebase'



export default class Register extends Component {
    constructor(props){
        super(props)
        this.state ={
            email:'',
            password:'',
            showLoading:''
        }
    }
    register = () => {
        this.setState({showLoading:true});
            console.log("do register ")
        try {
            const doRegister =  firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password);
            this.setState({showLoading:false});
            if(doRegister.user) {
                console.log("doRegister ",doRegister.user)
                this.props.navigation.navigate('Bible');
            }
        } catch (e) {
            this.setState({showLoading:false});

            Alert.alert(
                e.message
            );
        }
    }
    render(){
        return (
            <View style={styles.container}>
                <View style={styles.formContainer}>
                    <View style={{alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 28, height: 50 }}>Register Here!</Text>
                    </View>
                    <View style={styles.subContainer}>
                    <TextInput
                        style={styles.textInputStyle}
                        value={this.state.email}
                        onChangeText={email => this.setState({ email })}
                        placeholder='Email'
                        autoCapitalize='none'
                    />
                    </View>
                    <View style={styles.subContainer}>
                    <TextInput
                        style={styles.textInputStyle}
                        value={this.state.password}
                        onChangeText={password => this.setState({ password })}
                        placeholder='Password'
                        autoCapitalize='none'
                    />
                    </View>
                    <View style={styles.subContainer}>
                    <Button
                        onPress={()=>this.register}
                        style={styles.textInput}
                        title="Register"
                        color="#3E4095"
                        // accessibilityLabel="Learn more about this purple button"
                    />
                    </View>
                    <View style={{alignItems: 'center', justifyContent: 'center' }}>
                    <Text onPress={()=>this.props.navigation.navigate('Login')}>Already a user?</Text>
                    </View>
                 
                </View>
            </View>
        )
    }
    
}

// Register.navigationOptions = ({ navigation }) => ({
//     title: 'Register',
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
        justifyContent:'center',
        alignItems:'center',
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