import React,{Component } from 'react'
import {View,Text,FlatList} from 'react-native'
import DbQueries from '../utils/DbQueries.js'
import ParseUSFM from '../utils/ParseUSFM'


export default class Book extends Component {
    constructor(){
        super()
        this.state = {
            book:[]
        }
    }
   
    async componentDidMount(){
        var queryBook  = await DbQueries.queryBook()
        console.log("query book "+JSON.stringify(queryBook))
        this.setState({book:queryBook})
    }

    render(){
        console.log("boook"+JSON.stringify(this.state.book))
        return(
            <View>
                <Text>{JSON.stringify(this.state.book)}</Text>
            </View>
            
        )
    }
}