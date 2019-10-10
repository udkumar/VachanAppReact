import React, { Component } from 'react';
import { StackNavigator ,TabNavigator} from "react-navigation";
import SelectBook from '../SelectBook/SelectBook'
import ChapterSelection from '../numberSelection/ChapterSelection'
import SelectVerse from '../SelectVerse/'

import DbQueries from '../../utils/dbQueries'

const SelectionTab = TabNavigator(
	{
        Books: {
            screen: SelectBook,
            navigationOptions: {
                tabBarLabel: 'SelectBook',
                // tabBarIcon: ({ tintColor }) => <MaterialIcons name='account-circle' size={26} style={{ color: tintColor }} />
              },
        },
        Chapters:{

            screen:ChapterSelection,
            navigationOptions: {
                tabBarLabel: 'Select Chapter',
                // tabBarIcon: ({ tintColor }) => <MaterialIcons name='account-circle' size={26} style={{ color: tintColor }} />
              },
        },
        Verses:{
            
            screen:SelectVerse,
            navigationOptions: {
                tabBarLabel: 'Select Verse',
                // tabBarIcon: ({ tintColor }) => <MaterialIcons name='account-circle' size={26} style={{ color: tintColor }} />
              },
        },
       
    },
    {   
        // tabBarPosition: 'bottom',
        // activeTintColor:'#3F51B5',
        inactiveTintColor:'#000',
        swipeEnabled:true,
        tabBarOptions: {
            labelStyle: { fontSize: 16,margin:0,padding:0,color:"#3F51B5" },
            // showIcon: true,
            // showLabel: true,
            // activeTintColor: '#3F51B5',
            // inactiveTintColor:"#fff",
            upperCaseLabel: false,
            style: {
                backgroundColor:"#fff",
                // backgroundColor: '#3F51B5', // Makes Android tab bar white instead of standard blue
                height:36
            },
            indicatorStyle: {
                backgroundColor: '#3F51B5',
            },
        },
      
    }
	
)



export default class SelectionStack extends Component {

    constructor(props){
        super(props)
        this.state = {
            bookId:this.props.navigation.state.params.params.bookId,
            chapterNumber:'',
            totalChapters:'',
            bookName:'',
            verseNumber:''
        }
        
    }
    updateSelectedBook = (bookId,totalChapters,bookName)=>{
        this.setState({bookId,totalChapters,bookName})
    }

    updateSelectedChapter = (chapterNumber)=>{
        this.setState({chapterNumber})
        // this.props.navigation.state.params.params.quseryBookFromAPI()
        
        // this.props.navigation.goBack()
    }
    
    updateSelectedVerse=(verseNumber)=>{
        console.log("state value ",this.state)
        this.props.navigation.state.params.getReference(
            this.state.bookId, 
            this.state.bookName, 
            this.state.chapterNumber, 
            verseNumber
        )
        // this.setState({verseNumber}) 
        this.props.navigation.goBack()

    }
    render(){
        const params  = this.props.navigation.state.params.params
        console.log("LAST SCREEN NAME IS   ",this.props.navigation.state)

        console.log("LAST SCREEN NAME IS  = = = ",params.totalVerses)
        return(
            <SelectionTab
                screenProps={{
                    colorFile:this.props.screenProps.colorFile,
                    sizeFile:this.props.screenProps.sizeFile,
                    colorMode:this.props.screenProps.colorMode,
                    booksList:this.props.screenProps.booksList,
                    languageName:params.languageName,
                    versionCode:params.versionCode,
                    bookId:this.state.bookId,
                    bookName:params.bookName,
                    chapterNumber:params.chapterNumber,
                    verseNumber:this.state.verseNumber,

                    sourceId:params.sourceId,
                    downloaded:params.downloaded,
                    totalChapters:params.totalChapters,
                    totalVerses:params.totalVerses,

                    updateSelectedBook:this.updateSelectedBook,
                    updateSelectedChapter:this.updateSelectedChapter,
                    updateSelectedVerse:this.updateSelectedVerse
                    
                }}
            
            />
        )
    }
}