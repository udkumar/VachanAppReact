import React,{Component } from 'react'
import {View,Text} from 'react-native'
import DbQueries from '../utils/DbQueries.js'

export default class Book extends Component {
   
    async componentDidMount(){
        var queryBook  = DbQueries.queryBook()
    }
    render(){
        return(
            <View>
                <Text>Hi</Text>
            </View>
        )
    }
}