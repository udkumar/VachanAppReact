import React,{Component } from 'react'
import {View,Text,FlatList} from 'react-native'
import DbQueries from '../utils/DbQueries.js'
import ParseUSFM from '../utils/ParseUSFM'


export default class Book extends Component {
    constructor(){
        super()
        this.state = {
            versionName:"",
            book:'',
            chapters:[]
        }
    }
    // async startParse() {
    //     var parse = await new ParseUSFM()
    //     parse.parseFile();
    // }
    async componentDidMount(){
        var queryBook  = await DbQueries.queryBook()
        console.log("query book "+JSON.stringify(queryBook[0].version[0].books))
        this.setState({
            versionName:queryBook[0].versionName,
            book:queryBook[0].version[0].books[0].book,
            chapters:queryBook[0].version[0].books[0].chapters
        })
    }

    render(){
        console.log("chapters book "+JSON.stringify(this.state.chapters))
        return(
            <FlatList
                data={this.state.chapters}
                renderItem={({item,index}) => 
                <View>
                    <Text style={{fontWeight:"bold",fontSize:20}}>{JSON.parse(item.chapterNum)}</Text>
                    {
                        item.verse.map((data)=>
                            <Text>{data.verseNumber} : {data.verseText}</Text> 
                        )
                    }
                </View>
                }
            />
            
        )
    }
}