'use strict'
import DbQueries from './DbQueries.js'
// import id_name_map from '../assets/mappings.json'
// const Constants = require('./constants')
import React, {Component} from  'react'
import {View,Text} from 'react-native'
import Book from '../screens/Book.js';
var RNFS = require('react-native-fs');

export default class USFMParser {
    constructor(){
        this.bookId = null;
        this.chapterList=[]
        this.verseList=[]
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
                this.addBookToDB()

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
                this.addBook(splitString[1]);
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
    addBook(value){
        this.bookId = value
        this.book = {bookId:this.bookId,chapterList:this.chapterList}

    }
    addChapter(num){
       var chapters = {chapterNumber:num,verseList:this.verseList} 
        this.chapterList.push(chapters)
    //    console.log("chapters in verse  "+JSON.stringify(this.chapterList))
    }
    addVerse(splitString){
        var verseNum = splitString[1];
        text = [];
        for (var i=2; i<splitString.length; i++) {
            text.push(splitString[i])
        }
        var verse = {verseNumber:verseNum,verseText:text}
        this.verseList.push(verse)
    }
    addBookToDB(){
        if(this.bookId == null){
            return
        }
        var bookModel = {bookId:this.bookId,bookName:"Genesis",chapters:this.chapterList}
        var versionModel = {versionName:"IRV",versionCode:"IRV",books:[]}
        var languageModel = {languageName:"Hindi", languageCode:"Hin",version:[]}
        versionModel.books.push(bookModel)
        languageModel.version.push(versionModel)
        console.log("bookModel "+bookModel+" versionModel "+versionModel+ " languageModel "+languageModel)
        // Book.book(bookModel,versionModel,languageModel)
        const str  = "hello"
        DbQueries.addBookData(bookModel, versionModel, languageModel)
    }
}
