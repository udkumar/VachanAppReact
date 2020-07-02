import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import DbQueries from '../../utils/dbQueries.js'
import APIFetch from '../../utils/APIFetch'
import {getBookChaptersFromMapping, getBookNumberFromMapping,getBookNumOfVersesFromMapping, getResultText} from '../../utils/UtilFunctions'
import SearchTab from '../../components/SearchTab/SearchTab'
import {updateVersionBook,updateVersion,fetchVersionBooks} from '../../store/action/'

import {searchStyle} from './styles'
import {connect} from 'react-redux'
const width = Dimensions.get('window').width;
 
const SearchResultTypes = {
  ALL: 0,
  OT: 1,
  NT: 2
};

class Search extends Component {
  
  static navigationOptions = ({navigation}) =>{
      const { params = {} } = navigation.state;
      return {
        
        headerTitle:(
          <TextInput
            placeholder="Enter Search Text"
            underlineColorAndroid = 'transparent'
            style={{color:'white',width:width-90}}
            onChangeText={(text) =>params.onTextChange(text)}
            placeholderTextColor={'#fff'} 
            returnKeyType="search"
            multiline={false}
            numberOfLines={1}
            value={params.text}
            onSubmitEditing={() => params.onSearchText()}
          />
        ),
        headerRight:(
          <Icon name={'search'} onPress={()=>params.onSearchText()} size={24} color="#fff" style={{marginHorizontal:8}} />
        )
      }
  }

  constructor(props){
    super(props);
    this.state = {
      searchedResult:[],
      activeTab:SearchResultTypes.ALL,
      isLoading:false,
      text:'',
      tabsData:[],
      sourceId:this.props.sourceId,
      languageName:this.props.languageName,
      versionCode:this.props.versionCode,
      downloaded:this.props.downloaded,
      languageCode:this.props.languageCode,
      bookName:this.props.bookName,
      bookId:this.props.bookId,
      books:this.props.books
    }

    this.onSearchText = this.onSearchText.bind(this)
    this.toggleButton = this.toggleButton.bind(this)
    this.clearData = this.clearData.bind(this)

    this.styles = searchStyle(props.colorFile, props.sizeFile);  
  }
  
  onSearchText(){
    this.setState({isLoading: true, searchedResult:[], tabsData:[]}, async () => {

      if(this.state.downloaded){
        let searchResultByBookName = await DbQueries.querySearchBookWithName(this.state.versionCode, this.state.languageName,this.state.text);
        // console.log("SEARCHED  RESULT",searchResultByBookName)
        if(searchResultByBookName){
        console.log("SEARCHED  RESULT",searchResultByBookName)
          let reference = [{
              bookId:searchResultByBookName.bookId,
              bookName:searchResultByBookName.bookName,
              chapterNumber:1,
              verseNumber:'1',
              text:'',
            }]
          this.setState({searchedResult: reference})
          this.addRefListToTab(reference)
        }
        let searchResultByVerseText = await DbQueries.querySearchVerse(this.state.versionCode, this.state.languageName,this.state.text)
        console.log("searchResultByVerseText  ",searchResultByVerseText)
        if (searchResultByVerseText &&  searchResultByVerseText.length >0) {
          this.setState({searchedResult:[...this.state.searchedResult, ...searchResultByVerseText]})
          this.addRefListToTab(searchResultByVerseText)
        }
        this.setState({isLoading:false})
      }else{
        var res = await APIFetch.searchText(this.state.sourceId,this.state.text)
        var data = []
          if (res && this.state.books) {
            for(var i=0; i<=res.result.length-1; i++){
              for(var j = 0 ;j<= this.state.books.length-1;j++){
                var bId = this.state.books[j].bookId
                var bName = this.state.books[j].bookName
                if(bId == res.result[i].bookCode){
                  data.push({
                    bookId:res.result[i].bookCode,
                    bookName:bName,
                    chapterNumber:res.result[i].chapter,
                    verseNumber:res.result[i].verse,
                    text:res.result[i].text,
                  })
                }
                
              }
            // console.log("result ",res.result[i])
                
            }
            this.setState({searchedResult:data})
            this.addRefListToTab(data)
          }
          this.setState({isLoading:false})
      }
     
    })
  }
  

  clearData() {
    // if(this.state.text !=null){
      this.props.navigation.setParams({text: ''})
      if(this.state.text){
        this.setState({text:""})
      }
    // }
  }

  addRefListToTab(list) {
    switch (this.state.activeTab) {
      case SearchResultTypes.ALL: {
        this.setState({tabsData:[...this.state.tabsData, ...list]})
        break;
      }
      case SearchResultTypes.OT: {
        let reflist = [];
        for (var i=0; i<list.length;i++) {
          if(getBookNumberFromMapping(list[i].bookId) < 40){
            reflist.push(list[i])
          }
        }
        this.setState({tabsData:[...this.state.tabsData, ...reflist]})
        break;
      }
      case SearchResultTypes.NT: {
        let reflist = [];
        for (var i=0; i<list.length;i++) {
          if(getBookNumberFromMapping(list[i].bookId) > 40){
            reflist.push(list[i])
          }
        }
        this.setState({tabsData:[...this.state.tabsData, ...reflist]})
        break;
      }
    }
  }

  renderDataOnPressTab(activeTab) {
    this.setState({tabsData: []}, () => {
      switch (activeTab) {
        case SearchResultTypes.ALL: {
            this.setState({tabsData: this.state.searchedResult})
          break;
        }
        case SearchResultTypes.OT: {
          let data = [];
          for(var i = 0; i < this.state.searchedResult.length ;i++ ){
            if(getBookNumberFromMapping(this.state.searchedResult[i].bookId) < 40){
              data.push(this.state.searchedResult[i])
            }
          }
          this.setState({tabsData:data})
          break;
        }
        case SearchResultTypes.NT: {
          let data = [];
          for(var i = 0; i < this.state.searchedResult.length ;i++ ){
            if(getBookNumberFromMapping(this.state.searchedResult[i].bookId) > 40){
              data.push(this.state.searchedResult[i])
            }
          }
          this.setState({tabsData:data})
          break;
        }
      }
    })
  }

  onTextChange = (text) =>{
    this.props.navigation.setParams({text:text})
    this.setState({text:text})
  }
  
  async componentDidMount() {
    const response = await APIFetch.fetchBookInLanguage()

    for(var i =0;i<response.length;i++){
      var books = []
      if(this.state.languageName.toLowerCase() == response[i].language.name){
        for(var j=0;j<response[i].bookNames.length;j++){
          books.push({
            bookId:response[i].bookNames[j].book_code,
            bookName:response[i].bookNames[j].short,
            bookNumber:response[i].bookNames[j].book_id,
          })
        }
        this.setState({books})
      }
    }
    this.props.navigation.setParams({
      onTextChange: this.onTextChange,
      onSearchText: this.onSearchText,
      onChangeText:this.onChangeText,
      clearData:this.clearData,
      headerStyle:this.styles.headerText,
      // text:this.state.text
    })

  }
  toggleButton(activeTab){
    if (this.state.activeTab == activeTab) {
      return;
    }
    this.setState({activeTab}, ()=> {
        this.renderDataOnPressTab(activeTab)
    })
  }

  // ListEmptyComponent = () => {
  //   return (
  //     <View style={this.styles.ListEmptyContainer}>
  //       { this.state.isLoading == false 
  //         ? <Text>No Result Found</Text>
  //         : null
  //       }
  //     </View>
  //   )
  // }

  // ListFooterComponent = () => {
  //   return(
  //     <View>
  //       { this.state.isLoading 
  //         ? <Text>Loading...</Text>
  //         : null
  //       }
  //     </View>
  //   )
  // }
goToBible=(bId,bookName,chapterNum,verseNum)=>{
  console.log(" language version ",this.props.languageName,this.state.languageName,this.props.versionCode)
  this.props.updateVersionBook({
    bookId:bId,
    bookName:bookName,
    chapterNumber:chapterNum,
    totalChapters:getBookChaptersFromMapping(bId),
    totalVerses:getBookNumOfVersesFromMapping(bId,chapterNum),
    verseNumber:verseNum
  })
  
  this.props.updateVersion({language:this.state.languageName,languageCode:this.state.languageCode,
  versionCode:this.state.versionCode,sourceId:this.state.sourceId,downloaded:this.state.downloaded})
  this.props.navigation.navigate('Bible')
}


searchedData = ({item,index}) => {

    return (
      <TouchableOpacity style={this.styles.searchedDataContainer} 
        onPress={ ()=> {this.goToBible(item.bookId,item.bookName,item.chapterNumber,item.verseNumber,this.state.languageName)}}
        >
        <Text style={this.styles.searchedData}> 
          {item.bookName} {item.chapterNumber} : {item.verseNumber} 
        </Text>
        <Text style={this.styles.textStyle}>{getResultText(item.text)}</Text>
      </TouchableOpacity>
    )
  }
    updateLangVer=async(item)=>{
      this.props.fetchVersionBooks({language:item.langName,versionCode:item.verCode,
        downloaded:item.downloaded,sourceId:item.sourceId})
      // this.props.updateVersion({language:item.languageName,languageCode:item.languageCode,
      //   versionCode:item.versionCode,sourceId:item.sourceId,downloaded:item.downloaded})
        this.setState({tabsData:[],searchedResult:[],
          sourceId:item.sourceId,languageCode:item.languageCode,
          languageName:item.languageName,versionCode:item.versionCode,
          downloaded:item.downloaded,books:item.books})
    }
  render() {
   
    let text = this.state.isLoading == true ? "Loading..." : this.state.tabsData.length + " search results found"
    return (
      <View style={this.styles.container}>
        <View style={this.styles.toggleBibleTouchable}>
            <Text  style={this.styles.headerStyle}>Bible</Text>
           <TouchableOpacity style={{backgroundColor:"#3E4095",padding:8,borderRadius:8}} onPress={()=>this.props.navigation.navigate('LanguageList',{updateLangVer:this.updateLangVer})}>
            <Text style={this.styles.text}>
              {this.state.languageName} {this.state.versionCode} 
            </Text>
           </TouchableOpacity>
        </View>
        <Text style={this.styles.textLength}>{text}</Text>
        {this.state.tabsData.length > 0 &&
        <View>
          {/* <Text>{applyBoldStyle}</Text> */}
        <SearchTab
          toggleFunction={this.toggleButton}
          activeTab={this.state.activeTab}
        />
         <FlatList
         ref={ref => this.elementIndex = ref}
         data={this.state.tabsData}
         renderItem={this.searchedData}
        //  ListEmptyComponent={this.ListEmptyComponent}
        //  ListFooterComponent={this.ListFooterComponent}
       />
       </View>  
        }
      </View>
    )
  }
}

const mapStateToProps = state =>{
  return{
    languageName: state.updateVersion.language,
    languageCode:state.updateVersion.languageCode,
    versionCode:state.updateVersion.versionCode,
    downloaded:state.updateVersion.downloaded,
    sourceId:state.updateVersion.sourceId,
    bookName:state.updateVersion.bookName,
    books:state.versionFetch.data,


    sizeFile:state.updateStyling.sizeFile,
    colorFile:state.updateStyling.colorFile,
  }
}
const mapDispatchToProps = dispatch =>{
  return {
    updateVersionBook:(value)=>dispatch(updateVersionBook(value)),
    updateVersion: (value)=>dispatch(updateVersion(value)),
    fetchVersionBooks:(value)=>dispatch(fetchVersionBooks(value)),
    

  }
}

export  default connect(mapStateToProps,mapDispatchToProps)(Search)
