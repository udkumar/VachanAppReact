import React, { Component } from 'react';
import { getBookChaptersFromMapping, getBookNameFromMapping } from '../../utils/UtilFunctions';
import {SelectionTab} from './routes/'

export default class ReferenceSelection extends Component {

    constructor(props){
        super(props)
        this.state = {
            bookId:this.props.navigation.state.params.bookId,
            chapterNumber:this.props.navigation.state.params.chapterNumber,
            totalChapters:this.props.navigation.state.params.totalChapters,
            totalVerses:this.props.navigation.state.params.totalVerses,
            bookName:'',
            verseNumber:''
        }
        
    }
    updateSelectedBook = (bookId,totalChapters,bookName)=>{
        console.log("book id in selection ",bookId)
        this.setState({bookId,totalChapters,bookName})
    }

    updateSelectedChapter = (chapterNumber,totalVerses)=>{
        console.log("total verses ",totalVerses)
        this.setState({chapterNumber,totalVerses})
        // this.props.navigation.state.params.params.quseryBookFromAPI()
        
        // this.props.navigation.goBack()
    }
    
    updateSelectedVerse=(verseNumber)=>{
        console.log("state value ",this.state)
        
        this.props.navigation.state.params.getReference(
            this.state.bookId, 
            this.state.bookName, 
            this.state.chapterNumber, 
            verseNumber
        )
        // this.props.updateBCV(this.state.bookId,this.state.chapterNumber,verseNumber)
        // this.setState({verseNumber}) 
        this.props.navigation.goBack()

    }
    render(){
        const params  = this.props.navigation.state.params 
        return(
            <SelectionTab
                screenProps={{
                    colorFile:this.props.screenProps.colorFile,
                    sizeFile:this.props.screenProps.sizeFile,
                    colorMode:this.props.screenProps.colorMode,
                    booksList:this.props.screenProps.booksList,
                    languageName:this.props.screenProps.languageName,
                    versionCode:this.props.screenProps.versionCode,
                    bookId:this.state.bookId,
                    bookName:getBookNameFromMapping(this.state.bookId,this.props.screenProps.languageName),
                    chapterNumber:this.state.chapterNumber,
                    verseNumber:this.state.verseNumber,

                    sourceId:this.props.screenProps.sourceId,
                    downloaded:this.props.screenProps.downloaded,
                    totalChapters:getBookChaptersFromMapping(this.state.bookId),
                    totalVerses:this.state.totalVerses,

                    updateSelectedBook:this.updateSelectedBook,
                    updateSelectedChapter:this.updateSelectedChapter,
                    updateSelectedVerse:this.updateSelectedVerse
                    
                }}
            
            />
        )
    }
}

