import RNFS from 'react-native-fs'
import React, {Component} from 'react';
import {Text,Platform,ScrollView} from 'react-native'

export default class ParseData extends Component{
    constructor(){
        super()
        this.state={
            res:[],
            section:[],
            verse:[],
            verseN:[],
            chapterNum:[]
        }
    }
   
    async parseFile(){
       var verseText =[]
       var chapterNum = []
        try {
            var content = await RNFS.readFileAssets('01-GEN.usfm')
            this.setState({res:content})
            var line = content.split('\n')
                if(line.length != 0){
                   for(i=0; i<=line.length-1; i++){
                    var marker = line[i].substr(0,line[i].indexOf(' '))
                        if(marker == '\\v'){
                            var text =  line[i].substr(line[i].indexOf(' ')+1)//
                                verseText.push(text)
                                this.setState({
                                    verse: verseText
                                  }
                                )
                        }
                        if(marker == '\\c'){
                            var chapter =  line[i].substr(line[i].indexOf(' ')+1)//
                            // console.log("chapter "+chapter)
                                chapterNum.push(chapter)
                                this.setState({
                                    chapterNum: chapterNum
                                  })
                        }
                   }
                    console.log("verse text length "+verseText.length) 
                    for(i=0; i<=verseText.length-1; i++){
                                const verseNumber = verseText[i].substr(0,verseText[i].indexOf(' ')+1)
                                const verseData = verseText[i].substr(verseText[i].indexOf(' ')+1)
                                console.log('verse number '+verseNumber)
                                console.log('verse number '+verseData)
                        }
                  
                }
          }catch (e) {
            alert("" + e);
          }
        
    }

   

    componentDidMount(){
            this.parseFile()
    }

    render(){
        // console.log("verse data length number "+this.state.verse.length)
        return(
        <ScrollView>
        <Text>{JSON.stringify(this.state.verse)}</Text>
        </ScrollView>
        )
    }
}



