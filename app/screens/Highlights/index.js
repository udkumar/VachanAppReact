import React, { Component } from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DbQueries from '../../utils/dbQueries'
import {getBookChaptersFromMapping,getBookNumOfVersesFromMapping} from '../../utils/UtilFunctions';
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
      isLoading:false
    }
    this.styles = highlightstyle(this.props.colorFile, this.props.sizeFile);  
    
  }
  async getHighlights(){
    let model2 = await  DbQueries.queryHighlights(this.props.languageName,this.props.versionCode,null)
    if(model2  == null ){
    }
    else{

  }
  }
  removeHighlight = (id,chapterNum,verseNum)=>{
    var data =  this.state.HightlightedVerseArray
      index = -1
      data.forEach((a,i) => {
            if(a.bookId == id && a.chapterNumber == chapterNum){
            a.verseNumber.forEach(async(b,j) => {
            if(b == verseNum){
              // if(this.props.email == null){
              //   await DbQueries.updateHighlightsInVerse(this.props.sourceId,id,chapterNum,verseNum, false)
              // }
              if(a.verseNumber.length == 1){
                if(this.props.emai){
                  firebase.database().ref("users/"+this.props.uid+"/highlights/"+this.props.sourceId+"/"+id+"/"+chapterNum).remove()
                }
                data.splice(i,1)
              }
              else{
                a.verseNumber.splice(j,1)
                index = i
              }
            }
          })
         
        }
    })
    var updates = {}
    console.log(" index ",index)
    if(index !=-1){
      updates[chapterNum] = data[index].verseNumber
      firebase.database().ref("users/"+this.props.uid+"/highlights/"+this.props.sourceId+"/"+id).update(updates)
    }
  // }
  this.setState({HightlightedVerseArray:data})
  }
  async componentDidMount(){
    if(this.props.email){
      this.setState({isLoading:true},()=>{
        firebase.database().ref("/users/"+this.props.uid+"/highlights/"+this.props.sourceId+"/").once('value', (snapshot)=> {
          var highlights = snapshot.val()
          console.log("HIGHLIGHTED VERSES ",snapshot.val())
          var array = []
          if(highlights != null){
            for(var key in highlights){
              for(var val in highlights[key]){
                console.log(" highlight null ",highlights[key][val])
                if(highlights[key][val] !=null){
                  array.push({bookId:key,chapterNumber:val,verseNumber:highlights[key][val]})
                }
              }
            }
            this.setState({HightlightedVerseArray:array,isLoading:false})
          }else{
            this.setState({HightlightedVerseArray:[],isLoading:false})
          }
          })
          this.setState({isLoading:false})
      })

    }
  }
  navigateToBible=(bId,bookName,chapterNum,verseNum)=>{
    // console.log("item HIGHIGHTS ",item)
    this.props.updateVersionBook({
      bookId:bId, 
      bookName:bookName,
      chapterNumber:chapterNum,
      totalChapters:getBookChaptersFromMapping(bId),
      totalVerses:getBookNumOfVersesFromMapping(bId,chapterNum),
      verseNumber:verseNum
    })
    this.props.navigation.navigate("Bible")
  }
  renderItem = ({item,index})=>{ 
    var bookName = null 
    if (this.props.books){
      for(var i = 0; i<= this.props.books.length-1; i++){
        var bId = this.props.books[i].bookId
        if(bId == item.bookId){
         bookName = this.props.books[i].bookName
        }
      }
    }
    let value = item.verseNumber  &&
      item.verseNumber.map(e=>
        <TouchableOpacity style={this.styles.bookmarksView} onPress = { ()=> {this.navigateToBible(item.bookId,bookName,item.chapterNumber,e)}} >
        <Text style={this.styles.bookmarksText}>{bookName}  {":"} {item.chapterNumber} {":"} {e}</Text>
        <Icon name='delete-forever' style={this.styles.iconCustom}   
          onPress={() => {this.removeHighlight(item.bookId,item.chapterNumber,e)}} 
        />
        </TouchableOpacity>
      )
      return(
      <View>{value}</View>
      )
  }
  render() {
    console.log("langugueg name ",this.state.HightlightedVerseArray)
    return (
      <View style={this.styles.container}>
      {this.state.isLoading ? 
      <ActivityIndicator animate={true} style={{justifyContent:'center',alignSelf:'center'}}/> :
      <FlatList
      data={this.state.HightlightedVerseArray}
      contentContainerStyle={this.state.HightlightedVerseArray.length === 0 && this.styles.centerEmptySet}
      renderItem={this.renderItem}
      ListEmptyComponent={
        <View style={this.styles.emptyMessageContainer}>
        <Icon name="border-color" style={this.styles.emptyMessageIcon} onPress={()=>{this.props.navigation.navigate("Bible")}}/>
          <Text
            style={this.styles.messageEmpty}>
           Select verse to Highlight
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
    bookName:state.updateVersion.bookName,
    sourceId: state.updateVersion.sourceId,
    email:state.userInfo.email,
    uid:state.userInfo.uid,


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

export  default connect(mapStateToProps,mapDispatchToProps)(HighLights)