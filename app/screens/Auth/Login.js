
import React, {Component} from 'react';
import { NavigationActions, StackActions } from 'react-navigation';
import { StyleSheet, ActivityIndicator, View,KeyboardAvoidingView, Platform,Text, Alert,TextInput,TouchableOpacity,Button,Image} from 'react-native';
import firebase from 'react-native-firebase'
import {userInfo} from '../../store/action'
import {connect} from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';  
import { AccessToken, LoginManager,LoginButton } from 'react-native-fbsdk';
import {styles} from './styles.js'

 class Login extends Component {
    static navigationOptions = {
        header: null,
    };
    constructor(props){
        super(props)
        this.state = {
            email:'',
            password:'',
            user:'',
            isLoading:false,
            passwordVisible:true
        }
        this.styles = styles(this.props.colorFile, this.props.sizeFile);  
    }
    updateInputVal = (val, prop) => {
      const state = this.state;
      state[prop] = val;
      this.setState(state);
    }

    login = async() => {
      if(this.state.email === '' && this.state.password === '') {
        // Alert.alert('Enter details to signin!')
      } else {
        this.setState({
          isLoading: true,
        })
        firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then((res) => {
          console.log(res)
          // this.props.userInfo({email:user._user.email,uid:user._user.uid,
          // userName:user._user.displayName,phoneNumber:null,photo:user._user.photoURL})
          this.props.navigation.navigate("Bible")
          this.setState({
            isLoading: false,
            email: '', 
            password: ''
          })
        })
        .catch(error => {
          console.log("ERROR IN LOGIN PAGE ",error)
          if(error.code ==='auth/user-not-found'){
            Alert.alert("User not found")
          }
          if(error.code ==='auth/wrong-password'){
            Alert.alert("Wrong password")
          }
          if(error.code === 'auth/invalid-email'){
            Alert.alert("Invalid Email")
          }
          this.setState({isLoading:false })
        })
      }
    }

    _signInGoogle = () => {
      GoogleSignin.signIn()
        .then((data) => {
          // console.log(" USER GOOGLE DATA ",data)

          // Create a new Firebase credential with the token
          const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken);
          // Login with the credential
          return firebase.auth().signInWithCredential(credential);
        })
        .then((res) => {
          this.props.navigation.navigate("Bible")
          // this.props.userInfo({email:res.user._user.email,uid:res.user._user.uid,userName:res.user._user.displayName,phoneNumber:null,photo:res.user._user.photoURL})
          // If you need to do anything with the user, do it here
          // The user will be logged in automatically by the
          // `onAuthStateChanged` listener we set up in App.js earlier
        })
        .catch((error) => {
          const { code, message } = error;
          // console.log("ERROR ",error)
          // For details of error codes, see the docs
          // The message contains the default Firebase string
          // representation of the error
        });
    }

    _signInFacebook = () => {
      LoginManager.logInWithPermissions(['public_profile', 'email'])
        .then((result) => {
          // console.log(" USER facbook result ",result)
          if (result.isCancelled) {
            return Promise.reject(new Error('The user cancelled the request'));
          }
          // Retrieve the access token
          return AccessToken.getCurrentAccessToken();
        })
        .then((data) => {
          const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
          // Login with the credential
          return firebase.auth().signInWithCredential(credential);
        })
        .then((res) => {
          this.props.navigation.navigate("Bible")
          // this.props.userInfo({email:res.user._user.email,uid:res.user._user.uid,userName:res.user._user.displayName,phoneNumber:null,photo:res.user._user.photoURL})
          // console.log(" USER facbook user ",user)
        })
        .catch((error) => {
          const { code, message } = error;
          // For details of error codes, see the docs
          // The message contains the default Firebase string
          // representation of the error
        });
    }
    componentDidMount(){
      GoogleSignin.configure({
        scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
        webClientId: '486797934259-gkdusccl094153bdj8cbugfcf5tqqb4j.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
        offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
        hostedDomain: '', // specifies a hosted domain restriction
        loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
        forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login.
        // accountName: '', // [Android] specifies an account name on the device that should be used
        // iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
      });
    }
    render(){
      if(this.state.isLoading){
        return(
          <View style={this.styles.preloader}>
            <ActivityIndicator size="large" color="#3E4095"/>
          </View>
        )
      }    
        return (
          <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : "height"}
          style={this.styles.container}
        >
          <View>
            <Icon name='close' size={28} style={{position:'absolute',left:0,top:0,margin:12}} onPress={()=>{this.props.navigation.pop()}}/>
          </View>
          <View style={{padding:35,flex:1}}> 
          <View style={{alignItems:'center',justifyContent:'center'}}>
          <Image
            style={{width: 50,height: 50,marginVertical:16}}
            source={require('../../assets/bcs_old_favicon.png')}
          />
            <Text style={{fontSize:26,color:'#3E4095',fontWeight:'bold'}}>Sign In</Text>
          </View> 
          <View style={{
            flexDirection: "column",
            justifyContent: "center",
            }}> 
          <TextInput
            style={this.styles.inputStyle}
            placeholder="Email"
            value={this.state.email}
            onChangeText={(val) => this.updateInputVal(val, 'email')}
          />
          <View>
          <TextInput
            style={this.styles.inputStyle}
            placeholder="Password"
            value={this.state.password}
            onChangeText={(val) => this.updateInputVal(val, 'password')}
            maxLength={15}
            secureTextEntry={this.state.passwordVisible}
          />  
          <Icon name={this.state.passwordVisible ? 'eye' : 'eye-off'} size={24} style={{alignSelf:'flex-end',position: 'absolute', right: 10, bottom:30}} onPress={()=>this.setState({passwordVisible:!this.state.passwordVisible})}/>
          </View>
          <Button
            color="#3E4095"
            title="Signin"
            onPress={() => this.login()}
          />   
          <Text 
            style={this.styles.loginText}
            onPress={() => this.props.navigation.navigate('Reset')}>
            Reset password
          </Text>  
          <View style={{flexDirection:'row',marginVertical:8,alignItems:'center',justifyContent:'center'}}>
          <View
            style={{
              width:'45%',
              borderBottomColor: 'black',
              borderBottomWidth: 1,
            }}
          />
          <Text style={{margin:4,fontSize:18,fontWeight:'700'}}>Or</Text>
          <View
            style={{
              width:'45%',
              borderBottomColor: 'black',
              borderBottomWidth: 1,
            }}
          />
          </View>
          <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
          {/* <GoogleSigninButton
              size={GoogleSigninButton.Size.Icon}
              color={GoogleSigninButton.Color.Dark}
              onPress={this._signInGoogle}
              disabled={this.state.isSigninInProgress} /> */}
            <TouchableOpacity onPress={this._signInGoogle}>
              <Icon name="google" size={38} color="#DB4437"/>
            {/* <Text> Login With Google </Text>     */}
            </TouchableOpacity>
            <TouchableOpacity onPress={this._signInFacebook}>
            <Icon name="facebook" size={38} color="#3b5998"/>
              {/* <Text> Login With Facebook </Text>           */}
            </TouchableOpacity>
          </View>
          <Text 
            style={this.styles.loginText}
            onPress={() => this.props.navigation.navigate('Register')}>
            Don't have account? Click here to Sign Up
          </Text>  
        </View>
        </View>
        </KeyboardAvoidingView>
        )
    }

}

// Login.navigationOptions = ({ navigation }) => ({
//     title: 'Login',
//     headerShown: false,
// });


const mapStateToProps = state =>{
    return{
        language: state.updateVersion.language,
        versionCode:state.updateVersion.versionCode,

        email:state.userInfo.email,
        uid:state.userInfo.uid,
        userName:state.userInfo.userName,
        phoneNumber:state.userInfo.phoneNumber,

        sizeFile:state.updateStyling.sizeFile,
        colorFile:state.updateStyling.colorFile,
    }
  }
  const mapDispatchToProps = dispatch =>{
    return {
     userInfo:(payload)=>dispatch(userInfo(payload))
    }
  }
  
  export  default connect(mapStateToProps,mapDispatchToProps)(Login)


