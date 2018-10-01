import React,{Component } from 'react'
import {View,Text} from 'react-native'
import DbQueries from '../utils/DbQueries.js'
import ParseUSFM from '../utils/ParseUSFM'


export default class Book extends Component {
    async startParse() {
        var parse = await new ParseUSFM()
        parse.parseFile();
    }
    async componentDidMount(){
        this.startParse()
        var queryBook  = await DbQueries.queryBook()
        console.log("query book "+JSON.stringify(queryBook))
    }
    render(){
        return(
            <View>
                <Text>Hi</Text>
            </View>
        )
    }
}