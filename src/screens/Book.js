import React,{Component } from 'react'
import {View,Text,FlatList} from 'react-native'
import DbHelper from '../utils/dbHelper.js'
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
        this.startParse()
        // let queryBook = await DbHelper.queryData()
        // console.log("query book ........")
        // this.setState({data:queryBook[0})
        // console.log("query book "+JSON.stringify(queryBook.length))
    }

    render(){
        // console.log("chapters book "+JSON.stringify(this.state.data))
        return(
            <FlatList
                data={this.state.data}
                renderItem={({item,index}) => 
                <View>
                    <Text style={{fontWeight:"bold",fontSize:20}}>{item.bookId}</Text>
                </View>
                }
                keyExtractor={(item, index) => index.toString()}
            />
            
        )
    }
}