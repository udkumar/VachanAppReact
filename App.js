import React, { Component } from 'react';
import  {AppNavigator}  from './app/routes/';

import AsyncStorageUtil from './app/utils/AsyncStorageUtil';
import {nightColors, dayColors} from './app/utils/colors.js'
import {extraSmallFont,smallFont,mediumFont,largeFont,extraLargeFont} from './app/utils/dimens.js'
import { styleFile } from './app/utils/styles.js'
import {AsyncStorageConstants} from './app/utils/AsyncStorageConstants'



export default class App extends Component {
    constructor(props){
        super(props)
        this.state = {
            booksList: [],
            sourceId:AsyncStorageConstants.Values.DefSourceId,
            downloaded:AsyncStorageConstants.Values.DefDownloaded,
            isDbLoading: true,
            languageCode: AsyncStorageConstants.Values.DefLanguageCode,
            versionCode: AsyncStorageConstants.Values.DefVersionCode,
    
            languageName:AsyncStorageConstants.Values.DefLanguageName,
            versionName:AsyncStorageConstants.Values.DefVersionName,
            colorMode: AsyncStorageConstants.Values.DayMode,
            bookId:AsyncStorageConstants.Values.DefBookId,
            bookName:AsyncStorageConstants.Values.DefBookName,
            chapterNumber:AsyncStorageConstants.Values.DefBookChapter,
            bookNumber:AsyncStorageConstants.Values.DefBookNumber,
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
          AsyncStorageConstants.Keys.BookId,
          AsyncStorageConstants.Keys.BookName,
          AsyncStorageConstants.Keys.ChapterNumber,
          AsyncStorageConstants.Keys.BookNumber,
          AsyncStorageConstants.Keys.SourceId,
          AsyncStorageConstants.Keys.Downloaded
    
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
          bookId: res[8][1] == null ? AsyncStorageConstants.Values.DefBookId:res[8][1],
          bookName: res[9][1] == null ? AsyncStorageConstants.Values.DefBookName:res[9][1],
          chapterNumber: res[10][1] == null ? AsyncStorageConstants.Values.DefBookChapter:parseInt(res[10][1]),
          bookNumber: res[11][1] == null ? AsyncStorageConstants.Values.DefBookNumber:parseInt(res[11][1]),
          sourceId:res[12][1] == null ? AsyncStorageConstants.Values.DefSourceId:parseInt(res[12][1]),
          downloaded:res[13][1] == null ? AsyncStorageConstants.Values.DefSourceId:res[13][1].toString()
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
    
      }
    render() {
        return <AppNavigator 
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
          bookNumber:this.state.bookNumber,
          lastRead:this.state.lastRead,
          userFoto:this.state.userFoto,
          isConnected:this.state.isConnected,
          sourceId:this.state.sourceId,
          downloaded:this.state.downloaded,

          updateColor: this.updateColor,
          updateSize: this.updateSize,
          updateVerseInLine:this.updateVerseInLine,
          changeSizeByOne: this.changeSizeByOne,
          updateLastRead: this.updateLastRead,
          updateLanguage: this.updateLanguage,
          updateUserInfo: this.updateUserInfo,
        }}
        />;
    }
}

