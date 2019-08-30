import React, { Component } from 'react';
import { StackNavigator ,TabNavigator} from "react-navigation";
import SelectBook from '../SelectBook/SelectBook'
import ChapterSelection from '../numberSelection/ChapterSelection'
import DbQueries from '../../utils/dbQueries'

const SelectionTab = TabNavigator(
	{
        Books: {
            screen: SelectBook
        },
        Chapters:{
            screen:ChapterSelection
        },
       
    },
    {   
        // tabBarPosition: 'bottom',
        activeTintColor:'#fff',
        inactiveTintColor:'#D3D3D3',
        swipeEnabled:true,
        tabBarOptions: {
            labelStyle: { fontSize: 16,margin:0,padding:0 },
            showIcon: true,
            showLabel: true,
            activeTintColor: '#fff',
            upperCaseLabel: false,
            style: {
                backgroundColor: '#3F51B5', // Makes Android tab bar white instead of standard blue
            },
            indicatorStyle: {
                backgroundColor: '#fff',
            },
        },
      
    }
	
)



export default class SelectionStack extends Component {

    constructor(props){
        super(props)
        this.state = {
            bookId:'',
            chapterNumber:'',
            totalNumberOfChapter:this.props.navigation.state.params.totalNumberOfChapter
        }
    }
    updateSelectedBook = (bookId,totalNumberOfChapter)=>{
        this.setState({bookId,totalNumberOfChapter})
              
    }
    updateSelectedChapter = (bookId,chapterNumber)=>{
        this.setState({chapterNumber,bookId})
        // this.props.screenProps.updateChapterData(bookId,chapterNumber)
        this.props.navigation.state.params.queryBookFromAPI()
        this.props.navigation.goBack()
    }
    // async componentDidMount(){
    //     var booksid = await DbQueries.getDownloadedBook(this.props.navigation.state.params.languageName,this.props.navigation.state.params.versionCode)
    //     console.log("bookssssId  ",booksid)
    // }
    render(){
        return(
            <SelectionTab
                screenProps={{
                    colorFile:this.props.screenProps.colorFile,
                    sizeFile:this.props.screenProps.sizeFile,
                    colorMode:this.props.screenProps.colorMode,
                    booksList:this.props.screenProps.booksList,
                    languageName:this.props.navigation.state.params.languageName,
                    versionCode:this.props.navigation.state.params.versionCode,
                    bookId:this.state.bookId,
                    bookName:this.props.navigation.state.params.bookName,
                    chapterNumber:this.props.navigation.state.params.chapterNumber,
                    updateSelectedBook:this.updateSelectedBook,
                    updateSelectedChapter:this.updateSelectedChapter,
                    sourceId:this.props.navigation.state.params.sourceId,
                    downloaded:this.props.navigation.state.params.downloaded,
                    totalNumberOfChapter:this.props.navigation.state.params.totalNumberOfChapter
                }}
            
            />
        )
    }
}