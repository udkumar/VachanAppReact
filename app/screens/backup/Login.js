import React, {Component} from 'react';
import { StyleSheet, ActivityIndicator, View, Text, Alert,TextInput,TouchableOpacity,Button,BackHandler} from 'react-native';
import firebase from 'react-native-firebase'
import {userInfo} from '../../store/action/'
import {connect} from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

 class Login extends Component {
    // static navigationOptions = {
    //     header: null,
    //     };
    constructor(props){
        super(props)
        this.state = {
            email:'',
            password:'',
            isLoading:false,
            passwordVisible:true
        }
    }
    updateInputVal = (val, prop) => {
      const state = this.state;
      state[prop] = val;
      this.setState(state);
    }

    login = async() => {
      if(this.state.email === '' && this.state.password === '') {
        Alert.alert('Enter details to signin!')
      } else {
        this.setState({
          isLoading: true,
        })
        firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then((res) => {
          console.log(res)
          console.log('User logged-in successfully!')
          this.props.userInfo({email:res.user._user.email,uid:res.user._user.uid,
          userName:res.user._user.displayName,phoneNumber:null})
          // this.props.navigation.navigate('Bible')
          this.setState({
            isLoading: false,
            email: '', 
            password: ''
          })
          this.props.navigation.navigate('Dashboard')
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
          <Button
            color="#3E4095"
            title="Signin"
            onPress={() => this.login()}
          />   
          <Text 
            style={styles.loginText}
            onPress={() => this.props.navigation.navigate('Reset')}>
            Reset password
          </Text>  
          <Text 
            style={styles.loginText}
            onPress={() => this.props.navigation.navigate('Register')}>
            Don't have account? Click here to signup
          </Text>                          
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
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: 35,
    backgroundColor: '#fff'
  },
  passwordView:{
    flexDirection:'row',
    alignItems:"center",
    justifyContent:'center',
    marginBottom: 15,
    paddingBottom: 15,
    marginHorizontal:10
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


