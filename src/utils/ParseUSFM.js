'use strict'
import DbQueries from './DbQueries.js'
// import id_name_map from '../assets/mappings.json'
// const Constants = require('./constants')
import React, {Component} from  'react'
import {View,Text} from 'react-native'
import Book from '../screens/Book.js';
var RNFS = require('react-native-fs');

export default class ParseUSFM {
    constructor(){
        this.bookId = null;
        this.paragraph=null,
        this.section =null,
        this.chapterList=[],
        this.verseList=[],
        this.bookIntro=[],
        this.IOLTitle=null,
        this.IOLContent=[],
        this.chapterSection=[],
        this.foootNoteRef='',
        this.foootNoteText='',
        this.footNotequotation='',
        this.bookName =null
    }

    async parseFile(){
        try {
            var content = await RNFS.readFileAssets('01-GEN.usfm')
            this.parseFileContents(content)
        }
        catch(error){
            console.log("error "+error)
        }
        this.addBookToDB()
    }
    parseFileContents(result) {
        try {
            var lines = result.split('\n');
            for(var i = 0; i < lines.length; i++) {
                //code here using lines[i] which will give you each line
                if (!this.processLine(lines[i])) {
                    return false
                }
            }
            // this.addBookToDB()
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
                this.bookId = splitString[1]
                break;
            }
            case ("\\h"): {
                this.addBookName(splitString);
                break
            }
            case ("\\is"): {
            }
            case "\\ip": {
                this.addbookIntro(splitString);
                break;
            }
            case "\\iot": {
                this.IOLTitle = splitString[1]
                break;
            }
            case "\\io1": {
                this.anddOLTcontent(splitString);
                break;
            }
            
            case "\\c": {
                this.addChapter(splitString[1]);
                break;
            }
            case'\\s':{
                this.addChapterSection(splitString);
                break;
            }
            case "\\v": {
                this.addVerse(splitString);
                break;
            }
            case" ":{
                break;
            }
            default: {
                break
                
            }
        }
        return true;
    }
    addBookName(name){
        this.bookname = this.joinString(name)       
    }
    addbookIntro(intro){
        switch(intro[0]){
            case "\\is": {
               this.section = this.joinString(intro)
                break;
            }
            case "\\ip": {
                this.paragraph = this.joinString(intro)
                const bookIntro = {introSecHeader:this.section,introParagraph:this.paragraph}
                this.bookIntro.push(bookIntro)
                break;
            }
            default:{
                break;
            }
        }
    }
  
    anddOLTcontent(introOutLine){
        const IOLNumber = introOutLine[1]
        const res = this.joinString(introOutLine)
        const IOL = {IOLNumber:IOLNumber,content:res}
        this.IOLContent.push(IOL)
    }
    addChapter(num){
       var chapters = {chapterNum:num,verse:this.verseList,sectionHeading:this.chapterSection} 
        this.chapterList.push(chapters)
    }
    addChapterSection(section){
        this.chapterSection.push({heading:section})
    }
    addVerse(splitString){
        var verseNum = splitString[1];
        const res = this.joinString(splitString)
        const tagRemove = res.replace(/\\it\*\*|\\it/g,'');
        const verseData = tagRemove.replace(/(\\f(.*?)\\f\*)|(\\bdit(.*?)\\bdit\*)/g,"")
        const footnote = tagRemove.match(/\\f(.*?)\\f\*/g)
        if(footnote == null){
            return true
        }   
        console.log("footnote "+footnote)
        this.addfootnotes(footnote,verseNum,verseData)

    }
    addfootnotes(note,verseNumm,verseDataa){
        const noteData = note.toString()
        if(note.length == 0) {
            return true
        }
        const frTag = /((\\f\s+\+\s+\\fr\s+)(\d+\.\d+)(.*?)(\\f\*))/g
        const fqTag = /((\\fr(.*?)\\fq\s+)(.*?)(\\ft))/g
        const fxTag =/((\\fr(.*?)\\fq)((.*?)\\ft.*))/g
        const fTag = /((\\f\s+\+)(.*?)(\\f\*))/g
        const noteContent = noteData.replace(fTag,'$3')

        this.foootNoteRef = noteData.replace(frTag,'$3')
        this.footNotequotation = noteContent.replace(fxTag,'$5')
        this.foootNoteText = noteContent.replace(fqTag,'')
        var verse = {verseNumber:verseNumm,
            verseText:verseDataa,
            footNoteText:this.foootNoteRef,
            footNotequotation:this.footNotequotation,
            foootNoteRef:this.foootNoteRef
        }
        this.verseList.push(verse)
    }

    joinString(string){
        var text = [];
        for (var i= string[0] == ('\\v' || '\\io1') ? 2 : 1; i<string.length; i++) {
            text.push(string[i])
        }
        // if(string.length<=3){
        //     // console.log("LESS LENGTH STRING"+string)
        //     // console.log("text"+string[1])
        //     // return text
        // }
        const res = text.join(" ")
        return res
    }
    addBookToDB(){
        if(this.bookId == null && this.chapterList.length == 0){
            return
        }
        // console.log("BOOK NAME"+this.bookName)
        var bookModel ={ 
        bookId:this.bookId,
        bookName:this.bookName,
        chapters:this.chapterList,
        intro:this.bookIntro,
        IOLTitle:this.IOLTitle,
        IOLContent:this.IOLContent}
        // var bookModel = {bookId:this.bookId,bookName:"Genesis",chapters:this.chapterList}
        var versionModel = {versionName:"Indian Revised Version",versionCode:"IRV",books:[]}
        var languageModel = {languageName:"Hindi", languageCode:"Hin",version:[]}
        versionModel.books.push(bookModel)
        languageModel.version.push(versionModel)
        console.log("book model "+JSON.stringify(bookModel))
        // DbQueries.addBookData(bookModel, versionModel, languageModel)
    }
}
