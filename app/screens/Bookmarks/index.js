import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  FlatList,
  TextInput,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DbQueries from '../../utils/dbQueries'
import { bookStyle } from './styles.js'
import {updateVersionBook} from '../../store/action/'

import {getBookChaptersFromMapping} from '../../utils/UtilFunctions';
Dimensions.get('window').width
import {connect} from 'react-redux'
import firebase from 'react-native-firebase'


class BookMarks extends Component {
  static navigationOptions = {
    headerTitle: 'Bookmarks',
    // headerTitle: (
     
    // ),
    // headerRight:(
    //   <View style={{flexDirection:"row",justifyContent:"flex-end"}}>
    //   <TextInput
    //   // placeholder="Search"
    //   underlineColorAndroid = '#fff'
    //   placeholderTextColor={'#fff'} 
    //   returnKeyType="search"
    //   multiline={false}
    //   numberOfLines={1}
    //   style={{width:Dimensions.get('window').width/4}}
     
    // />
    //   <Icon name='search' color="#fff" size={28} style={{marginHorizontal:8}} />
    // </View>
    // )
    // headerRight:(
    //   // <SearchBar
    //   //   placeholder="Type Here..."
    //   //   onChangeText={this.updateSearch}
    //   //   value={search}
    //   // />
    // )
  };
  
  constructor(props) {
    super(props)
    
    // this.removeBookmark = this.removeBookmark.bind(this)
    // this.refreshData = this.refreshData.bind(this)

    this.state = {
      bookmarksList: [],
      isLoading:false,
      languageName:this.props.languageName,
      versionCode:this.props.versionCode,
      sourceId:this.props.sourceId,
      bookId:this.props.bookId
    }
    
    this.styles = bookStyle(this.props.colorFile, this.props.sizeFile);   
    // this.refreshData = this.refreshData.bind(this)
  }
  fecthBookmarks(){
    if(this.props.email){
      this.setState({isLoading:true},()=>{
        var firebaseRef = firebase.database().ref("users/"+this.props.uid+"/bookmarks/"+this.props.sourceId);
        firebaseRef.once('value', (snapshot)=> {
          var data=[]
            var list = snapshot.val()
            if(snapshot.val() != null){
              for(var key in list){
                data.push({bookId:key,chapterNumber:list[key]})
              }
              this.setState({
                bookmarksList:data,
                isLoading:false
              })
            }
            else{
              this.setState({
                bookmarksList:[],
                isLoading:false
              })
            }
          })
          this.setState({isLoading:false})
      })

    }
  }
  async componentDidMount(){
  this.fecthBookmarks()
  } 
  componentDidUpdate(prevProps, prevState){
    console.log("BOOK MARKS ",prevProps.books)
    if(prevProps.books !==this.props.books){
      this.fecthBookmarks()
    }
  }
  navigateToBible(bookId,bookName,chapter){
    this.props.updateVersionBook({
      bookId:bookId, 
      bookName:bookName,
      chapterNumber:chapter,
      totalChapters:getBookChaptersFromMapping(bookId),
    })
    this.props.navigation.navigate("Bible")
  }
    
  async onBookmarkRemove(id,chapterNum){
    if(this.props.email){
      var data =  this.state.bookmarksList
      data.filter((a,i) => {
          if(a.bookId == id ){
              a.chapterNumber.filter((b,j) => {
              if(b == chapterNum){
                var firebaseRef = firebase.database().ref("users/"+this.props.uid+"/bookmarks/"+this.props.sourceId+"/"+id);
                if(a.chapterNumber.length == 1){
                  console.log(" i ",i)
                  data.splice(i,1)
                  firebaseRef.remove()
                  return
                  // firebaseRef.set(a.chapterNumber)
                }
                else{
                   a.chapterNumber.splice(j,1)
                }
                firebaseRef.set(a.chapterNumber)
              }
              
            })
          }
        })
        this.setState({bookmarksList:data})
    }
  }
  renderItem = ({item, index}) => {
    var bookName = null 
    if (this.props.books){
      for(var i = 0; i<= this.props.books.length-1; i++){
        var bId = this.props.books[i].bookId
        // console.log(" BOOK ID IN BOKMARKS")
        if(bId == item.bookId){
         bookName = this.props.books[i].bookName
        }
      }
    }else{
        this.setState({bookmarksList:[]})
        return
    }
      var value = item.chapterNumber.length > 0 &&
        item.chapterNumber.map(e=>
        <TouchableOpacity style={this.styles.bookmarksView} onPress = { ()=> {this.navigateToBible(item.bookId,bookName,e)}} >
        <Text style={this.styles.bookmarksText}>{bookName} {":"} {e}</Text>
        <Icon name='delete-forever' style={this.styles.iconCustom}   
          onPress={() => {this.onBookmarkRemove(item.bookId,e)} } 
        />
        </TouchableOpacity>
      )
    return(
    <View>
      {bookName && value } 
    </View>
    )
    
  }
  render() {
    console.log(" book list ",this.props.books)
    return (
        <View style={this.styles.container}>
        {
        this.state.isLoading ? 
         <ActivityIndicator animate={true} style={{justifyContent:'center',alignSelf:'center'}}/> :
         <FlatList
         data={this.state.bookmarksList}
         contentContainerStyle={this.state.bookmarksList.length === 0 && this.styles.centerEmptySet}
         renderItem={ this.renderItem}
         ListEmptyComponent={
           <View style={this.styles.emptyMessageContainer}>
           <Icon name="collections-bookmark" style={this.styles.emptyMessageIcon} onPress={()=>{this.props.navigation.navigate("Bible")}}/>
             <Text
               style={this.styles.messageEmpty}
             >
              No Bookmark added
             </Text>
             
           </View>
         }
        /> 
        }
       </View>
    )
  }
}

const mapStateToProps = state =>{
  return{
    languageName: state.updateVersion.language,
    versionCode: state.updateVersion.versionCode,
    sourceId: state.updateVersion.sourceId,
    bookName: state.updateVersion.bookName,

    email:state.userInfo.email,
    uid:state.userInfo.uid,

    bookId:state.updateVersion.bookId,
    sizeFile:state.updateStyling.sizeFile,
    colorFile:state.updateStyling.colorFile,

    books:state.versionFetch.data,

  }
}
const mapDispatchToProps = dispatch =>{
  return {
    updateVersionBook:(value)=>dispatch(updateVersionBook(value))
  }
}

export  default connect(mapStateToProps,mapDispatchToProps)(BookMarks)

