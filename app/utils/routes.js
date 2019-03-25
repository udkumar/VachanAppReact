// all of our routes
import React, { Component } from 'react'
import {TouchableOpacity,View,Text} from 'react-native'
import {StackNavigator, DrawerNavigator,DrawerItems,DrawerActions,NavigationActions} from 'react-navigation'
import Icon from 'react-native-vector-icons/MaterialIcons'
import SelectBook from '../screens/SelectBook/SelectBook'
import About from '../screens/About/About'
import Bookmarks from '../screens/Bookmarks/Bookmarks'
import Highlights from '../screens/Highlights/Highlights'
import History from '../screens/History/History'
import Notes from '../screens/Note/Notes'
import EditNote from '../screens/Note/EditNote'
import Search from '../screens/Search/Search'
import Settings from '../screens/settings/Settings'
import Googlesign from '../screens/Googlesign'
import Splash from '../screens/Splash/Splash'
import ReferenceSelection from '../screens/numberSelection/ReferenceSelection'
import ChapterSelection from '../screens/numberSelection/ChapterSelection'
import Hints from '../screens/Hints/Hints'
import Language from '../screens/Language/Language'
import DownloadLanguage from '../screens/Downloads/DownloadLanguage'
import DownloadVersion from '../screens/Downloads/DownloadVersion'
import BackupRestore from '../screens/backup/BackupRestore'
import DrawerScreen from '../screens/DrawerScreen/DrawerScreen'
import  Bible from '../screens/Bible'
import languagelist from '../screens/LanguagesList'
import VersionList from'../screens/Versionlist'
const AsyncStorageConstants = require('./AsyncStorageConstants')
import AsyncStorageUtil from './AsyncStorageUtil';
import {nightColors, dayColors, constColors} from './colors.js'
import {extraSmallFont,smallFont,mediumFont,largeFont,extraLargeFont} from './dimens.js'
import { styleFile } from './styles.js'
import DbQueries from '../utils/dbQueries'
import Realm from 'realm'

import SignupWithGoogle from '../screens/SignupWithGoogle'
import Signin from '../screens/SignIn'
import Video from '../screens/Video'
import Audio from '../screens/Audio'
import BottomTab from '../screens/Bible/BottomTab'
import GoogleMaps from  '../screens/GoogleMaps'
import Images from '../screens/Images'

const DrawerNavigate = (styles) => DrawerNavigator({
  // Signin:{
  //   screen:Signin
  //   },
    
  // Signup:{
  //   screen:Signup
    
  // },
  StackNavigate:{
    screen: StackNavigate
  },

},
{
  // initialRouteName: 'Bible',
  contentComponent:DrawerScreen,
  drawerWidth: 250
},
);

const MenuIcon = (navigation) => {
      console.log("navigation of drawer "+JSON.stringify(navigation))
      return (
          <Icon 
            name="dehaze"  
            color="#fff"
            onPress={() => {navigation.navigate('DrawerToggle'),console.log("menu on press")}}
            style={{marginHorizontal:8,fontSize:20}}
          />
      );
    // return <Icon name="keyboard-arrow-lefte"  Size={38}/>
   
}

const StackNavigate = StackNavigator(
  {  
      // Splash: {
      //   screen: Splash,
      // },
      // Signin:{
      //   screen:Signin
      //   },
     
      Bible:{
        screen:Bible,
        navigationOptions: ({ navigation }) => ({
          // title: null,  // Title to appear in status bar
          // header:null,
          headerLeft :<MenuIcon navigate={navigation.navigate}/>,
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          
           
        })
      },
      SelectBook: {
        screen: SelectBook,
        navigationOptions: {
          headerTitle:"Select Book"
      }
      },
      About: {
        screen: About,
      },
      Bookmarks: {
        screen: Bookmarks,
      },
      EditNote: {
        screen: EditNote,
      },
      Highlights: {
        screen: Highlights,
      },
      History: {
        screen: History,
      },
      Notes: {
        screen: Notes,
      },  
      Settings: {
        screen: Settings,
      },
      ChapterSelection: {
        screen: ChapterSelection,
        navigationOptions: {
            headerTitle:"Select Chapter"
        }
      },
      ReferenceSelection: {
        screen: ReferenceSelection,
      },
      Hints: {
        screen: Hints,
      },
      Language:{
        screen:Language
      },
      DownloadLanguage: {
        screen: DownloadLanguage
      },
      DownloadVersion: {
        screen: DownloadVersion
      },
      Search: {
        screen: Search,
      },
      BackupRestore: {
        screen: BackupRestore
      },
      Audio:{
        screen:Audio
      },
      Video:{
        screen:Video
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
      // SignupWithGoogle:{
      //   screen:SignupWithGoogle
      //     },
      // Googlesign:{
      //   screen:Googlesign
      // }
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
    Realm.copyBundledRealmFiles();
      
    this.state = {
        chapterModels:[],
        //having bookname, bookid ,section,booknumber,bookSection,versioncode,languagecode,number of chapters
        booksList: [],
        //initial render when app open show loader from routes page on bible page 
        isDbLoading: true,
        //language selected async storage 
        languageCode: AsyncStorageConstants.Values.DefLanguageCode,
        versionCode: AsyncStorageConstants.Values.DefVersionCode,

        languageName:AsyncStorageConstants.Values.DefLanguageName,
        versionName:AsyncStorageConstants.Values.DefVersionName,
        colorMode: AsyncStorageConstants.Values.DayMode,
        bookId:AsyncStorageConstants.Values.DefBookId,
        bookName:AsyncStorageConstants.Values.DefBookName,
        chapterNumber:AsyncStorageConstants.Values.DefBookChapter,
        sizeMode: AsyncStorageConstants.Values.SizeModeNormal,
        colorFile:dayColors,
        sizeFile:mediumFont,
        verseInLine:false,
        lastRead:{}
    }
    //update booklist for showing book on selectBook screen
    this.updateBookList = this.updateBookList.bind(this)
    //update size of text on changing seekbar in settings page 
    this.updateSize = this.updateSize.bind(this)
    //update color for night and day mode 
    this.updateColor = this.updateColor.bind(this)
    //update verse in line for showing verse in line or paragraph settings page 
    this.updateVerseInLine = this.updateVerseInLine.bind(this)
    //update size of text on gesture change on pinch screen in bible page 
    this.changeSizeByOne = this.changeSizeByOne.bind(this)
    //update last read for last read page which is bible page 
    this.updateLastRead = this.updateLastRead.bind(this)
    //update language on language change from language change ot read another language page
    this.updateLanguage  = this.updateLanguage.bind(this)
    //update book data for current reading chapter book id and book name form selected langauge and version from download version or language page 
    this.updateBookData  = this.updateBookData.bind(this)

    this.updateChapterData = this.updateChapterData.bind(this)

    this.styles = styleFile(this.state.colorFile,this.state.sizeFile)
    this.DrawerNavigate = DrawerNavigate(this.styles)
    console.log("ALL HEADER COLOR /////// "+JSON.stringify(this.styles))
  }

  updateBookList = (booksList) => {
    this.setState({booksList})
  }

  updateChapterData = (chapterModels) =>{
    this.setState({chapterModels})
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
  updateBookData = (bookId,bookName,chapterNumber) =>{
    this.setState({bookId,bookName,chapterNumber})
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

  updateLanguage = async(languageCode,languageName,versionCode,versionName) =>{
    // console.log("in ROTES update language")
    this.setState({languageCode, languageName,versionCode,versionName})

    let models = await DbQueries.queryBookIdModels(versionCode, languageCode)
      console.log("ROUTES LENGTH =" + JSON.stringify(models))
      if (models && models.length > 0) {
        this.setState({booksList: models})
      }

  }
 

  render(){
    // console.log("bookList "+JSON.stringify(this.state.booksList[0].bookId))
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
          bookId:this.state.bookId,
          bookName:this.state.bookName,
          chapterNumber:this.state.chapterNumber,
          lastRead:this.state.lastRead,
          userFoto:this.state.userFoto,

          updateColor: this.updateColor,
          updateSize: this.updateSize,
          updateVerseInLine:this.updateVerseInLine,
          updateBookList: this.updateBookList,
          changeSizeByOne: this.changeSizeByOne,
          updateLastRead: this.updateLastRead,
          updateLanguage: this.updateLanguage,
          updateBookData: this.updateBookData,
          updateUserInfo: this.updateUserInfo

        }}
      />
    );
  }

    
  async componentDidMount(){

    let res = await AsyncStorageUtil.getAllItems([
      AsyncStorageConstants.Keys.ColorMode, 
      AsyncStorageConstants.Keys.SizeMode,
      AsyncStorageConstants.Keys.VerseViewMode,
      // AsyncStorageConstants.Keys.LastReadReference,
      AsyncStorageConstants.Keys.LanguageCode,
      AsyncStorageConstants.Keys.VersionCode,
      AsyncStorageConstants.Keys.LanguageName,
      AsyncStorageConstants.Keys.VersionName,
      AsyncStorageConstants.Keys.BookId,
      AsyncStorageConstants.Keys.BookName,
      AsyncStorageConstants.Keys.ChapterNumber

    ])
    
    if (res == null) {
      return
    }+

    console.log("ROUTES.... color mode "+res[0][1])
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

    this.setState({
      colorMode: res[0][1]== null ? AsyncStorageConstants.Values.DayMode : parseInt(res[0][1]),
      colorFile: res[0][1] == null ? dayColors : 
        (parseInt(res[0][1]) == AsyncStorageConstants.Values.DayMode ? dayColors : nightColors),
      verseInLine:  res[2][1] == null ? AsyncStorageConstants.Values.VerseInLine : res[2][1],
      languageCode: res[3][1] == null ? AsyncStorageConstants.Values.DefLanguageCode : res[3][1],
      versionCode:  res[4][1] == null ? AsyncStorageConstants.Values.DefVersionCode : res[4][1],
      languageName: res[5][1] == null ? AsyncStorageConstants.Values.DefLanguageName : res[5][1],
      versionName:  res[6][1] == null ? AsyncStorageConstants.Values.DefVersionName : res[6][1],
      bookId: res[7][1] == null ? AsyncStorageConstants.Values.DefBookId:res[7][1],
      bookName: res[8][1] == null ? AsyncStorageConstants.Values.DefBookName:res[8][1],
      chapterNumber: res[8][1] == null ? AsyncStorageConstants.Values.DefBookChapter:parseInt(res[9][1])
    }, async ()=> {
      // let models = await DbQueries.queryBookIdModels(this.state.versionCode, this.state.languageCode);
      // this.setState({isDbLoading: false})
      // if (models && models.length > 0) {
      //   this.setState({booksList: models,bookId:models[0].bookId,bookName:models[0].bookName})
      // }
    })
    await AsyncStorageUtil.getItem(AsyncStorageConstants.Keys.LastReadReference, AsyncStorageConstants.Values.LastReadReference
      ).then((lastRead) => {
          this.setState({lastRead})
    })

    console.log("DSIDI mount value "+typeof this.state.sizeMode)
  }
  

}