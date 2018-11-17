
import DbHelper from './dbHelper'
import info_json from '../assets/english_bbe/info.json'
import BookModel from '../models/BookModel';
import ChapterModel from '../models/ChapterModel';
import VersionModel from '../models/VersionModel';
import book_map from '../assets/book_map.json'



const Constants = require('./constants')

var RNFS = require('react-native-fs');

export default class USFMParser {

    constructor() {
        this.bookId = null;
        this.chapterList = [];
        this.verseList = [];
        this.bookIntro = [];
        this.bookSummary = [];
        this.mappingData = book_map;
        this.languageCode = null;
        this.languageName = null;
        this.versionCode = null;
        this.versionName = null;
        this.source = "BridgeConn";
        this.year = 2017;
        this.license = "CCSA";

    }

    // async parseFile(){
    //     try {
    //         var content = await RNFS.readFileAssets('Bibles/english_bbe/info.json')
    //         this.parseFileContents(content)
    //     }
    //     catch(error){
    //         console.log("error "+error)
    //     }
    // }

    async parseFileContents() {
        try {
        this.languageName = info_json.langName
        this.languageCode = info_json.lang
        this.versionCode = info_json.abbr
        this.versionName = info_json.name
        this.bookName = info_json. divisionNames
        for(i = 0 ; i<this.bookName.length;i++){
            const book_map = this.getBookNameFromMapping(this.bookName[i])
            if(this.bookName[i]){
                console.log("book map "+book_map.book_id)
               const sections = info_json.sections
               for(j = 0 ; j<sections.length-1;j++){
                const sectionString = sections[j]
                const res = ''
                    if (sectionString.length > 1) {
                        var res = sectionString.slice(0,2)
                    }
                    if(res == book_map.divisions){
                        var content = await RNFS.readFileAssets('Bibles/english_bbe/'+sections[j]+'.html')
                        this.processLine(content,book_map.book_id)
                    }
                }
            }
        }
        this.addBook()
        } catch(exception) {
            console.log("error in parsing file : " + exception)
        }
    }
    
    getBookNameFromMapping(bookName) {
        var obj = this.mappingData.book_map;
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (key == bookName) {
                    var val = obj[key];
                    return val;
                }
            }
        }
        return null;
    }
    processLine(chapterContent,bookId){
        const splitString = chapterContent.split('\n')
        //verse
        let verseText = ''
        for(i=0; i<splitString.length-1; i++){
            const vesreDataId = splitString[i].match(/data-id='\w{2}\d+_\d+'/g)
            if(vesreDataId){
                const num = vesreDataId.toString().match(/\d+_\d+/g)
                const arrayOfNum= num.toString().split('_')
                this.chapterNumber = arrayOfNum[0]
                const verseNumber = arrayOfNum[1]
                // vesreDataId 
                try{
                const verse = splitString[i].match(/>([A-Z].*?)(?=<)/g)
                verseText = verse.toString().replace(/^\>/g,' ')
                }
                catch(exec){
                    // console.log("excep "+excep)
                }


                
        var verseComponentsModel = {verseNumber: verseNumber, 
            text:verseText , highlighted: false, added: true, 
            languageCode: this.languageCode, versionCode: this.versionCode, bookId: bookId, 
            chapterNumber: this.chapterList.length == 0 ? 1 : this.chapterList[this.chapterList.length - 1].chapterNumber};
        this.verseList.push(verseComponentsModel)
        // console.log("verseComponent "+JSON.stringify(this.verseList))
            }
        var chapterModel = {chapterNumber: this.chapterNumber, numberOfVerses: 0, verseComponentsModels: []}
        this.chapterList.push(chapterModel);
    }
    // console.log("chapter number "+this.chapterNumber)
   
}
addComponentsToChapter() {
    // console.log("chapter data "+JSON.stringify(this.chapterList[2]))
    if (this.chapterList.length > 0) {
        if (this.verseList.length > 0) {
            for (var i=0; i<this.verseList.length; i++) {
                if (this.verseList[i].verseNumber != null) {
                    this.chapterList[this.chapterList.length - 1].verseComponentsModels.push(this.verseList[i]);
                }
            }
            var size = 0;
            for (var i=0; i< this.verseList.length; i++) {
                if (this.verseList[i].verseNumber != null) {
                    if (i == 0 || this.verseList[i].verseNumber != this.verseList[i-1].verseNumber) {
                        size = size + 1;
                    }
                }
            }
            this.chapterList[this.chapterList.length - 1].numberOfVerses = size;
            var j = this.verseList.length;
            while (j--) {
                if (this.verseList[j].verseNumber != null) {
                    this.verseList.splice(j, 1);
                }
            }
        }
    }
}

addBook(){
    var mapResult = this.getBookNameFromMapping(this.bookId)
    if (mapResult == null) {
        return
    }
       
        var bookModel = {
            bookId: mapResult.book_id,
            bookName: this.bookName, 
            bookNumber: mapResult.number, 
            section: mapResult.section, 
            chapterModels: this.chapterList,
            bookIntroModels:this.bookIntro,
        }
        console.log("book Model "+bookModel)
        var versionModel = {
            versionName: this.versionName, 
            versionCode: this.versionCode, 
            bookModels: [],
            source: this.source, 
            license: this.license, 
            year: this.year
        }
        versionModel.bookModels.push(bookModel)

        var languageModel = {
            languageCode: this.languageCode, 
            languageName: this.languageName, 
            versionModels: []
        }
        languageModel.versionModels.push(versionModel);
        
}
}
