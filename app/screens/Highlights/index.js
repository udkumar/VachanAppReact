import React, { Component } from 'react';
import {
  Text,
  View,
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
          this.setState({HightlightedVerseArray:array})
        }
        })
    }
  }
  navigateToBible=(bId,chapterNum,verseNum)=>{
    // console.log("item HIGHIGHTS ",item)
    this.props.updateVersionBook({
      bookId:bId, 
      bookName:this.props.bookName,
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
      {this.state.HightlightedVerseArray.length > 0 ?
      <FlatList
      data={this.state.HightlightedVerseArray}
      contentContainerStyle={this.state.HightlightedVerseArray.length === 0 && this.styles.centerEmptySet}
      renderItem={({item, index}) => 
        <View>{
          item.verseNumber  &&
          item.verseNumber.map(e=>
           <TouchableOpacity style={this.styles.bookmarksView} onPress = { ()=> {this.navigateToBible(item.bookId,item.chapterNumber,e)}} >
           <Text style={this.styles.bookmarksText}>{this.props.bookName}  {":"} {item.chapterNumber} {":"} {e}</Text>
           <Icon name='delete-forever' style={this.styles.iconCustom}   
             onPress={() => {this.removeHighlight(item.bookId,item.chapterNumber,e)}} 
           />
           </TouchableOpacity>
         )}
        </View>
      }
     
      extraData={this.props}
    />
    :
    <View style={this.styles.emptyMessageContainer}>
    <Icon name="collections-bookmark" style={this.styles.emptyMessageIcon}/>
      <Text
        style={this.styles.messageEmpty}
      >
       No Highlight added
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
    versionCode:state.updateVersion.versionCode,
    bookId:state.updateVersion.bookId,
    bookName:state.updateVersion.bookName,
    sourceId: state.updateVersion.sourceId,
    email:state.userInfo.email,
    uid:state.userInfo.uid,


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