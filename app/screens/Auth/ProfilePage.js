import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity
} from 'react-native';
import {connect} from 'react-redux'
import {Card,CardItem,Header,Left,Button,Body,Title} from 'native-base'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {userInfo} from '../../store/action'
// import Login from './Login'
import firebase from 'react-native-firebase'
import {styles} from './styles.js'

  class ProfilePage extends Component {
    constructor(props){
        super(props)
        this.state = {
          // user:this.props.email,
          imageUrl:this.props.photo,
          userData:'',
          isLoading:false
        }
        this.styles = styles(this.props.colorFile, this.props.sizeFile);  
      }
    // async componentDidMount(){
    //     firebase.auth().onAuthStateChanged((user)=>{
    //       if (!user) {
    //           return
    //       }
    //       else{
    //         this.setState({user:user._user.email,userData:user,isLoading:false,imageUrl:user._user.photoURL})
    //         this.props.userInfo({email:user._user.email,uid:user._user.uid,
    //         userName:user._user.displayName,phoneNumber:null,photo:user._user.photoURL})
    //         this.setState({isLoading:true})

    //       }
    //     })  
    // }
   
    // logOut=()=>{
    //     firebase.auth().signOut()
    //     this.props.userInfo({email:null,uid:null,userName:'',phoneNumber:null,photo:null})
    //     this.setState({user:null})
    //     this.props.navigation.navigate("Bible")
    //     // DbQueries.deleteBookmark()
    // }
   
  render() {
    return (
      <View style={{flex:1}}>
         <Header>
          <Left>
            <Button transparent onPress={()=>this.props.navigation.navigate("Bible")}>
              <Icon size={24} color="#fff" name='arrow-back'  />
            </Button>
          </Left>
          <Body>
            <Title>Profile</Title>
          </Body>
        </Header>
      <View style={{flex:1,backgroundColor:'#eee'}}>
          {/* <View style={this.styles.container}> */}
          <Card>
            <CardItem>
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                <Image style={this.styles.avatar} source={this.props.photo !=null  ? {uri:this.props.photo} :  require('../../assets/account1.png')}/>
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
            <CardItem header button style={[{flexDirection:'row'}]} onPress={()=>this.props.navigation.navigate('Settings')}>
                  <Icon name='settings' style={this.styles.cardItemIconCustom}/>
                  <Text style={this.styles.textStyle}>Settings</Text>
            </CardItem>
            <CardItem header button  style={{flexDirection:'row'}} onPress={()=>this.props.navigation.navigate('About')}>
                  <Icon name='info' style={this.styles.cardItemIconCustom}/>
                  <Text style={this.styles.textStyle}>About</Text>
            </CardItem>
            </Card>
            {/* <View > */}
            <Card>
            <CardItem  header button onPress={this.props.logOut} style={{alignItems:'center',justifyContent:'center'}}>
            <Text>LOG OUT</Text>  
            </CardItem>
            </Card>
            {/* </View> */}

          {/* </View> */}
      </View>
      </View>
    );
  }
}


const mapStateToProps = state =>{
    return{
        email:state.userInfo.email,
        uid:state.userInfo.uid,
        photo:state.userInfo.photo,
        userName:state.userInfo.userName,

        sizeFile:state.updateStyling.sizeFile,
        colorFile:state.updateStyling.colorFile,
    }
  }
  const mapDispatchToProps = dispatch =>{
    return {
     userInfo:(payload)=>dispatch(userInfo(payload))
    }
  }
  
export  default connect(mapStateToProps,mapDispatchToProps)(ProfilePage)
  