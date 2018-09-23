import RNFS from 'react-native-fs'
import React, {Component} from 'react';
import {Text,Platform,ScrollView} from 'react-native'


export default class ParseData extends Component{
    constructor(){
        super()
        this.state={
            // book:{
            //     bookId:'',
            //     chapters:{
            //         chapNum:[
            //             {
            //                 verseNum:[],
            //                 verseText:[]
            //             }
            //         ],
                    
            //     }
            // }
        }
    }
   
    async parseFile(){
        chapterNumber= []
        bookId =''
        verseData= []
        allMarker= []
        try {
            var content = await RNFS.readFileAssets('01-GEN.usfm')
            this.setState({res:content})
            var line = content.split('\n')
            // console.log(line)
            if(line.length != 0){
                for(i=0; i<=line.length-1; i++){
                 var marker = line[i].substr(0,line[i].indexOf(' '))
                    allMarker.push(marker)         
                    if(marker == '\\id'){
                        var bookId =  line[i].substr(line[i].indexOf(' ')+1)//
                        // console.log("book id "+bookId)
                    }
                    if(marker == '\\c'){
                         var chapter =  line[i].substr(line[i].indexOf(' ')+1)//
                         // console.log("chapter "+chapter)
                            var chapterNum = line[i].substr(line[i].indexOf(' ')+1)
                            chapterNumber.push(chapterNum)
                    }
                    if(marker == '\\v'){
                        var text =  line[i].substr(line[i].indexOf(' ')+1)//
                            verseData.push(text)
                    }
                   
                    // console.log("chapter number "+chapterNumber)
                }
                this.addChapter(chapterNum);
                this.addBookId(bookId)
                this.addVerseData(verseData,chapterNum,allMarker)
                this.getMarker(allMarker)
            }

          }catch (e) {
            alert("" + e);
          }
    }
    getMarker(markers){
            console.log("markers")
    }
    addBookId(id){
        // console.log("id "+id)
    }
    addChapter(chapterNum){
        // console.log("chapter"+chapterNum)
    }
    addVerseData(verseData,chapter,markers){
        var verse = []
        var verseArray = []
        console.log("all marker "+JSON.stringify(markers))
        for(i=0;i<=markers.length-1;i++){
                if(markers[i]=='\\c'){
                    console.log("matched marker c"+markers[i])
                    if(markers[i+1] == '\\v'){
                console.log("matched marker v "+markers[i+1].length)
                }
            }
        }
        // console.log("versedaata"+verseData)
        // for(i=0; i<=verseData.length-1; i++){
        //     const verseNumber = verseData[i].substr(0,verseData[i].indexOf(' ')+1)
        //     const verseText = verseData[i].substr(verseData[i].indexOf(' ')+1)
        //     verse.push({
        //         verseNumber:verseNumber,
        //         verseText:verseText
        //     })
        // }
        
        // if(chapter.length >0){
        //        for(i=0;i<=chapter.length-1;){
        //            for(j=0;j<=verse[j].verseNumber.length-1;j++){
        //                 console.log("verse number in loop "+verse[j].verseNumber)
        //                 verseArray.push(verse[i].verseNumber)

        //                 console.log("i "+i+ " j "+j)
        //                 // i++
        //                 // break;
        //             console.log("verse number "+JSON.stringify(verseArray.len))
        //            }

        //        }
        // }
    }
    componentDidMount(){
            this.parseFile()
    }

    render(){
        // console.log("verse data length number "+this.state.verse.length)
        return(
        <ScrollView>
        <Text>{JSON.stringify(this.state.verseData)}</Text>
        </ScrollView>
        )
    }
}

