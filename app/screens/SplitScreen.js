import React,{Component } from 'react'
import {View,Text,FlatList,Dimensions} from 'react-native'
import DbHelper from '../utils/dbHelper.js'
import USFMParser from '../utils/USFMParser'
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;


export default class AddData extends Component {
    constructor(){
        super()
    }
    async startParse() {
        var parse = await new USFMParser()
        parse.parseFile()
    }
    componentDidMount(){
        this.startParse()
        // let queryBook = await DbHelper.queryData()
        // console.log("query book ........")
        // console.log("query book "+JSON.stringify(queryBook))
    }

    render(){
        // console.log("chapters book "+JSON.stringify(this.state.data))
        return(
         <Text>hi</Text>
            
        )
    }
}