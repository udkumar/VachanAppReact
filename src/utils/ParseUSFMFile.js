// import BookModel from '../models/BookModel'
// import ChapterModel from '../models/ChapterModel'
// import VerseComponentsModel from '../models/VerseComponentsModel'
// import DbQueries from './dbQueries'
// import id_name_map from '../assets/mappings.json'
// const Constants = require('./constants')
import React, {Component} from  'react'
import {View,Text} from 'react-native'

var RNFS = require('react-native-fs');

export default class USFMParser extends Component{
    constructor(){
        super()
        this.bookId = null;
        this.book = []
        this.chapterList = [];
        this.verseList = [];
       
    }

    async parseFile(){
        try {
            var content = await RNFS.readFileAssets('01-GEN.usfm')
            this.parseFileContents(content)
        }
        catch(error){
            console.log("error "+error)
        }
    }
    parseFileContents(result) {
        try {
            var lines = result.split('\n');
            for(var i = 0; i < lines.length; i++) {
                //code here using lines[i] which will give you each line
                if (!this.processLine(lines[i])) {
                    return false;
                }
            }
        } catch(exception) {
            console.log("error in parsing file : " + exception)
        }
    }

    processLine(line) {
        var splitString = line.split(/\s+/);
        if (splitString.length == 0) {
            return true;
        }
        switch (splitString[0]){
            case "\\id": {
                if (!this.addBook(splitString[1])) {
                    return false;
                }
                break;
            }
            case "\\c": {
                this.addChapter(splitString[1]);
                break;
            }
         
            case "\\v": {
                this.addVerse(splitString);
                break;
            }
            case "":{
                break;
            }
            default: {
                break
                
            }
        }
        return true;
    }


    addBook(value) {
        this.bookId = value.toString().trim();
        return true;
    }

    addChapter(num) {
       var chapter = {chapterNumber:num,verseList:[]} 
       this.chapterList.push(chapter)

    }
    addVerse(splitString){
        var verseNum = splitString[1];
        // console.log("chapter list "+JSON.stringify(this.chapterList))
        text = [];
        for (var i=2; i<splitString.length; i++) {
            text.push(splitString[i]);
        }
        var verse = {verseNumber:verseNum,verseText:text}
        this.verseList.push(verse)
        this.chapterList[this.chapterList.length - 1].verseList.push(this.verseList);
        console.log("chapters in verse  "+JSON.stringify(this.chapterList))


        // this.book.push(this.chapterList)
        this.chapterList = []
        this.verseList = []
            // console.log("add verse "+JSON.stringify(this.book))
    }
    
    componentDidMount(){
        this.parseFile()
    }
   
    render(){
        return(
            <Text>doing parsing</Text>
        )
    }
}
