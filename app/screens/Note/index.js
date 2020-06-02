import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  Dimensions,
  FlatList,
  WebView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Card, CardItem, Content, Right, Left } from 'native-base';
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
import DbQueries from '../../utils/dbQueries'
import {connect} from 'react-redux'
import firebase from 'react-native-firebase'


import { noteStyle } from './styles.js';
import { array } from 'prop-types';
import { ScrollView } from 'react-native-gesture-handler';

var moment = require('moment');

class Note extends Component {

  static navigationOptions = ({navigation}) => ({
    headerTitle: 'Notes',
    // headerRight:(
    //   <TouchableOpacity style={{margin:8}} onPress={() => navigation.state.params.newNote(-1)}>
    //      <Icon name="note-add" size={24} color="#fff"/>
    //  </TouchableOpacity>
    // )
  });

  constructor(props){
    super(props)
    this.state = {
      colorFile:this.props.colorFile,
      sizeFile:this.props.sizeFile,
      notesData:[],
      referenceList:[],
    }
    this.styles = noteStyle(props.colorFile, props.sizeFile);   
    
    this.queryDb = this.queryDb.bind(this)
    this.onDelete = this.onDelete.bind(this)
  }

 
  
  // createNewNote = (index) => {
  //   this.props.navigation.navigate('EditNote',{
  //     noteIndex:index, 
  //     noteObject: null,
  //     onDelete: this.onDelete, 
  //     onRefresh: this.onRefresh, 
  //     onbackNote:this.queryDb,
  //     queryDb:this.queryDb,
  //     referenceList:  this.props.navigation.state.params.referenceList,
  //     bookId: this.props.bookId,
  //     chapterNumber:1,
  //     totalVerses:null
  //   })
  // };

  onDelete=(createdTime,body,k,l) =>{
    var data =  [...this.state.notesData]
    data.forEach((a,i) => {
    var firebaseRef = firebase.database().ref("users/"+this.props.uid+"/notes/"+this.props.sourceId+"/"+a.bookId)
      if( i == k ){
        console.log("A ",a.notes.length)
          a.notes.forEach((b,j)=>{
            if(b.body == body && j==l && createdTime == b.createdTime){
              var updates = {}
              if(a.notes.length == 1){
                data.splice(i,1)
                  updates[a.chapterNumber] = null
                  firebaseRef.update(updates)
              }
              else{
                a.notes.splice(j,1)
                updates[a.chapterNumber] = a.notes
                firebaseRef.update(updates)
              }
            }
          })
      }
    })
    this.setState({notesData:data})
  }

  // async onRefresh(noteIndex, noteBody, crTime, moTime, refList) {
  //   console.log("on refresh, text " + noteBody)
  //   await DbQueries.addOrUpdateNote(noteIndex, noteBody, crTime, moTime, refList);
  //   // this.queryDb()
  // }

  queryDb(){
    if(this.props.email){
      var firebaseRef = firebase.database().ref("users/"+this.props.uid+"/notes/"+this.props.sourceId)
      firebaseRef.once('value', (snapshot)=>{
        if(snapshot.val() === null){
          this.setState({notesData:[]})
        } 
        else{
          var arr =[]
          var notes = snapshot.val()
          // console.log( " log Notes ",snapshot.val())
          for(var bookKey in notes){
            for(var chapterKey in notes[bookKey]){
              if(notes[bookKey][chapterKey] != null){
                arr.push({bookId:bookKey,chapterNumber:chapterKey,notes:Array.isArray(notes[bookKey][chapterKey]) ? notes[bookKey][chapterKey] : [notes[bookKey][chapterKey]]})
              }
            }
          }
          this.setState({
            notesData:arr
          })
        }
      })
    }
    else{
      console.log("not logged in")
    }
  }
  componentDidMount(){
      this.queryDb()
  }

  // openNoteContent = ()=>{
    //  openNoteContent = (note,bodyText)=>{
  //   this.props.navigation.navigate("NotePage",{
  //     bodyText:bodyText,
  //     note:note,
  //     onDelete: this.onDelete, 
  //     onRefresh: this.onRefresh, 
  //     referenceList:  this.props.navigation.state.params.referenceList,
  //     bookId: this.state.bookId,
  //     versionCode: this.state.versionCode,
  //     languageName: this.state.languageName,
  //   })
  // }
  //   this.props.navigation.navigate("NotePage",{notesData:this.state.notesData})
  // }
  bodyText(text){
    var jparse = text == '' ? '' : text
    var strParse = jparse.replace(/<(?:.|\n)*?>/gm, '');
    var strParse1 = strParse.replace('&nbsp', ' ')
    return strParse1 == '' ? 'No additional text' : strParse1
  }
  dateFormate(modifiedTime){
    var date = new Date(modifiedTime);
    return date.getHours() < 24  ? moment(modifiedTime).fromNow() : moment(modifiedTime).format('DD-MMM');  
  }
  renderItem = ({item,index})=>{
    return(
      item.notes && item.notes.map((val,j) =>
          <TouchableOpacity style={this.styles.noteContent}
          onPress={()=>{this.props.navigation.navigate("EditNote",{
            bcvRef:{
              bookId:item.bookId, 
              chapterNumber:item.chapterNumber , 
              verses:val.verses
              }, 
            notesList:item.notes,
            contentBody:this.bodyText(val.body),
            // noteObject:item.notes,
            onbackNote:this.queryDb,
            noteIndex:j,
          })}}>
        <Card>
        <CardItem style={this.styles.cardItemStyle}>
          <View style={this.styles.notesContentView}> 
            <Text style={this.styles.noteFontCustom} numberOfLines={2}>{this.bodyText(val.body)}</Text>
            <View style={this.styles.noteCardItem}>
              <Text style={this.styles.noteFontCustom}>{this.dateFormate(val.modifiedTime)}</Text>
              <Icon name="delete-forever" style={this.styles.deleteIon} onPress={()=>this.onDelete(val.createdTime,val.body,index,j)}/>
            </View>
          </View>
          </CardItem>
          
        </Card>
      </TouchableOpacity>
    // )
      )
    )
 }

  render() {
    console.log(" NOTES DATA ",this.state.notesData)
    return (
      <View style={this.styles.container}>
        {this.state.notesData.length > 0 ?
      <ScrollView>
      <FlatList
        // contentContainerStyle={this.state.notesData.length === 0 
        //   ? this.styles.centerEmptySet: this.styles.noteFlatlistCustom}
        data={this.state.notesData}
        renderItem={this.renderItem}
        // ListEmptyComponent={
        //   <TouchableOpacity onPress={()=>this.createNewNote(-1)} 
        //     style={this.styles.emptyMessageContainer}>
        //     <Icon name="note-add"  style={this.styles.emptyMessageIcon} />
        //     <Text style={this.styles.messageEmpty}>Tap to create a new note</Text>
        //   </TouchableOpacity>
        // }
      />
      </ScrollView>
      :
        <View style={this.styles.emptyMessageContainer}>
        <Icon name="note-add" style={this.styles.emptyMessageIcon}/>
          <Text
            style={this.styles.messageEmpty}
          >
           No Note added
          </Text>
          
        </View>
      }
      </View>
    );
  }
}

const mapStateToProps = state =>{
  return{
    sizeFile:state.updateStyling.sizeFile,
    colorFile:state.updateStyling.colorFile,
    sourceId:state.updateVersion.sourceId,
    email:state.userInfo.email,
    uid:state.userInfo.uid,

  }
}

export  default connect(mapStateToProps,null)(Note)
// const mapStateToProps = state =>{
//   return{
//     language:state.updateVersion.language,
//     version:state.updateVersion.versionCode,
//     sourceId:state.updateVersion.sourceId,

//     // bookId:state.editNote.bookId,
//     // bookName:state.editNote.bookName,
//     // bodyText:state.editNote.bodyText,
//     // chapterNumber:state.editNote.chapterNumber,
//     // verseNumber: state.editNote.verseNumber,
//     // index:state.editNote.index,
//     // referenceNote:state.editNote.referenceNote,
    
//   }
// }

// // const mapDispatchToProps = dispatch =>{
// //   return {
// //     updateNoteBody:(text)=>dispatch(updateNoteBody(text))
// //   }
// // }


// export  default connect(mapStateToProps,mapDispatchToProps)(EditNote)