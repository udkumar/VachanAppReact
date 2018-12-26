var Buffer = require('buffer/').Buffer 
var RNFS = require('react-native-fs');

const summaryOfBook = []
const summaryData = []
const bookId = null

    export  function parseFile(id){
            return RNFS.readFileAssets('irvhin.txt', 'base64')
                .then((res)=>{
                    const result = Buffer.from(res, 'base64').toString('utf8')
                        var lines = result.split('\n')
                        for(var i=0; i<66; i++) {
                            const idBook = lines[i].match(/(\w{3})\t/)
                            const bookId = idBook[1].toUpperCase()
                            if(bookId == id){
                                summaryData = []
                                    var string  = lines[i].split('<br>')
                                    for(j=2;j<string.length;j++){
                                        var myRegexp = /\<b\>(.*?)\<\/b\>(\s+\-\s+.*)/g
                                        while((match = myRegexp.exec(string[j])) != null){
                                            summaryData.push({key:match[1],value:match[2]})
                                        }
                                    }
                               
                            summaryOfBook.push({[bookId]:summaryData})
                        }
                    }
                    return summaryOfBook

                })
                .catch ((error)=>{
                    console.log("Error while parsing content "+error)
                })
    }

   
