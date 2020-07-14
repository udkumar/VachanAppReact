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
  TouchableWithoutFeedback,
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
import SelectionGrid from '../../components/SelectionGrid'
import Color from '../../utils/colorConstants'
import {getBookChaptersFromMapping} from '../../utils/UtilFunctions'

import {updateVersionBook} from '../../store/action/'


class EditNote extends Component {
  static navigationOptions = ({navigation}) =>({
    headerTitle:(<Text style={{fontSize:16,color:Color.White,fontWeight:'700',marginRight:12}}>Note</Text>),
    headerLeft:(<HeaderBackButton tintColor={Color.White} onPress={()=>navigation.state.params.handleBack()}/>),
    headerRight:(
      <TouchableOpacity style={{margin:8}} onPress={()=>navigation.state.params.handleAdd()}>
        <Text style={{fontSize:16,color:Color.White,fontWeight:'700',marginRight:12}}>Save</Text>
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
        contentBody:this.props.navigation.state.params.contentBody,
        modalVisible:false,
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
      console.log("bcvRef "+this.state.bcvRef)

      var firebaseRef = firebase.database().ref("users/"+this.props.uid+"/notes/"+this.props.sourceId+"/"+this.state.bcvRef.bookId)
      
        if(this.state.contentBody == ''){
          alert(" Note should not be empty")
        }
        else{
          var edit = firebase.database().ref("users/"+this.props.uid+"/notes/"+this.props.sourceId+"/"+this.state.bcvRef.bookId+"/"+this.state.bcvRef.chapterNumber)
          if(this.state.noteIndex != -1  ){
              var updates = {}
              updates["/"+this.state.noteIndex] = {
              createdTime:time,  
              modifiedTime:time, 
              body: this.state.contentBody,
              verses:this.state.bcvRef.verses
              }
              edit.update(updates)
          }
          else{
            console.log("NOTE INDEX ",this.state.bcvRef.verses)
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
          this.props.navigation.state.params.onbackNote()
          this.props.navigation.pop()
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
        if(this.state.contentBody !== this.props.navigation.state.params.contentBody
          || this.state.bcvRef.verses.length !== this.props.navigation.state.params.bcvRef.verses.length
          ){
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
  // add this function in second release
  // onAddVersePress=()=>{
  //   // if(this.state.totalVerses !== null ){
  //     var value = getBookNumOfVersesFromMapping(this.state.bcvRef.bookId,this.state.bcvRef.chapterNumber)
  //     this.setState({modalVisible:true,totalVerses:value})
  //   // }
  // }
  // closeModal =()=>{
  //   this.setState({modalVisible:false})
  // }
 
  // addVerseNumber=(item)=>{
  //   var value = this.state.bcvRef.verses.includes(item)
  //   if(value){
  //     Alert.alert("You have already added verse "+item)
  //   }else{
  //     var addBcvRef = this.state.bcvRef
  //     addBcvRef.verses.push(item)
  //     this.setState({bcvRef:addBcvRef,modalVisible:!this.state.modalVisible})
  //   }
  // }

  openReference=(index,value)=> {
    console.log(" bcv ref open ref",index)
    if(this.state.contentBody !== this.props.navigation.state.params.contentBody
      || this.state.bcvRef.verses.length !== this.props.navigation.state.params.bcvRef.verses.length
      ){
        Alert.alert(
          'Save Changes ? ',
          'Do you want to save the note ',
          [
            {text: 'Cancel', onPress: () => {return}},
            {text: 'No', onPress: () => { 
              this.props.updateVersionBook({
                bookId:this.state.bcvRef.bookId, 
                bookName:this.state.bcvRef.bookName,
                chapterNumber:this.state.bcvRef.chapterNumber,
                totalChapters:getBookChaptersFromMapping(this.state.bcvRef.bookId),
              })
              this.props.navigation.navigate("Bible") 
            }},
            {text: 'Yes', onPress: () => this.saveNote()},
          ],
        )
        return
      }
      this.props.updateVersionBook({
        bookId:this.state.bcvRef.bookId, 
        bookName:this.state.bcvRef.bookName,
        chapterNumber:this.state.bcvRef.chapterNumber,
        totalChapters:getBookChaptersFromMapping(this.state.bcvRef.bookId),
      })
      this.props.navigation.navigate('Bible')
  }
  //  add this function in second release
  // deleteReference=(index)=> {
  //   // if(this.state.bcvRef.verses.length == 1){
  //   //   this.props.navigation.dispatch(NavigationActions.back())
  //   // }
  //   this.state.bcvRef.verses.splice(index, 1)
  //   this.setState({bcvRef:this.state.bcvRef})
  // }

  render() {
    console.log(" note list ",this.state.bcvRef)
    return (
    <View style={{flex:1}}>
     <ScrollView style={this.styles.containerEditNote}>
      <View style={this.styles.subContainer}>
    
        {this.state.bcvRef 
          &&
          <FlowLayout style={this.styles.tapButton} 
          // ref="flow" 
            dataValue={this.state.bcvRef} 
            openReference={(index) => this.openReference(index)} 
            // deleteReference={(index) => this.deleteReference(index)}
            styles={this.styles}
          />
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
     </ScrollView> 
     {/**modal to add verses can be add in next release */}
     {/* <Modal
     animated={true}
     transparent={true}
     visible={this.state.modalVisible}>
     <View style={this.styles.modalMainView}>
     <TouchableWithoutFeedback
      onPressOut={this.closeModal}
      >
      <View style={this.styles.modalView}>
      <Text style={this.styles.modalText}>Add Verse</Text>
      <Icon
        name='cancel' onPress={this.closeModal}  
        size={28} color={Color.Blue_Color} style={this.styles.modalCloseIcon}
      />
      <SelectionGrid 
      styles={this.styles}
      onNumPress={this.addVerseNumber}
      numbers={Array.from(new Array(this.state.totalVerses), (x,i) => i+1)}
      loader={false}
      heighlightedNumber={1}
      />
      </View>
      </TouchableWithoutFeedback>
     </View>
   </Modal> */}
   </View>
    )
  }
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
    bookId:state.updateVersion.bookId,
    downloaded:state.updateVersion.downloaded,
    // bookId:state.editNote.bookId,
    // bookName:state.editNote.bookName,
    // bodyText:state.editNote.bodyText,
    // chapterNumber:state.editNote.chapterNumber,
    // index:state.editNote.index,
    
    sizeFile:state.updateStyling.sizeFile,
    colorFile:state.updateStyling.colorFile,
  }
}
const mapDispatchToProps = dispatch =>{
  return {
    updateVersionBook:(value)=>dispatch(updateVersionBook(value))
  }
}



export  default connect(mapStateToProps,mapDispatchToProps)(EditNote)
