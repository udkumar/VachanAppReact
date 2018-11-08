
import DbHelper from './dbHelper'
import id_name_map from '../assets/mappings.json'
import BookModel from '../models/BookModel';
import { Results } from 'realm';
import { styles } from '../screens/StudyBible/styles';
import { Spinner } from 'native-base';
import { constColors } from './colors';
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
            for(var i = 1; i<=lines[66]; i++) {
                this.processLine(lines[i])
                // console.log("split string "+lines[i])
            }
        } catch(exception) {
            console.log("error in parsing file : " + exception)
        }
    }
    processLine(summary) {
        console.log("lines in process line "+summary)
        const idBook = summary.match(/(^\w{3})/g)
        console.log("book id "+idBook)
        // if (splitString.length == 0) {
        //     return true;
        // }
    }
    // addBookSummary(string){
    //         console.log("tags "+tags)
    // }

}
