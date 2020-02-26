import React, { Component } from 'react';
import  {AppNavigator}  from './app/routes/';

import AsyncStorageUtil from './app/utils/AsyncStorageUtil';
import {nightColors, dayColors} from './app/utils/colors.js'
import {extraSmallFont,smallFont,mediumFont,largeFont,extraLargeFont} from './app/utils/dimens.js'
import { styleFile } from './app/utils/styles.js'
import {AsyncStorageConstants} from './app/utils/AsyncStorageConstants'
import SplashScreen from 'react-native-splash-screen'
import {connect} from 'react-redux'
import {updateColorMode,updateFontSize,updateContentType,updateVerseInLine,updateVersion,fetchAllContent, updateVersionBook} from './app/store/action/'

class App extends Component {
    constructor(props){
        super(props)
        console.log("props value APP PAGE ",props)
        this.state = {
          isloading:false
        }
        // this.AppNavigator = AppNavigator(this.props)
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
        let res = await AsyncStorageUtil.getAllItems([
          AsyncStorageConstants.Keys.ColorMode, 
          AsyncStorageConstants.Keys.SizeMode,
          AsyncStorageConstants.Keys.VerseViewMode,
          AsyncStorageConstants.Keys.LastReadReference,
          AsyncStorageConstants.Keys.LanguageName,
          AsyncStorageConstants.Keys.LanguageCode,
          AsyncStorageConstants.Keys.VersionCode,
          AsyncStorageConstants.Keys.BookId,
          AsyncStorageConstants.Keys.BookName,
          AsyncStorageConstants.Keys.ChapterNumber,
          AsyncStorageConstants.Keys.BookNumber,
          AsyncStorageConstants.Keys.SourceId,
          AsyncStorageConstants.Keys.Downloaded,
          AsyncStorageConstants.Keys.TotalChapters,
          AsyncStorageConstants.Keys.TotalVerses,
          AsyncStorageConstants.Keys.VerseNumber
        ])
        
          console.log(" RES OF ASYNC VALUE",res)
          const  colorMode= res[0][1]== null ? AsyncStorageConstants.Values.DayMode : parseInt(res[0][1])
          const  sizeMode= res[1][1] == null ? AsyncStorageConstants.Values.SizeModeNormal : parseInt(res[1][1])
          const  verseInLine=  res[3][1] == null ? AsyncStorageConstants.Values.VerseInLine : res[3][1]
          const  languageName= res[4][1] == null ? this.props.language : res[4][1]
          const  languageCode= res[5][1] == null ? this.props.languageCode : res[5][1]
          const  versionCode= res[6][1] == null ? this.props.versionCode : res[6][1]
          const  bookId= res[7][1] == null ? this.props.bookId:res[7][1]
          const  bookName= res[8][1] == null ? this.props.bookName:res[8][1]
          const  chapterNumber= res[9][1] == null ? this.props.chapterNumber:parseInt(res[9][1])
          // const  bookNumber= res[11][1] == null ? AsyncStorageConstants.Values.DefBookNumber:parseInt(res[11][1])
          const  sourceId= res[11][1] == null ? this.props.sourceId : parseInt(res[11][1])
          const  downloaded = res[12][1] == null ? this.props.downloaded : res[12][1].toString()
          const totalChapters = res[13][1] == null ? this.props.totalChapters : parseInt(res[13][1])
          const totalVerses = res[14][1] == null ? this.props.totalVerses : parseInt(res[14][1])
          const verseNumber = res[15][1] == null ? this.props.verseNumber : parseInt(res[15][1])
          
          this.props.updateVersion({language:languageName,languageCode:languageCode,
            versionCode:versionCode,sourceId:sourceId,downloaded:downloaded,
            
          })
          this.props.updateVersionBook({
            bookId:bookId,bookName:bookName,
            bookName:bookName,
            chapterNumber:chapterNumber,
            totalChapters:totalChapters,
            totalVerses:totalVerses,
            verseNumber:verseNumber
          })
          this.props.updateColorMode(colorMode)
          this.props.updateVerseInLine(verseInLine)
          this.props.updateFontSize(sizeMode)
          this.props.fetchAllContent()
          // this.props.fetchAllLanguage()
          SplashScreen.hide()

      //   await AsyncStorageUtil.getItem(AsyncStorageConstants.Keys.LastReadReference, AsyncStorageConstants.Values.LastReadReference
      //   ).then((lastRead) => {
      //       this.setState({lastRead})
      // })

    }
    // componentDidUpdate(prevProps){
    //   console.log("prevProps",prevProps)
    // }
    render() {
        return <AppNavigator  />
    }
}
const mapStateToProps = state =>{
  return{
    language: state.updateVersion.language,
    languageCode:state.updateVersion.languageCode,
    versionCode:state.updateVersion.versionCode,
    sourceId:state.updateVersion.sourceId,
    downloaded:state.updateVersion.downloaded,
    contentType:state.updateVersion.contentType,


    chapterNumber:state.updateVersion.chapterNumber,
    totalChapters:state.updateVersion.totalChapters,
    totalVerses:state.updateVersion.totalVerses,
    verseNumber:state.updateVersion.verseNumber,
    bookName:state.updateVersion.bookName,
    bookId:state.updateVersion.bookId,
    fontFamily:state.updateStyling.fontFamily,

    sizeFile:state.updateStyling.sizeFile,
    colorFile:state.updateStyling.colorFile,
    close:state.updateSplitScreen.close,
    
  }
}
const mapDispatchToProps = dispatch =>{
  return {
    updateVersion: (payload)=>dispatch(updateVersion(payload)),
    updateVersionBook: (payload)=>dispatch(updateVersionBook(payload)),

    updateColorMode:(colorMode)=>dispatch(updateColorMode(colorMode)),
    updateFontSize:(sizeMode)=>dispatch(updateFontSize(sizeMode)),
    updateVerseInLine:(val)=>dispatch(updateVerseInLine(val)),
    updateContentType:(val)=>dispatch(updateContentType(val)),
    fetchAllContent:()=>dispatch(fetchAllContent()),
    
    // fetchAllLanguage:()=>dispatch(fetchAllLanguage())
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(App)
