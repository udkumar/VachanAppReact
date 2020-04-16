import React, {Component} from 'react';
import { StyleSheet, ActivityIndicator, View, Text, Alert,TextInput,TouchableOpacity,Button} from 'react-native';
// import { Button } from 'native-base';
// import auth from '@react-native-firebase/auth';
import firebase from 'react-native-firebase'

export default class Login extends Component {
    constructor(){
        super()
        this.state = {
            email:'',
            password:'',
            showLoading:''
        }
    }

    login = async() => {
        this.setState({showLoading:true});
        try {
            const doLogin = await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password);
            this.setState({showLoading:false})
            if(doLogin.user) {
                console.log("User ",doLogin.user)
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
                        onPress={() => this.login()}
                        style={styles.textInput}
                        title="Login"
                        color="#841584"
                    />
                     
                    </View>
                    <View style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                        <Text onPress={()=>this.props.navigation.navigate('Reset')}>Forgot Password?</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                        <Text onPress={()=>this.props.navigation.navigate('Register')}>Not a user?</Text>
                    </View>
                    {/* {this.state.showLoading &&
                        <View style={styles.activity}>
                            <ActivityIndicator size="large" color="#0000ff" />
                        </View>} */}
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

// import React, { Component } from 'react';
// import {
//   Text,
//   View,
//   TextInput,
//   Button,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
// } from 'react-native';
// import firebase from 'react-native-firebase';
// import AsyncStorageUtil from '../../utils/AsyncStorageUtil';
// import colorConstants from '../../utils/colorConstants'
// import {AsyncStorageConstants} from '../../utils/AsyncStorageConstants'


// export default class Login extends Component {

//     static navigationOptions = ({navigation}) => ({
//         headerTitle: 'Login',
//     });

//     constructor(props){
//         super(props);
//         this.unsubscriber = null;
//         this.state = {
//             email:'',
//             user:null,
//             isLoading: false,
//         }
//     }
//     doLogin = () => {
//         const { email, password } = this.state
//         try {
//           firebase
//              .auth()
//              .signInWithEmailAndPassword(email, password)
//              .then(res => {
//                  console.log(res.user.email);
//           });
//     } catch (error) {
//           console.log(error.toString(error));
//         }
//       };

//     doSignIn = () => {
//         if (this.state.email == "") {
//             Alert.alert("Email", "Email field is empty, please enter email in input box.")
//             return
//         }
//         this.setState({isLoading: true}, () => {
//             const { email, password } = this.state
//             firebase.auth()
//             .createUserWithEmailAndPassword(email, password)
//             .then(() =>{
//               console.log("success login")
//             }
//             )
//             .catch(error => {
//                 if(error.userInfo ==null){
//                     Alert.alert(" email already taken")
//                 }
//                 console.log("error ",error.userInfo)
//             })
//             // var actionCodeSettings = {
//             //     url: 'https://autographa.org/products/',
//             //     handleCodeInApp: true,
//             //     // iOS: {bundleId: 'com.autographago_reactnative.ios'},
//             //     android: {packageName: 'com.vachango', installApp: true}
//             // }
//             // console.log("SENDING")
//             // firebase.auth().sendSignInLinkToEmail(this.state.email, actionCodeSettings)
//             //     .then(() => {
//             //         // The link was successfully sent. Inform the user.
//             //         // Save the email locally so you don't need to ask the user for it again
//             //         // if they open the link on the same device.
//             //         console.log("ON SUCCESS SEND SIGN IN LINK TO MAIL  : " + this.state.email)
//             //         AsyncStorageUtil.setItem(AsyncStorageConstants.Keys.BackupRestoreEmail, this.state.email);
//             //     })
//             //     .catch(function(error) {
//             //         // Some error occurred, you can inspect the code: error.code
//             //         console.log("sendSignInLinkToEmail  error : " + error.code)
//             //         Alert.alert("Error", "There is some error in sending sign in link to your email. " + error.code)
//                 // });
//         })
//     }

//     async componentDidMount() {
//         // var email = await AsyncStorageUtil.getItem(AsyncStorageConstants.Keys.BackupRestoreEmail, "")
//         // this.setState({email})
//         var config = {
//             apiKey: "AIzaSyDUc9nH-YlnKD9YmJ8oisBfcAbUZh-6wg0",
//             authDomain: "vachan-go.firebaseapp.com",
//             databaseURL: "https://vachan-go.firebaseapp.com",
//             projectId: "vachan-go",
//             storageBucket: "vachan-go.appspot.com",
//              messagingSenderId: "486797934259"
//            };
//           firebase.initializeApp(config);
//             // var email = await AsyncStorageUtil.getItem(AsyncStorageConstants.Keys.BackupRestoreEmail, "")
//             // this.setState({email})          
//     }

//     render() {
//         return (
//             <View style={this.props.styles.container}>
//                 <View style={this.props.styles.containerMargin}>
//                     <ActivityIndicator
//                         style={this.props.styles.loaderStyle}
//                         animating={this.state.isLoading == true ? true : false} 
//                         size="large" 
//                         color="#0000ff" /> 
//                     <Text style={this.props.styles.textStyle}>Welcome to AutographaGo app!</Text>
//                     <TextInput
//                     style={this.props.styles.textInputStyle}
//                     value={this.state.email}
//                     onChangeText={email => this.setState({ email })}
//                     placeholder='Email'
//                     autoCapitalize='none'
//                     />
//                     <TextInput
//                         style={this.props.styles.textInputStyle}
//                         value={this.state.password}
//                         onChangeText={password => this.setState({ password })}
//                         placeholder='Password'
//                         secureTextEntry={true}
//                     />
//                     <Button 
//                         style={this.props.styles.buttonStyle}
//                         onPress={this.doLogin}
//                         title="Log In"
//                     color="#841584" />
//                     <View style={{margin:10}}></View>
//                     <Button 
//                         style={this.props.styles.buttonStyle}
//                         onPress={this.doSignIn}
//                         title="Sign Up"
//                     color="#841584" />

//                 </View>
//             </View>
//         );
//     }
// }