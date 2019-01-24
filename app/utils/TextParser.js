var Buffer = require('buffer/').Buffer 
var RNFS = require('react-native-fs');

const summaryOfBook = []
const summaryData = []
const bookId = null

    export  function parseFile(id,chapterNum){

            return RNFS.readFileAssets('irvhin.txt', 'base64')
                .then((res)=>{
                    const result = Buffer.from(res, 'base64').toString('utf8')
                        var lines = result.split('\n')
                        if(chapterNum !==null){
                            for(var i=66; i<1254; i++) {
                                const bookIdChapter = lines[i].match(/([a-zA-Z]{3})\s+(\d+)/)
                                if(id == bookIdChapter[1].toUpperCase() && chapterNum == bookIdChapter[2]){
                                    return summary(lines[i])
                                }
                            }
                        }
                        for(var i=0; i<66; i++) { 
                            const idBookBook = lines[i].match(/([a-zA-Z]{3})/)
                                if(id == idBookBook[1].toUpperCase()){
                                return summary(lines[i])
                                }
                        }

                        // for(var i=1255; i<lines.length-1; i++) {
                        //     const bookIdChapterVerse = lines[i].match(/([a-zA-Z]{3})\s+(\d+):(\d+)/)
                        //     if(id == bookIdChapterVerse[1].toUpperCase() && chapterNum == bookIdChapterVerse[2] && verseNum == bookIdChapterVerse[3]){
                        //         console.log("yes every thing is matching")
                        //     }

                        // }


                })
                .catch ((error)=>{
                    console.log("error "+error)
                })
    }



    function summary(line){
        summaryData = []
        var string  = line.split('<br>')
        for(j=0;j<=string.length-1;j++){
            console.log("string "+string[j])
            var myRegexp = /\<b\>(.*?)\<\/b\>(\s+\-\s+.*)/g
            while((match = myRegexp.exec(string[j])) != null){
                summaryData.push({key:match[1],value:match[2]})
            }
        }
        return summaryData
    }

   
