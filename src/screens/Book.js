import React,{Component } from 'react'
import {View,Text,FlatList} from 'react-native'
import DbHelper from '../utils/DbHelper.js'
import USFMParser from '../utils/USFMParser'


export default class Book extends Component {
    constructor(){
        super()
        this.state = {
            versionName:"",
            book:'',
            data:[],
            chapters:[]
        }
    }
    async startParse() {
        var parse = await new USFMParser()
        parse.parseFile();
    }
    async componentDidMount(){
        // this.startParse()
        // console.log("query book ''''''''.....")
        let queryBook = await DbHelper.queryData()
        console.log("query book ........")
        // this.setState({data:queryBook})
        console.log("query book "+queryBook[0].versionModels[0].bookModels[0].bookId)
    }

    render(){
        console.log("chapters book "+JSON.stringify(this.state.data))
        return(
            <Text>text</Text>
            // <FlatList
            //     data={this.state.chapters}
            //     renderItem={({item,index}) => 
            //     <View>
            //         <Text style={{fontWeight:"bold",fontSize:20}}>{JSON.parse(item.chapterNum)}</Text>
            //         {
            //             item.verse.map((data)=>
            //                 <Text>{data.verseNumber} : {data.verseText}</Text> 
            //             )
            //         }
            //     </View>
            //     }
            // />
            
        )
    }
}