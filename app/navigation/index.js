import React, { Component } from "react"
import DrawerNav from "./DrawerNav"
const AsyncStorageConstants = require('../utils/AsyncStorageConstants')
import AsyncStorageUtil from '../utils/AsyncStorageUtil'
import {nightColors, dayColors, constColors} from '../utils/colors.js'
import {extraSmallFont,smallFont,mediumFont,largeFont,extraLargeFont} from '../utils/dimens.js'
import { styleFile } from '../utils/styles.js'
import DbQueries from '../utils/dbQueries'
import Realm from 'realm'


export default class App extends Component {
    constructor(props){
        super(props)
        Realm.copyBundledRealmFiles();
          
        this.state = {
            booksList: [],
            isDbLoading: true,
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
    
        this.updateBooks = this.updateBooks.bind(this)
        this.updateSize = this.updateSize.bind(this)
        this.updateColor = this.updateColor.bind(this)
        this.updateVerseInLine = this.updateVerseInLine.bind(this)
        this.changeSizeByOne = this.changeSizeByOne.bind(this)
        this.updateLastRead = this.updateLastRead.bind(this)
        this.updateLanguage  = this.updateLanguage.bind(this)
        this.updateBookData  = this.updateBookData.bind(this)
    
        this.styles = styleFile(this.state.colorFile,this.state.sizeFile)
        // this.DrawerNavigate = DrawerNavigate(this.styles)
        console.log("ALL HEADER COLOR /////// "+JSON.stringify(this.styles))
      }
    
      updateBooks = (booksList) => {
        this.setState({booksList})
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
    
        let models = await DbQueries.queryBookIdModels(versionCode, languageCode);
          // console.log("routes len =" + JSON.stringify(models))
          if (models && models.length > 0) {
            this.setState({booksList: models})
          }
    
      }
	render() {
		return <DrawerNav
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
  
            updateColor: this.updateColor,
            updateSize: this.updateSize,
            updateVerseInLine:this.updateVerseInLine,
            updateBooks: this.updateBooks,
            changeSizeByOne: this.changeSizeByOne,
            updateLastRead: this.updateLastRead,
            updateLanguage: this.updateLanguage,
            updateBookData: this.updateBookData
          }}
        />
	}
}