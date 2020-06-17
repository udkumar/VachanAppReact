import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity
} from 'react-native';
import {connect} from 'react-redux'
import {Card,CardItem} from 'native-base'
import {userInfo} from '../../store/action/'
import Login from './Login'
import firebase from 'react-native-firebase'

  class ProfilePage extends Component {
    constructor(props){
        super(props)
        this.unsubscriber = null
        this.state = {
          initializing:true,
          user:this.props.email,
          imageUrl:this.props.photo,
          userData:'',
          isLoading:false
        }
      }
    async componentDidMount(){
        if (this.state.initializing){
          this.setState({initializing:false})}
        this.unsubscriber  = firebase.auth().onAuthStateChanged((user)=>{
          if (!user) {
              return
            // this.props.navigation.navigate('Login')
          }
          else{
            console.log(" USER AUTH STATE CHANGED  ",user._user)
            this.setState({user:user._user.email,userData:user,isLoading:false,imageUrl:user._user.photoURL})
            this.props.userInfo({email:user._user.email,uid:user._user.uid,
            userName:user._user.displayName,phoneNumber:null,photo:user._user.photoURL})
            this.setState({isLoading:true})

          }
        })  
    }
    componentWillUnmount(){
        if(this.unsubscriber) {
            this.unsubscriber();
          }  
    }
    logOut=()=>{
        firebase.auth().signOut()
        this.props.userInfo({email:null,uid:null,userName:'',phoneNumber:null,photo:null})
        this.setState({user:null})
        // DbQueries.deleteBookmark()
    }
  render() {
    console.log(" user photot ",this.props.photo)
    if(!this.state.user){
        return <Login navigation={this.props.navigation} user={this.state.user}/>
    }
    return (
      <View style={{flex:1,backgroundColor:'#eee',margin:0}}>
          <View style={styles.container}>
          <Card>
            <CardItem>
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                <Image style={styles.avatar} source={{uri:this.props.photo !=null ? this.props.photo : 'https://bootdey.com/img/Content/avatar/avatar6.png'}}/>
                <View>
                <Text>{this.props.email}</Text>
                <Text>{this.props.userName}</Text>
                {/* <Text>{this.props.phoneNumber}</Text> */}
                </View>
                </View>
            
            </CardItem>
            </Card>
            <View></View>
            <Card>
            <CardItem header bordered>
              <Text>NativeBase</Text>
            </CardItem>
            <CardItem header bordered>
              <Text>NativeBase</Text>
            </CardItem>
            <CardItem header bordered>
              <Text>NativeBase</Text>
            </CardItem>
            <CardItem header bordered>
              <Text>NativeBase</Text>
            </CardItem>
            </Card>
            <Card>
            <CardItem header bordered style={{justifyContent:'center',alignItems:'center'}}>
            <TouchableOpacity 
            onPress={this.logOut} 
            style={{justifyContent:'center',alignItems:'center'}}
            // style={styles.buttonContainer}
            >
                <Text>LOG OUT</Text>  
            </TouchableOpacity>          
            </CardItem>
            </Card>
          </View>
         
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header:{
    backgroundColor: "#00BFFF",
    height:200,
  },
  container:{
    // marginHorizontal:12,
    // backgroundColor:"#eee"
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom:10,
    alignSelf:'center',
    // position: 'absolute',
    // marginTop:130
  },
  name:{
    fontSize:22,
    color:"#FFFFFF",
    fontWeight:'600',
  },
  body:{
    marginTop:40,
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding:30,
  },
  name:{
    fontSize:28,
    color: "#696969",
    fontWeight: "600"
  },
  info:{
    fontSize:16,
    color: "#00BFFF",
    marginTop:10
  },
  description:{
    fontSize:16,
    color: "#696969",
    marginTop:10,
    textAlign: 'center'
  },
  buttonContainer: {
    marginTop:10,
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:250,
    borderRadius:30,
    backgroundColor: "#00BFFF",
  },
});

const mapStateToProps = state =>{
    return{
        email:state.userInfo.email,
        uid:state.userInfo.uid,
        photo:state.userInfo.photo,
        userName:state.userInfo.userName
    }
  }
  const mapDispatchToProps = dispatch =>{
    return {
     userInfo:(payload)=>dispatch(userInfo(payload))
    }
  }
  
export  default connect(mapStateToProps,mapDispatchToProps)(ProfilePage)
  