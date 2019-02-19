import React, { Component } from 'react';
import { AppRegistry, Text,StyleSheet,View ,Image} from 'react-native';
import { GoogleSignin, GoogleSigninButton,statusCodes  } from 'react-native-google-signin';
 
export default class Googlesign extends Component {
  constructor(props){
  super(props)
  this.state = {
    userInfo:'',
   isLoggedIn:false,
   name: "",
      photoUrl: ""
}
  }
  signIn = async () => {
    console.log("google signin")
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.configure({
        webClientId:'432787355660-qr64819anf3hb6c67gf418dkemsvm0di.apps.googleusercontent.com',
        offlineAccess: true,
        scopes: ['https://www.googleapis.com/auth/gmail.readonly'],
    });
      const userInfo = await GoogleSignin.signIn();
      console.log("userinfo "+JSON.stringify(userInfo))
      this.setState({ userInfo,isLoggedIn:true ,name:userInfo.name,photoUrl:userInfo.photo});
      console.log("username"+ userInfo.name)
      console.log("useremail"+ userInfo.email)
      console.log("userimage"+userInfo.photo)
    } catch (error) {
      console.log("error "+error)
      console.log("statusCodes "+JSON.stringify(statusCodes))
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (f.e. sign in) is in p"rogress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  }
  componentDidMount(){
    GoogleSignin.configure({
      iosClientId: '<FROM DEVELOPER CONSOLE>', // only for iOS
    });
    
    getCurrentUser = async () => {
      try {
        const userInfo = await GoogleSignin.signInSilently();
        this.setState({ userInfo });
      } catch (error) {
        console.error(error);
      }
    }
  }
  signOut = async () => {
    try {
      await GoogleSignin.signOut();
      this.setState({ userInfo: null }); // Remember to remove the user from your app's state as well
       } catch (error) {
      console.error(error);
    }
} 

  render() {
    return (
      <View>
      <GoogleSigninButton
        style={{ width: 192, height: 48 }}
        size={GoogleSigninButton.Size.Icon}
        color={GoogleSigninButton.Color.Dark}
        onPress={this.signIn}/>
        {this.state.isLoggedIn ?  <Text>{this.state.name}</Text> : <Text>Please login</Text>}
      <Text onPress={this.signOut}>LOGOUT </Text>
      <Image
          style={{width: 50, height: 50}}
          source={{uri:this.state.photoUrl}}
        />
    </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  header: {
    fontSize: 25
  },
  image: {
    marginTop: 15,
    width: 150,
    height: 150,
    borderColor: "rgba(0,0,0,0.2)",
    borderWidth: 3,
    borderRadius: 150
  }
})