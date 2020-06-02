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

import {getBookNameFromMapping,getBookChaptersFromMapping,getBookNumOfVersesFromMapping} from '../../utils/UtilFunctions';
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

  async componentDidMount(){
    if(this.props.email){
      var firebaseRef = firebase.database().ref("users/"+this.props.uid+"/bookmarks/"+this.props.sourceId);
      firebaseRef.once('value', (snapshot)=> {
        var data=[]
          var list = snapshot.val()
          if(snapshot.val() !=null){
            for(var key in list){
              data.push({bookId:key,chapterNumber:list[key]})
            }
            this.setState({
              bookmarksList:data
            })
          }
        })
    }
    // else{
    //   let model = await  DbQueries.queryBookmark(this.state.sourceId,null)
    //   console.log(" not logged in ",model)
    //     // { bookId: 'deu',chapterNumber: { '0': 10, '1': 11, '2': 12, '3': 14 } }
    //   if (model != null) {
    //     if(model.length > 0){
    //       var data =[]
    //       for(var i=0;i<=model.length-1;i++){
    //       var chapters =[]
    //         data.push({bookId:model[i].bookId,chapterNumber:chapters})
    //         for(var key in model[i].chapterNumber){
    //           chapters.push(model[i].chapterNumber[key])
    //         }
    //       }
    //       this.setState({bookmarksList:data})
    //     }
    //   }
    // }
  } 
  navigateToBible(bookId,chapter){
    this.props.updateVersionBook({
      bookId:bookId, 
      bookName:getBookNameFromMapping(bookId,this.props.languageName),
      chapterNumber:chapter,
      totalChapters:getBookChaptersFromMapping(bookId),
      totalVerses:getBookNumOfVersesFromMapping(bookId,chapter),
      // verseNumber:verseNumber
    })
    this.props.navigation.navigate("Bible")
  }
  // getItemLayout = (data, index) => {
  //   return { length: height, offset: height * index, index };
  // }

    
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
    // else{
    //   await DbQueries.updateBookmarkInBook(this.state.sourceId,id,chapterNum,false);
    //   var data =  this.state.bookmarksList
    //   data.filter((a,i) => {
    //       if(a.bookId == id ){
    //           a.chapterNumber.filter((b,j) => {
    //           if(b == chapterNum){
    //             if(a.chapterNumber.length == 1){
    //               console.log(" i ",i)
    //                data.splice(i,1)
    //             }
    //             else{
    //                a.chapterNumber.splice(j,1)
    //             }
    //           }
    //         })
    //       }
    //     })
    //     this.setState({bookmarksList:data})
    // }
  
  }

  render() {
    console.log(" book list ",this.state.bookmarksList)
    return (
        <View style={this.styles.container}>
         {this.state.bookmarksList.length > 0 ?
         <FlatList
         data={this.state.bookmarksList}
         contentContainerStyle={this.state.bookmarksList.length === 0 && this.styles.centerEmptySet}
         renderItem={({item, index}) => 
           <View>{
             item.chapterNumber.length > 0 &&
             item.chapterNumber.map(e=>
              <TouchableOpacity style={this.styles.bookmarksView} onPress = { ()=> {this.navigateToBible(item.bookId,e)}} >
              <Text style={this.styles.bookmarksText}>{getBookNameFromMapping(item.bookId,this.props.languageName)} {":"} {e}</Text>
              <Icon name='delete-forever' style={this.styles.iconCustom}   
                onPress={() => {this.onBookmarkRemove(item.bookId,e)} } 
              />
              </TouchableOpacity>
            )}
           </View>
         }
        //  ListEmptyComponent={
        //    <View style={this.styles.emptyMessageContainer}>
        //    <Icon name="collections-bookmark" style={this.styles.emptyMessageIcon}/>
        //      <Text
        //        style={this.styles.messageEmpty}
        //      >
        //       No Bookmark added
        //      </Text>
             
        //    </View>
        //  }
         extraData={this.props}
       /> : 
       <View style={this.styles.emptyMessageContainer}>
           <Icon name="collections-bookmark" style={this.styles.emptyMessageIcon}/>
            <Text
             style={this.styles.messageEmpty}
           >
               No Bookmark added
            </Text>
             
           </View> 
         } 
        </View>
    );
  }
}

const mapStateToProps = state =>{
  return{
    languageName: state.updateVersion.language,
    versionCode: state.updateVersion.versionCode,
    sourceId: state.updateVersion.sourceId,
    email:state.userInfo.email,
    uid:state.userInfo.uid,

    bookId:state.updateVersion.bookId,
    sizeFile:state.updateStyling.sizeFile,
    colorFile:state.updateStyling.colorFile,
  }
}
const mapDispatchToProps = dispatch =>{
  return {
    updateVersionBook:(value)=>dispatch(updateVersionBook(value))
  }
}

export  default connect(mapStateToProps,mapDispatchToProps)(BookMarks)

