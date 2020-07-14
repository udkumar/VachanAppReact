import React, { Component } from 'react';
import  {AppNavigator} from './app/routes/';
import {NetInfo} from 'react-native'
import AsyncStorageUtil from './app/utils/AsyncStorageUtil';
import {nightColors, dayColors} from './app/utils/colors.js'
import {extraSmallFont,smallFont,mediumFont,largeFont,extraLargeFont} from './app/utils/dimens.js'
import { styleFile } from './app/utils/styles.js'
import {AsyncStorageConstants} from './app/utils/AsyncStorageConstants'
import SplashScreen from 'react-native-splash-screen'
import {connect} from 'react-redux'
import { Root } from "native-base";
import {fetchAllContent,fetchVersionBooks} from './app/store/action/'
// import isSignedIn from './app/routes/auth'

class App extends Component {
    constructor(props){
        super(props)
        this.state = {
          isloading:false,
          signedIn: false,
          checkedSignIn: false
        }
      }
    async componentDidMount(){
       var email = await AsyncStorageUtil.getItem(AsyncStorageConstants.Keys.BackupRestoreEmail, "")
       this.setState({email})          
   
      setTimeout(() => {  
         SplashScreen.hide()
      }, 400)
      this.props.fetchAllContent()
        SplashScreen.hide()
    }

    render() {
      return (
      <Root>
        <AppNavigator/>
      </Root>
      )
         
    }
  }
  const mapStateToProps = state =>{
    return{
      language: state.updateVersion.language,
      languageCode:state.updateVersion.languageCode,
      versionCode:state.updateVersion.versionCode,
      sourceId:state.updateVersion.sourceId,
      downloaded:state.updateVersion.downloaded,
      contentType:state.updateVersion.parallelContentType,
    }
  }  

const mapDispatchToProps = dispatch =>{
  return {
    fetchAllContent:()=>dispatch(fetchAllContent()),
    fetchVersionBooks:(payload)=>dispatch(fetchVersionBooks(payload)),

  }
}

export default connect(mapStateToProps,mapDispatchToProps)(App)