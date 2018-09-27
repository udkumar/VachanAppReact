import React,{Component } from 'react'
import {View,Text} from 'react-native'
import DbQueries from '../utils/DbQueries.js'
import ParseUSFMFile from '../utils/ParseUSFMFile.js'

export default class Book extends Component {
    componentDidMount(){
        DbQueries.addBookData()
    }
    render(){
        return(
            <View>
                <Text>Hi</Text>
            </View>
        )
    }
}