// import React, { Component } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   TextInput,
//   Button,
//   TouchableHighlight,
//   Image,
//   Alert
// } from 'react-native';
// const FBSDK = require('react-native-fbsdk');
// const {
//   LoginButton,
//   AccessToken,
//   LoginManager,
//   ShareDialog
// } = FBSDK;
// import { createStackNavigator, createAppContainer } from 'react-navigation';
// // import { GoogleSignin, GoogleSigninButton,statusCodes  } from 'react-native-google-signin';
// export default class SignUpView extends Component {
//   static navigationOptions = {
//     header: null
// }

//   constructor(props) {
//     super(props);
//     this.state = {
//       fullName: '',
//       email   : '',
//       password: '',
//       userInfo:'',
//       isLoggedIn:false,
//       name: "",
//       photoUrl: "",
//       fbpic:""
//     }

//     this.onLoginFB =this.onLoginFB.bind(this)
//   }
//   onLoginFB(){
//   LoginManager.logInWithReadPermissions(['public_profile']).then(
//   function(result) {
//     console.log("resultfbbb"+JSON.stringify(result))
// this.setState({fbpic:result.cer})
//     if (result.isCancelled) {
//       alert('Login was cancelled');
//     } else {
//       alert('Login was successful with permissions: '
//         + result.grantedPermissions.toString());
//     }
//   },
//   function(error) {
//     alert('Login failed with error: ' + error);
//   }
// );
//   }

//   signIn = async () => {
//     console.log("google signin")
//     try {
//       await GoogleSignin.hasPlayServices();
//       await GoogleSignin.configure({
//         webClientId:'432787355660-qr64819anf3hb6c67gf418dkemsvm0di.apps.googleusercontent.com',
//         offlineAccess: true,
//         scopes: ['https://www.googleapis.com/auth/gmail.readonly'],
//     });
//       const userInfo = await GoogleSignin.signIn();
//       console.log("userinfo "+JSON.stringify(userInfo))
//       this.setState({ userInfo,isLoggedIn:true ,name:userInfo.name,photoUrl:userInfo.photo});
//       console.log("username"+ userInfo.name)
//       console.log("useremail"+ userInfo.email)
//       console.log("userimage"+userInfo.photo)
//       this.props.navigation.navigate('Bible',{photorUl:this.state.photoUrl})
//     } catch (error) {
//       console.log("error "+error)
//       console.log("statusCodes "+JSON.stringify(statusCodes))
//       if (error.code === statusCodes.SIGN_IN_CANCELLED) {
//         // user cancelled the login flow
//       } else if (error.code === statusCodes.IN_PROGRESS) {
//         // operation (f.e. sign in) is in p"rogress already
//       } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
//         // play services not available or outdated
//       } else {
//         // some other error happened
//       }
//     }
   
//   }

//   componentDidMount(){
//     GoogleSignin.configure({
//       iosClientId: '<FROM DEVELOPER CONSOLE>', // only for iOS
//     });
    
//     getCurrentUser = async () => {
//       try {
//         const userInfo = await GoogleSignin.signInSilently();
//         this.setState({ userInfo });
//       } catch (error) {
//         console.error(error);
//       }
//     }
//   }
//   signOut = async () => {
//     try {
//       await GoogleSignin.signOut();
//       this.setState({ userInfo: null }); // Remember to remove the user from your app's state as well
//        } catch (error) {
//       console.error(error);
//     }
// } 
//   onClickListener = () => {
//    this.props.navigation.navigate('Bible')
//   }
//   onClickListenersignup = () => {
   
//     this.props.navigation.navigate('Signup')
//   }
//   render() {
//     return (
//       <View style={styles.container}>
       
// <View>
//     <LoginButton
//           onLoginFinished={this.onLoginFB}
// />
// </View>
// <View>
//       <GoogleSigninButton
//         style={{ width: 192, height: 48 }}
//         size={GoogleSigninButton.Size.Icon}
//         color={GoogleSigninButton.Color.Dark}
//         onPress={this.signIn}/>
//         {this.state.isLoggedIn ?  <Text>{this.state.name}</Text> : <Text>Please login</Text>}
//       <Text onPress={this.signOut}>LOGOUT </Text>
//       <Image
//           style={{width: 50, height: 50}}
//           source={{uri:this.state.photoUrl}}
//         />
//     </View>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#00b5ec',
//   },
//   inputContainer: {
//       borderBottomColor: '#F5FCFF',
//       backgroundColor: '#FFFFFF',
//       borderRadius:30,
//       borderBottomWidth: 1,
//       width:250,
//       height:45,
//       marginBottom:20,
//       flexDirection: 'row',
//       alignItems:'center'
//   },
//   inputs:{
//       height:45,
//       marginLeft:16,
//       borderBottomColor: '#FFFFFF',
//       flex:1,
//   },
//   inputIcon:{
//     width:30,
//     height:30,
//     marginLeft:15,
//     justifyContent: 'center'
//   },
//   buttonContainer: {
//     height:45,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom:20,
//     width:250,
//     borderRadius:30,
//   },
//   signupButton: {
//     backgroundColor: "#FF4DFF",
//   },
//   signUpText: {
//     color: 'white',
//   }
// });