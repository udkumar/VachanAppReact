import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  TouchableOpacity,
  Alert,
  ToastAndroid,
  Modal,
  TouchableHighlight,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import FlowLayout from '../../components/FlowLayout'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { HeaderBackButton, NavigationActions } from 'react-navigation';
// import {RichTextEditor, actions} from 'react-native-zss-rich-text-editor';
// import RichTextToolbar from '../../utils/RichTextToolbar'
const height = Dimensions.get('window').height;
import { noteStyle } from './styles.js';
import DbQueries from '../../utils/dbQueries'
import APIFetch from '../../utils/APIFetch'
import {connect} from 'react-redux'
import Spinner from 'react-native-loading-spinner-overlay';
import firebase from 'react-native-firebase'
import Color from '../../utils/colorConstants'



class EditNote extends Component {
  static navigationOptions = ({navigation}) =>({
    headerTitle: 'Edit Note',
    headerLeft:(<HeaderBackButton tintColor={Color.White} onPress={()=>navigation.state.params.handleBack()}/>),
    headerRight:(
      <TouchableOpacity style={{margin:8}} onPress={()=>navigation.state.params.handleAdd()}>
        <Text style={{fontSize:16,color:Color.White,fontWeight:'700',marginRight:12}}>DONE</Text>
      </TouchableOpacity>
      ),
    
  });

  constructor(props){
    super(props);
    console.log(" props in EDIT PAGE ",this.props.navigation.state.params)
    this.state = {
        noteIndex: this.props.navigation.state.params.noteIndex,
        noteObject:this.props.navigation.state.params.notesList,
        // notesList:
        bcvRef:this.props.navigation.state.params.bcvRef,
        isLoading:false,
        contentBody:this.props.navigation.state.params.contentBody
    }
    this.styles = noteStyle(props.colorFile, props.sizeFile);  
    this.getHtml = this.getHtml.bind(this);
    this.setFocusHandlers = this.setFocusHandlers.bind(this);
  }

  onEditorInitialized() {
    this.setFocusHandlers();
    // this.getHtml();
  }

  async getHtml() {
    const body = await this.richtext.getContentHtml();
    if(body==''){
    return body
    }
    return JSON.stringify(body)
  }

  setFocusHandlers() {
    this.richtext.setContentFocusHandler(() => {
      //alert('content focus');
    });
  }

  saveNote = async () =>{
      var time =  Date.now()
      console.log("time "+time)
      var firebaseRef = firebase.database().ref("users/"+this.props.uid+"/notes/"+this.props.sourceId+"/"+this.state.bcvRef.bookId)
      
        if(this.state.contentBody == ''){
          alert(" Note should not be empty")
        }
        else{
          var edit = firebase.database().ref("users/"+this.props.uid+"/notes/"+this.props.sourceId+"/"+this.state.bcvRef.bookId+"/"+this.state.bcvRef.chapterNumber)
          console.log(" noteObject  ",this.state.noteObject,this.state.noteIndex)
          if(this.state.noteIndex != -1  ){
            if(this.props.navigation.state.params.contentBody  != this.state.contentBody){
              var updates = {}
              updates["/"+this.state.noteIndex] = {
              createdTime:time,  
              modifiedTime:time, 
              body: this.state.contentBody,
              verses:this.state.bcvRef.verses
              }
              edit.update(updates)
            }
          }
          else{
            console.log("notes object ",this.state.noteObject)
              var notesArray = this.state.noteObject.concat({
              createdTime:time,  
              modifiedTime:time, 
              body: this.state.contentBody,
              verses:this.state.bcvRef.verses
            })
              var updates = {}
              updates[this.state.bcvRef.chapterNumber] = notesArray
              firebaseRef.update(updates)
          }
     
          this.props.navigation.state.params.onbackNote([],this.state.contentBody)
          this.props.navigation.dispatch(NavigationActions.back())
        }
  }

  showAlert() {
    Alert.alert(
      'Save Changes ? ',
      'Do you want to save the note ',
      [
        {text: 'Cancel', onPress: () => {return}},
        {text: 'No', onPress: () => { this.props.navigation.dispatch(NavigationActions.back()) }},
        {text: 'Yes', onPress: () => this.saveNote()},
      ],
    )
  }

  onBack = async () =>{
      if (this.state.noteIndex == -1) {
        if(this.state.contentBody == '' ){
          // alert("body should not be empty")
        }
          this.showAlert();
          return
      } 
      else {
        console.log("1 ",this.state.contentBody," 2 ", this.state.noteObject)
        if(this.state.contentBody !== this.props.navigation.state.params.contentBody){
            this.showAlert();
          return
        }
        this.props.navigation.dispatch(NavigationActions.back())
      }
      
  }

  // checkRefArrayEqual() {
  //   let initArray = this.props.navigation.state.params.noteObject.references;
  //   let nowArray = this.state.referenceList;
  //   if (initArray.length != nowArray.length) {
  //     return false;
  //   }
  //   for (var i=0; i<initArray.length; i++) {
  //     if (initArray[i].bookId != nowArray[i].bookId ||
  //         initArray[i].bookName != nowArray[i].bookName ||
  //         initArray[i].chapterNumber != nowArray[i].chapterNumber ||
  //         initArray[i].verseNumber != nowArray[i].verseNumber) {
  //           return false;
  //     }
  //   }
  //   return true;
  // }

  componentDidMount() {
    this.props.navigation.setParams({ handleAdd: this.saveNote})
    this.props.navigation.setParams({ handleBack: this.onBack})
  }
  
  // openReference=(index)=> {
  //   console.log(" bcv ref open ref",this.state.bcvRef)
  //   this.props.navigation.navigate('Bible', {bookId: this.state.bcvRef.bookId, 
  //     chapterNumber: this.state.bcvRef.chapterNumber, verseNumber: this.state.bcvRef.verses[index]})
  // }

  // deleteReference=(index)=> {
  //   // if(this.state.bcvRef.verses.length == 1){
  //   //   this.props.navigation.dispatch(NavigationActions.back())
  //   // }
  //   this.state.bcvRef.verses.splice(index, 1)
  //   // this.setState({bcvRef:this.state.bcvRef})
  // }

  render() {
    // console.log(" note list ",this.props.navigation.state.params.notesList)
    return (
     <ScrollView style={this.styles.containerEditNote}>
      <View style={this.styles.subContainer}>
      {/* {this.state.isLoading &&
        <Spinner
        visible={this.state.isLoading}
        textContent={'Loading...'}
        // textStyle={styles.spinnerTextStyle}
        />} */}
        {this.state.bcvRef 
          ? 
          <FlowLayout style={this.styles.tapButton} 
          // ref="flow" 
            dataValue={this.state.bcvRef} 
            openReference={(index) => this.openReference(index)} 
            deleteReference={(index) => this.deleteReference(index)}
            styles={this.styles}
          />
          : 
          <Text style={this.styles.tapButton}>Tap button to add references</Text> 
         
        }
        {/* <Icon name="add-circle" style={this.styles.addIconCustom} size={28} color="gray" onPress={this.onAddVersePress} /> */}
      </View>
      <TextInput
      style={this.styles.inputStyle}
      placeholder='Enter your note here'
      placeholderTextColor={this.styles.placeholderColor.color}
      value={this.state.contentBody}
      onChangeText={(text)=>this.setState({contentBody:text})}
      multiline={true}
      />
      {/* <View style={this.styles.textEditorView}>

        <RichTextEditor
          style={this.styles.richTextEditor}
          ref={(r)=>this.richtext = r}
          hiddenTitle={true}
          contentPlaceholder="New Note"
          initialContentHTML={this.state.noteBody}
          editorInitializedCallback={() => this.onEditorInitialized()}
        />
        <RichTextToolbar
          ref={(r)=>this.toolbar = r}
          getEditor={() => this.richtext}
          renderAction={this._renderToolbarItem}
          actions={[
            actions.setBold,
            actions.setItalic,
            actions.setUnderline,
            actions.setStrikethrough,
            actions.insertBulletsList,
            actions.insertOrderedList
          ]}
        />
      </View> */}

     </ScrollView> 
    )
  }

  // _renderToolbarItem (action,selected, method){
  //   let iconName = 'format-bold'
  //   switch(action) {
  //     case actions.setBold: {
  //       iconName = "format-bold"
  //       break
  //     }
  //     case actions.setItalic: {
  //       iconName = "format-italic"
  //       break
  //     }
  //     case actions.setUnderline: {
  //       iconName = "format-underlined"
  //       break
  //     }
  //     case actions.setStrikethrough: {
  //       iconName = "format-strikethrough"
  //       break
  //     }
  //     case actions.insertBulletsList: {
  //       iconName = "format-list-bulleted"
  //       break
  //     }
  //     case actions.insertOrderedList: {
  //       iconName = "format-list-numbered"
  //       break
  //     }
  //   }

  //   return(
  //     <Icon name={iconName} 
  //     size={28} 
  //     color={selected ? 'black' : 'white'} 
  //     style={[
  //       // this.styles.iconCustom,
  //       {backgroundColor: selected ? 'white': 'transparent', margin:8, 
  //       padding:8, }
  //     ]}
  //       onPress={method} 
  //     />
  //   );
  // }
}

const mapStateToProps = state =>{
  return{
    language:state.updateVersion.language,
    versionCode:state.updateVersion.versionCode,
    sourceId:state.updateVersion.sourceId,

    email:state.userInfo.email,
    uid:state.userInfo.uid,

    chapterNumber:state.updateVersion.chapterNumber,
    totalChapters:state.updateVersion.totalChapters,
    totalVerses:state.updateVersion.totalVerses,
    bookId:state.updateVersion.bookId,
    downloaded:state.updateVersion.downloaded,
    // bookId:state.editNote.bookId,
    // bookName:state.editNote.bookName,
    // bodyText:state.editNote.bodyText,
    // chapterNumber:state.editNote.chapterNumber,
    // verseNumber: state.editNote.verseNumber,
    // index:state.editNote.index,
    
    sizeFile:state.updateStyling.sizeFile,
    colorFile:state.updateStyling.colorFile,
  }
}



export  default connect(mapStateToProps,null)(EditNote)
