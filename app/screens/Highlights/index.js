import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DbQueries from '../../utils/dbQueries'
import {getBookNameFromMapping,getBookChaptersFromMapping,getBookNumOfVersesFromMapping} from '../../utils/UtilFunctions';
import { highlightstyle } from './styles'
import {connect} from 'react-redux'
import {updateVersionBook} from '../../store/action/'
import firebase from 'react-native-firebase'


class HighLights extends Component {
  static navigationOptions = {
    headerTitle: 'Highlights',
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
  };

  constructor(props) {
    super(props)
    this.state = {
      HightlightedVerseArray:[],
    }
    this.styles = highlightstyle(this.props.colorFile, this.props.sizeFile);  
    
  }
  async getHighlights(){
    let model2 = await  DbQueries.queryHighlights(this.props.languageName,this.props.versionCode,null)
    if(model2  == null ){
    }
    else{
      if(model2.length > 0){
        console.log("model  ",model2)
        for(var i = 0; i<=model2.length-1;i++){
          this.setState({
            HightlightedVerseArray:[...this.state.HightlightedVerseArray,model2[i]]
          })
        }
      }
  }
  }
  removeHighlight = async(id,chapterNum,verseNum)=>{
    var data =  this.state.HightlightedVerseArray
    if(this.props.email){
    data.forEach((a,i) => {
        if(a.bookId == id && a.chapterNumber ==chapterNum){
            a.verseNumber.forEach((b,j) => {
            if(b == verseNum){
              var userId = firebase.auth().currentUser
              var firebaseRef = firebase.database().ref("users/"+userId.uid+"/highlights/"+this.props.sourceId+"/"+id);
              if(a.verseNumber.length == 1){
                console.log(" i ",j)
                data.splice(j,1)
                firebaseRef.remove()
                return
              }
              else{
                 a.verseNumber.splice(j,1)
              }
              firebaseRef.set(a.verseNumber)
            }
            
          })
        }
      })
      this.setState({HightlightedVerseArray:data})
  }
  else{
    await DbQueries.updateBookmarkInBook(this.state.sourceId,id,chapterNum,verseNum,false);
    data.forEach((a,i) => {
        if(a.bookId == id && a.chapterNumber ){
            a.verseNumber.forEach((b,j) => {
            if(b == verseNum){
              if(a.verseNumber.length == 1){
                console.log(" i ",i)
                 data.splice(i,1)
              }
              else{
                 a.verseNumber.splice(j,1)
              }
            }
          })
        }
      })
      this.setState({HightlightedVerseArray:data})
  }
  }
  componentDidMount(){
    if(this.props.email){
      var userId = firebase.auth().currentUser;
      var firebaseRef = firebase.database().ref("users/"+userId.uid+"/highlights/"+this.props.sourceId);
      firebaseRef.on('value', (snapshot)=> {
        console.log("VALUE HIGHLIGHTS ",snapshot.val())
        var highlights = snapshot.val()
        var array = []
        if(highlights != null){
          for(var key in highlights){
            for(var val in highlights[key]){
              array.push({bookId:key,chapterNumber:val,verseNumber:highlights[key][val]})

            }
          }
          this.setState({HightlightedVerseArray:array})
        }
        })
    }
    else{
      // let model2 = await  DbQueries.queryHighlights(sourceId,null,null)
      // console.log("verse number ")
      // if(model2  != null ){
    //     if(model2.length > 0){
    //       console.log("model  ",model2)
    //       for(var i = 0; i<=model2.length-1;i++){
    //         this.setState({
    //           HightlightedVerseArray:[...this.state.HightlightedVerseArray,model2[i]]
    //         })
    //       }
    //     }
    // }
    }
    // this.getHighlights()
  }
  navigateToBible=(bId,chapterNum,verseNum)=>{
    console.log("item HIGHIGHTS ",item)
    this.props.updateVersionBook({
      bookId:bId, 
      bookName:getBookNameFromMapping(bId,this.props.languageName),
      chapterNumber:chapterNum,
      totalChapters:getBookChaptersFromMapping(bId),
      totalVerses:getBookNumOfVersesFromMapping(bId,chapterNum),
      verseNumber:verseNum
    })
    this.props.navigation.navigate("Bible")
  }
  render() {
    console.log("langugueg name ",this.state.HightlightedVerseArray)
    return (
      <View style={this.styles.container}>
      {this.state.HightlightedVerseArray.length > 0 &&
      <FlatList
      data={this.state.HightlightedVerseArray}
      contentContainerStyle={this.state.HightlightedVerseArray.length === 0 && this.styles.centerEmptySet}
      renderItem={({item, index}) => 
        <View>{
          item.verseNumber.length > 0 &&
          item.verseNumber.map(e=>
           <TouchableOpacity style={this.styles.bookmarksView} onPress = { ()=> {this.navigateToBible(item.bookId,item.chapterNumber,e)}} >
           <Text style={this.styles.bookmarksText}>{getBookNameFromMapping(item.bookId,this.props.languageName)}  {":"} {item.chapterNumber} {":"} {e}</Text>
           <Icon name='delete-forever' style={this.styles.iconCustom}   
             onPress={() => {this.removeHighlight(item.bookId,item.chapterNumber,e)} } 
           />
           </TouchableOpacity>
         )}
        </View>
      }
      ListEmptyComponent={
        <View style={this.styles.emptyMessageContainer}>
        <Icon name="collections-bookmark" style={this.styles.emptyMessageIcon}/>
          <Text
            style={this.styles.messageEmpty}
          >
           No Bookmark added
          </Text>
          
        </View>
      }
      extraData={this.props}
    />
      } 
     
     </View>
    );
  }
}

const mapStateToProps = state =>{
  return{
    languageName: state.updateVersion.language,
    versionCode:state.updateVersion.versionCode,
    bookId:state.updateVersion.bookId,
    sourceId: state.updateVersion.sourceId,
    email:state.userInfo.email,


    sizeFile:state.updateStyling.sizeFile,
    colorFile:state.updateStyling.colorFile,
  }
}
const mapDispatchToProps = dispatch =>{
  return {
    updateVersionBook:(value)=>dispatch(updateVersionBook(value))
  }
}

export  default connect(mapStateToProps,mapDispatchToProps)(HighLights)