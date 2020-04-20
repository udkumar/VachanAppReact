import React, { Component } from 'react';
import  {AppNavigator} from './app/routes/';

import AsyncStorageUtil from './app/utils/AsyncStorageUtil';
import {nightColors, dayColors} from './app/utils/colors.js'
import {extraSmallFont,smallFont,mediumFont,largeFont,extraLargeFont} from './app/utils/dimens.js'
import { styleFile } from './app/utils/styles.js'
import {AsyncStorageConstants} from './app/utils/AsyncStorageConstants'
import SplashScreen from 'react-native-splash-screen'
import {connect} from 'react-redux'
import {fetchAllContent} from './app/store/action/'
// import isSignedIn from './app/routes/auth'

class App extends Component {
    constructor(props){
        super(props)
        console.log("props value APP PAGE ",props)
        this.state = {
          isloading:false,
          signedIn: false,
          checkedSignIn: false
        }
      }
    
      changeSizeByOne = (value) => {
        switch (this.state.sizeMode) {
          case AsyncStorageConstants.Values.SizeModeXSmall : {
            if (value == -1) {
              return
            } else {
              AsyncStorageUtil.setItem(AsyncStorageConstants.Keys.SizeMode, AsyncStorageConstants.Values.SizeModeSmall);    
              this.setState({sizeFile:smallFont, sizeMode: AsyncStorageConstants.Values.SizeModeSmall})
            }
            break;
          } 
          case AsyncStorageConstants.Values.SizeModeSmall : {
            if (value == -1) {
              AsyncStorageUtil.setItem(AsyncStorageConstants.Keys.SizeMode, AsyncStorageConstants.Values.SizeModeXSmall);    
              this.setState({sizeFile:extraSmallFont, sizeMode: AsyncStorageConstants.Values.SizeModeXSmall})          
            } else {
              AsyncStorageUtil.setItem(AsyncStorageConstants.Keys.SizeMode, AsyncStorageConstants.Values.SizeModeNormal);    
              this.setState({sizeFile:mediumFont, sizeMode: AsyncStorageConstants.Values.SizeModeNormal})                    
            }
            break;
          }
          case AsyncStorageConstants.Values.SizeModeNormal : {
            if (value == -1) {
              AsyncStorageUtil.setItem(AsyncStorageConstants.Keys.SizeMode, AsyncStorageConstants.Values.SizeModeSmall);    
              this.setState({sizeFile:smallFont, sizeMode: AsyncStorageConstants.Values.SizeModeSmall})          
            } else {
              AsyncStorageUtil.setItem(AsyncStorageConstants.Keys.SizeMode, AsyncStorageConstants.Values.SizeModeLarge);    
              this.setState({sizeFile:largeFont, sizeMode: AsyncStorageConstants.Values.SizeModeLarge})                    
            }
            break;
          }
          case AsyncStorageConstants.Values.SizeModeLarge : {
            if (value == -1) {
              AsyncStorageUtil.setItem(AsyncStorageConstants.Keys.SizeMode, AsyncStorageConstants.Values.SizeModeNormal);    
              this.setState({sizeFile:mediumFont, sizeMode: AsyncStorageConstants.Values.SizeModeNormal})          
            } else {
              AsyncStorageUtil.setItem(AsyncStorageConstants.Keys.SizeMode, AsyncStorageConstants.Values.SizeModeXLarge);    
              this.setState({sizeFile:extraLargeFont, sizeMode: AsyncStorageConstants.Values.SizeModeXLarge})                    
            }
            break;
          }
          case AsyncStorageConstants.Values.SizeModeXLarge : {
            if (value == -1) {
              AsyncStorageUtil.setItem(AsyncStorageConstants.Keys.SizeMode, AsyncStorageConstants.Values.SizeModeLarge);    
              this.setState({sizeFile:largeFont, sizeMode: AsyncStorageConstants.Values.SizeModeLarge})          
            } else {
              return                   
            }
            break;
          }
        }
      }
    
    async componentDidMount(){
      // isSignedIn()
      // .then(res => {
      //   this.setState({ signedIn: res, checkedSignIn: true })
      // })
      // .catch(err => alert("An error occurred"));
      // AsyncStorage.removeItem('notiReg')
       var email = await AsyncStorageUtil.getItem(AsyncStorageConstants.Keys.BackupRestoreEmail, "")
        this.setState({email})          
    //  if (email ==='' || email !=null){
    //   return 
    //  }
      setTimeout(() => {  
         SplashScreen.hide()
      }, 800)

      this.props.fetchAllContent()
        SplashScreen.hide()
    }
    render() {
      // const Layout = AppNavigator(this.state.signedIn)
      // if (!this.state.checkedSignIn) {
      //   return null;
      // }
  
      // console.log("PROPS IN APP NAVIGATOR ",this.props)
        return <AppNavigator/>
    }
  }
const mapDispatchToProps = dispatch =>{
  return {
    fetchAllContent:()=>dispatch(fetchAllContent()),
  }
}

export default connect(null,mapDispatchToProps)(App)