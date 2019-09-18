// all of our routes
import React, { Component } from 'react'
import {StackNavigator, DrawerNavigator,} from 'react-navigation'
import Icon from 'react-native-vector-icons/MaterialIcons'

import About from '../screens/About/About'
import Search from '../screens/Search/Search'
import Settings from '../screens/settings/Settings'
import Account from '../screens/Account'
import ReferenceSelection from '../screens/numberSelection/ReferenceSelection'
// import ChapterSelection from '../screens/numberSelection/ChapterSelection'
import Hints from '../screens/Hints/Hints'
import BackupRestore from '../screens/backup/BackupRestore'
import DrawerScreen from '../screens/DrawerScreen/DrawerScreen'
import  Bible from '../screens/Bible'
import BottomTab from '../screens/Bible/BottomTab'
import GoogleMaps from  '../screens/GoogleMaps'
import Images from '../screens/Images'
import LanguageList from '../screens/LanguageList' 
import ModalForChapter from '../screens/Bible/component/ModalForChapter'

import SelectionTab from '../screens/SelectionTab'

import AsyncStorageUtil from './AsyncStorageUtil';
import {nightColors, dayColors} from './colors.js'
import {extraSmallFont,smallFont,mediumFont,largeFont,extraLargeFont} from './dimens.js'
import { styleFile } from './styles.js'
import {AsyncStorageConstants} from './AsyncStorageConstants'


const DrawerNavigate = (styles) => DrawerNavigator({
 
  StackNavigate:{
    screen: StackNavigate
  },

},
{
  contentComponent:DrawerScreen,
  drawerWidth: 250
},
);

const MenuIcon = (navigation) => {
      return (
          <Icon 
            name="dehaze"  
            color="#fff"
            onPress={() => {navigation.navigate('DrawerToggle')}}
            style={{marginHorizontal:8,fontSize:20}}
          />
      );
   
}

const StackNavigate = StackNavigator(

  {  
    // ModalForChapter:{
    //   screen:ModalForChapter,
    // },
    // LanguageList:{
    //   screen:LanguageList
    // },
      Bible:{
        screen:Bible,
        navigationOptions: ({ navigation }) => ({
          headerStyle: {
            // elevation: 0,
            // shadowOpacity: 0,
            // height: 40,
            backgroundColor:"#3F51B5",
            shadowColor: 'black',
            shadowRadius: 5,
            shadowOpacity: 0.1,
            shadowOffset: {
              height: 3,
              width: 0,
            },
          },
          headerLeft :<MenuIcon navigate={navigation.navigate}/>,
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
           
        })
      },
  
      About: {
        screen: About,
      },
    
      Settings: {
        screen: Settings,
      },
      ReferenceSelection: {
        screen: ReferenceSelection,
      },
      Hints: {
        screen: Hints,
      },
      Search: {
        screen: Search,
      },
      BackupRestore: {
        screen: BackupRestore
      },
      BottomTab:{
        screen:BottomTab
      },
      GoogleMaps:{
        screen:GoogleMaps
      },
      Images:{
        screen:Images
      },
      LanguageList:{
        screen:LanguageList
      },
      Account:{
        screen:Account
      },
      SelectionTab:{
        screen:SelectionTab,
        navigationOptions: {
                headerTitle:"Select Chapter"
            }

      }
     
  },
  
  {
    navigationOptions: ({ navigation }) => ({
      headerTintColor: '#fff',
      headerStyle:{
        backgroundColor:"#3F51B5"
      },
      headerTitleStyle: {
        fontWeight: 'normal',

      },
    
    })
  }
  

)

export default class App extends Component {

  constructor(props){
    super(props)
    // Realm.copyBundledRealmFiles();
      
    this.state = {
        booksList: [],
        // sourceId:AsyncStorageConstants.Values.DefSourceId,
        isDbLoading: true,
        languageCode: AsyncStorageConstants.Values.DefLanguageCode,
        versionCode: AsyncStorageConstants.Values.DefVersionCode,

        // languageName:AsyncStorageConstants.Values.DefLanguageName,
        // versionName:AsyncStorageConstants.Values.DefVersionName,
        colorMode: AsyncStorageConstants.Values.DayMode,
        // bookId:AsyncStorageConstants.Values.DefBookId,
        // bookName:AsyncStorageConstants.Values.DefBookName,
        // chapterNumber:AsyncStorageConstants.Values.DefBookChapter,
        // bookNumber:AsyncStorageConstants.Values.DefBookNumber,
        sizeMode: AsyncStorageConstants.Values.SizeModeNormal,
        colorFile:dayColors,
        sizeFile:mediumFont,
        verseInLine:false,
        lastRead:{},
        isConnected:true
    }
    this.updateSize = this.updateSize.bind(this)
    this.updateColor = this.updateColor.bind(this)
    this.updateVerseInLine = this.updateVerseInLine.bind(this)
    this.changeSizeByOne = this.changeSizeByOne.bind(this)
    this.updateLastRead = this.updateLastRead.bind(this)

    this.styles = styleFile(this.state.colorFile,this.state.sizeFile)
    this.DrawerNavigate = DrawerNavigate(this.styles)
  }

  updateVerseInLine = (verseInLine) =>{
    this.setState({verseInLine})
  }

  updateLastRead = (lastRead) => {
    this.setState({lastRead})
  }

  updateColor = (colorMode, colorFile) => {
    this.setState({colorMode, colorFile})
	}
	
  updateSize = (sizeMode, sizeFile) => {
    this.setState({sizeMode, sizeFile})
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

  updateLanguage = async(languageCode,languageName,versionCode,versionName) => {
    // console.log("in ROTES update language"+languageCode+" "+languageName+" "+versionCode+" "+versionName)
    this.setState({languageCode, languageName,versionCode,versionName})
  }

  handleFirstConnectivityChange = (isConnected)=> {
    // console.log("is connected in routes "+isConnected)
    if (isConnected == true) {
      this.setState({
        isConnected: true
      });
    } else {
      this.setState({
        isConnected: false
      });
      alert("Connection Fail")
    }
  }
   

  async componentDidMount(){

    let res = await AsyncStorageUtil.getAllItems([
      AsyncStorageConstants.Keys.ColorMode, 
      AsyncStorageConstants.Keys.SizeMode,
      AsyncStorageConstants.Keys.VerseViewMode,
      AsyncStorageConstants.Keys.LastReadReference,
      AsyncStorageConstants.Keys.LanguageCode,
      AsyncStorageConstants.Keys.VersionCode,
      AsyncStorageConstants.Keys.LanguageName,
      AsyncStorageConstants.Keys.VersionName,
      // AsyncStorageConstants.Keys.BookId,
      // AsyncStorageConstants.Keys.BookName,
      // AsyncStorageConstants.Keys.ChapterNumber,
      // AsyncStorageConstants.Keys.BookNumber,
      // AsyncStorageConstants.Keys.sourceId,

    ])
    // console.log("GET ALL ITEM ",res)
    // console.log("res of asynstorage value ",res)
    this.setState({
      colorMode: res[0][1]== null ? AsyncStorageConstants.Values.DayMode : parseInt(res[0][1]),
      colorFile: res[0][1] == null ? dayColors : (parseInt(res[0][1]) == AsyncStorageConstants.Values.DayMode ? dayColors : nightColors),
      verseInLine:  res[3][1] == null ? AsyncStorageConstants.Values.VerseInLine : res[3][1],
      languageCode: res[4][1] == null ? AsyncStorageConstants.Values.DefLanguageCode : res[4][1],
      versionCode:  res[5][1] == null ? AsyncStorageConstants.Values.DefVersionCode : res[5][1],
      languageName: res[6][1] == null ? AsyncStorageConstants.Values.DefLanguageName : res[6][1],
      versionName:  res[7][1] == null ? AsyncStorageConstants.Values.DefVersionName : res[7][1],
      // bookId: res[8][1] == null ? AsyncStorageConstants.Values.DefBookId:res[8][1],
      // bookName: res[9][1] == null ? AsyncStorageConstants.Values.DefBookName:res[9][1],
      // chapterNumber: res[10][1] == null ? AsyncStorageConstants.Values.DefBookChapter:parseInt(res[10][1]),
      // bookNumber: res[11][1] == null ? AsyncStorageConstants.Values.DefBookNumber:parseInt(res[11][1]),
      // sourceId:res[12][1] == null ? AsyncStorageConstants.Values.DefSourceId:parseInt(res[12][1])
    })

    await AsyncStorageUtil.getItem(AsyncStorageConstants.Keys.LastReadReference, AsyncStorageConstants.Values.LastReadReference
    ).then((lastRead) => {
        this.setState({lastRead})
  })
    this.setState({sizeMode: res[1][1] == null ? AsyncStorageConstants.Values.SizeModeNormal : parseInt(res[1][1])}, ()=> {
      switch (this.state.sizeMode) {
        case  AsyncStorageConstants.Values.SizeModeXSmall : {
          this.setState({sizeFile:extraSmallFont})
          break;
        }
        case  AsyncStorageConstants.Values.SizeModeSmall : {
          this.setState({sizeFile:smallFont})
          break;
        }
        case AsyncStorageConstants.Values.SizeModeNormal : {
          this.setState({sizeFile:mediumFont})
          break;
        }
        case AsyncStorageConstants.Values.SizeModeLarge : {
          this.setState({sizeFile:largeFont})
          break;
        }
        case AsyncStorageConstants.Values.SizeModeXLarge : {
          console.log("SIZEFILEIS XLLLL...")
          this.setState({sizeFile:extraLargeFont})
          break;
        }
      }
    })

 
    // console.log("size mode ",this.state.sizeMode)
    // console.log("color mode mode ",this.state.colorMode)
    // console.log("LANGUAGE NAME ",this.state.languageName)
    // console.log("VERSION NAME",this.state.versionName)
    // console.log("VERSION CODE",this.state.versionCode)
    // console.log("BOOK ID  ",this.state.bookId)
    // console.log("BOOK NAME ",this.state.bookName)
    // console.log("BOOK NUMBER ",this.state.bookNumber)
    // console.log("CHAPTER NUMBER",this.state.chapterNumber)
    // console.log("VERSE IN LINE ",this.state.verseInLine)



  }
  
  render(){
        let  DrawerNavigate = this.DrawerNavigate
    return(
      <DrawerNavigate 
        screenProps={{
          colorMode: this.state.colorMode, 
          sizeMode: parseInt(this.state.sizeMode), 
          colorFile:this.state.colorFile,
          sizeFile:this.state.sizeFile,
          booksList: this.state.booksList, 
          isDbLoading: this.state.isDbLoading,
          verseInLine:this.state.verseInLine,
          languageCode: this.state.languageCode,
          languageName:this.state.languageName, 
          versionCode: this.state.versionCode,
          versionName:this.state.versionName,
          // bookId:this.state.bookId,
          // bookName:this.state.bookName,
          // chapterNumber:this.state.chapterNumber,
          // bookNumber:this.state.bookNumber,
          lastRead:this.state.lastRead,
          userFoto:this.state.userFoto,
          isConnected:this.state.isConnected,
          // sourceId:this.state.sourceId,

          updateColor: this.updateColor,
          updateSize: this.updateSize,
          updateVerseInLine:this.updateVerseInLine,
          changeSizeByOne: this.changeSizeByOne,
          updateLastRead: this.updateLastRead,
          updateLanguage: this.updateLanguage,
          updateUserInfo: this.updateUserInfo,
          

        }}
      />
    );
  }
}