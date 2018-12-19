
var Buffer = require('buffer/').Buffer 
var RNFS = require('react-native-fs');
import id_name_map from '../assets/mappings.json'

export default class TextParser {

    constructor() {
        this.bookId = null;
        // this.chapterList = [];
        // this.verseList = [];
        
    }

   
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
            // console.log("result length "+result.length)
            var lines = result.split('\n')
            // console.log("lines "+lines.length)
            for(var i=0; i<66; i++) {
                this.processLine(lines[i])
                    // console.log("i value "+lines[0])
            }
            for(i=66;i<1254;i++){
                console.log("i value "+lines[i])
            }
        } catch(exception) {
            console.log("error in parsing file : " + exception)
        }
    }
    processLine(summary) {
        const idBook = summary.match(/(\w{3})\t/)
        this.bookId = idBook[1]
        var myRegexp = /\<b\>(.*?)\<\/b\>(\s+\-\s+.*?)(?:<)/g
        while((match = myRegexp.exec(summary)) != null) {
            // console.log("key "+match[1])
            // console.log("value "+match[2]) 
        }

    }
    // addBookSummary(string){
    //         console.log("tags "+tags)
    // }

}
