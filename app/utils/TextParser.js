
import DbHelper from './dbHelper'
import id_name_map from '../assets/mappings.json'
import BookModel from '../models/BookModel';
import { Results } from 'realm';
import { styles } from '../screens/StudyBible/styles';
import { Spinner } from 'native-base';
const Constants = require('./constants')
var Buffer = require('buffer/').Buffer 
var RNFS = require('react-native-fs');

export default class USFMParser {

    constructor() {
        // this.bookId = null;
        // this.chapterList = [];
        // this.verseList = [];
        // this.bookIntro = [];
        // this.mappingData = id_name_map;
        // this.languageCode = "Hin";
        // this.languageName = "Hindi";
        // this.versionCode = "IRV";
        // this.versionName = "Indian Revised Version";
        // this.source = "BridgeConn";
        // this.year = 2017;
        // this.license = "CCSA";
    }

    // parseFile(path, lCode, lName, vCode, vName, source, license, year, fromAssets) {
    //     this.languageCode = lCode;
    //     this.languageName = lName;
    //     this.versionCode = vCode;
    //     this.versionName = vName;
    //     this.source = source;
    //     this.license = license;
    //     this.year = year;

    //     if (fromAssets) {
    //         RNFS.readFileAssets(path)
    //             .then((result)=>{
    //                 this.parseFileContents(result);
    //             });
    //     } else {
    //         RNFS.readFile(path)
    //             .then((result)=>{
    //                 this.parseFileContents(result);
    //             });
    //     }
    // }

    async parseFile(){
        // try {
        //     console.log("add data text file ")
        //     var content =  RNFS.readFileAssets('irvhin.txt')
        //     // this.parseFileContents(content)
        //     console.log("text from file text "+content)
        // }
        // catch(error){
        //     console.log("error "+error)
        // }
        try {
            var content = await RNFS.readFileAssets('irvhin.txt', 'base64')
            const result = Buffer.from(content, 'base64').toString('utf8')
            this.parseFileContents(result)
        }
        catch(error){
            console.log("error "+error)
        }
    }

    parseFileContents(result) {
        try {
            var lines = result.split('\n');
            for(var i = 0; i < lines.length-1; i++) {
                // console.log("split string "+line[0])
                if (!this.processLine(lines[i])) {
                    return false;
                }
                // this.processLine[70]
            }
        } catch(exception) {
            console.log("error in parsing file : " + exception)
        }
    }

    processLine(line) {
        var splitString = line.split(/\s+/);
        // console.log("book id is 0"+splitString[0])
        // console.log("book id is 1 "+splitString[1])
        // if(splitString[0] && splitString[1]){
        //     const bookId  = splitString[1].match(/^[A-Z]{3}/g)
        // }
        if(splitString[1]){
            const chapterNum = splitString[1].match(/^\d+:$/g)
            const verseNum = splitString[1].match(/^\d+:\d+$/g)

            if(chapterNum !== null){
                this.addChapterSummary(line)
            }
            if(verseNum !== null){
               this.addVerseSummary(line)
            }
            else{
                this.addBookSummary(line)
            }
        }
        // if(summerisedText == '</b>'){
        // }
       
        
        return true
        // if (splitString.length == 0) {
        //     return true;
        // }
    }
    addBookSummary(string){
        var splitString = string.split(/\s+/);
        for(i=0; i<=splitString.length;i++){
            splitString[i].match(/<[^>]>+/)
        }
        const bookS = []
        const bookSummary= {
            text:string,
            style:'string'
        }

        bookS.push(bookS)
        console.log("line of matched boook "+bookS)
    }
    // addChapterSummary(string){
    //     const chapterS =[]
    //     const chapterSummary= {
    //         text:string,
    //         style:'string'
    //     }
    //     chapterS.push(chapterSummary)
    //     console.log("line of matched chapter "+chapterS)
    // }
    // addVerseSummary(string){
    //     const verseS =[]
    //     const verseSummary= {
    //         text:string,
    //         style:'string'
    //     }
    //     verseS.push(verseSummary)
    //     console.log("line of matched verse "+verseSummary)
    // }

}
