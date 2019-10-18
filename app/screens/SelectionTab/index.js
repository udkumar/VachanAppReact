import React, { Component } from 'react';
import { StackNavigator ,TabNavigator} from "react-navigation";
import SelectBook from '../SelectBook/SelectBook'
import ChapterSelection from '../numberSelection/ChapterSelection'
import SelectVerse from '../SelectVerse/'

import DbQueries from '../../utils/dbQueries'
import { getBookChaptersFromMapping, getBookNameFromMapping } from '../../utils/UtilFunctions';

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
            bookId:this.props.navigation.state.params.bookId,
            chapterNumber:this.props.navigation.state.params.chapterNumber,
            totalChapters:this.props.navigation.state.params.totalChapters,
            totalVerses:this.props.navigation.state.params.totalVerses,
            bookName:'',
            verseNumber:''
        }
        
    }
    updateSelectedBook = (bookId,totalChapters,bookName)=>{
        console.log("book id in selection ",bookId)
        this.setState({bookId,totalChapters,bookName})
    }

    updateSelectedChapter = (chapterNumber,totalVerses)=>{
        console.log("total verses ",totalVerses)
        this.setState({chapterNumber,totalVerses})
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
        const params  = this.props.navigation.state.params 
        console.log("params SCREEN NAME IS  = = = ",params.bookId)
        console.log("STATE BOOK ID IS  = = = ",this.state.bookId)


        return(
            <SelectionTab
                screenProps={{
                    colorFile:this.props.screenProps.colorFile,
                    sizeFile:this.props.screenProps.sizeFile,
                    colorMode:this.props.screenProps.colorMode,
                    booksList:this.props.screenProps.booksList,
                    languageName:this.props.screenProps.languageName,
                    versionCode:this.props.screenProps.versionCode,
                    bookId:this.state.bookId,
                    bookName:getBookNameFromMapping(this.state.bookId,this.props.screenProps.languageName),
                    chapterNumber:this.state.chapterNumber,
                    verseNumber:this.state.verseNumber,

                    sourceId:this.props.screenProps.sourceId,
                    downloaded:this.props.screenProps.downloaded,
                    totalChapters:getBookChaptersFromMapping(this.state.bookId),
                    totalVerses:this.state.totalVerses,

                    updateSelectedBook:this.updateSelectedBook,
                    updateSelectedChapter:this.updateSelectedChapter,
                    updateSelectedVerse:this.updateSelectedVerse
                    
                }}
            
            />
        )
    }
}