import React, { Component } from 'react';
import { StackNavigator ,TabNavigator} from "react-navigation";
import SelectBook from '../SelectBook/SelectBook'
import ChapterSelection from '../ChapterSelection/ChapterSelection'

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
            totalChapters:''
        }
    }
    updateSelectedBook = (bookId,totalChapters)=>{
        this.setState({bookId,totalChapters})
    }

    updateSelectedChapter = (bookId,chapterNumber)=>{
        this.setState({chapterNumber,bookId})
        this.props.navigation.state.params.params.queryBookFromAPI()
        this.props.navigation.goBack()
    }
 
    render(){
        const params  = this.props.navigation.state.params.params
        console.log("LAST SCREEN NAME IS   ",this.props.navigation.state)

        console.log("LAST SCREEN NAME IS  = = = ",this.props.navigation.state.routeName)

        return(
            <SelectionTab
                screenProps={{
                    colorFile:this.props.screenProps.colorFile,
                    sizeFile:this.props.screenProps.sizeFile,
                    colorMode:this.props.screenProps.colorMode,
                    // booksList:this.props.screenProps.booksList,
                    languageName:params.languageName,
                    versionCode:params.versionCode,
                    bookId:this.state.bookId,
                    bookName:params.bookName,
                    chapterNumber:params.chapterNumber,
                    updateSelectedBook:this.updateSelectedBook,
                    updateSelectedChapter:this.updateSelectedChapter,
                    sourceId:params.sourceId,
                    downloaded:params.downloaded,
                    totalChapters:params.totalChapters
                }}
            
            />
        )
    }
}