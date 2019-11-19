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
import {RichTextEditor, actions} from 'react-native-zss-rich-text-editor';
import RichTextToolbar from '../../utils/RichTextToolbar'
const height = Dimensions.get('window').height;
import { noteStyle } from './styles.js';
import DbQueries from '../../utils/dbQueries'
import APIFetch from '../../utils/APIFetch'
import {connect} from 'react-redux'
import Spinner from 'react-native-loading-spinner-overlay';


class EditNote extends Component {
  static navigationOptions = ({navigation}) =>({
    headerTitle: 'Edit Note',
    headerLeft:(<HeaderBackButton tintColor='white' onPress={()=>navigation.state.params.handleBack()}/>),
    headerRight:(
      <TouchableOpacity style={{margin:8}} onPress={()=>navigation.state.params.handleAdd()}>
        <Text style={{fontSize:12,color:'#fff'}}>DONE</Text>
      </TouchableOpacity>
      ),
    
  });

  constructor(props){
    super(props);
    this.state = {
        noteIndex: this.props.navigation.state.params.noteIndex,
        noteObject:this.props.navigation.state.params.noteObject,
        noteBody: this.props.navigation.state.params.noteIndex == -1 ? '' : this.props.navigation.state.params.noteObject.body == '' ? '' : JSON.parse(this.props.navigation.state.params.noteObject.body),
        referenceList:this.props.navigation.state.params.noteIndex == -1 
          ? [] 
          : this.props.navigation.state.params.referenceList,
        // todo here fix reference list
        referenceList2: this.props.navigation.state.params.referenceList,
        isLoading:false
    }

    this.styles = noteStyle(props.colorFile, props.sizeFile);   
    
    this.getReference = this.getReference.bind(this)
    this.openReference = this.openReference.bind(this)
    this.deleteReference = this.deleteReference.bind(this)
    this.onChangeText = this.onChangeText.bind(this)

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
    var time =  new Date()
    console.log("time "+time)
    var contentBody = await this.getHtml()

    if (contentBody == '' && this.state.referenceList.length == 0) {
      if(this.state.noteIndex != -1){
        // delete note
        this.props.navigation.state.params.onDelete(this.state.noteIndex, this.state.noteObject.createdTime)
      }
    } else {
      console.log("add new note ",contentBody)
      await DbQueries.addOrUpdateNote(this.state.noteIndex, contentBody, 
      this.state.noteIndex == -1 ? time : this.state.noteObject.createdTime, time, this.state.referenceList);
      this.props.navigation.state.params.onbackNote(this.state.referenceList,contentBody)
    }
    this.props.navigation.dispatch(NavigationActions.back())
    // this.props.navigation.goBack()
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
    var contentBody = await this.getHtml()
      if (this.state.noteIndex == -1) {
        console.log("content body on back "+contentBody)
        if (contentBody != '' || this.state.referenceList.length > 0) {
          console.log("if content body is not empty ")
          this.showAlert();
          return
        }
      } 
      else {
        if(contentBody !== this.props.navigation.state.params.noteObject.body 
            || !this.checkRefArrayEqual()){
              console.log("changes to content body changes ")
            this.showAlert();
          return
        }
      }
      
    this.props.navigation.dispatch(NavigationActions.back())
  }

  checkRefArrayEqual() {
    let initArray = this.props.navigation.state.params.noteObject.references;
    let nowArray = this.state.referenceList;
    if (initArray.length != nowArray.length) {
      return false;
    }
    for (var i=0; i<initArray.length; i++) {
      if (initArray[i].bookId != nowArray[i].bookId ||
          initArray[i].bookName != nowArray[i].bookName ||
          initArray[i].chapterNumber != nowArray[i].chapterNumber ||
          initArray[i].verseNumber != nowArray[i].verseNumber) {
            return false;
      }
    }
    return true;
  }

  componentDidMount() {
    this.props.navigation.setParams({ handleAdd: this.saveNote})
    this.props.navigation.setParams({ handleBack: this.onBack})

    this.addRef2()
  }

  onChangeText = (text)=>{
    this.setState({noteBody:text})
  }

  checkIfReferencePresent(id, name, cNum, vNum) {
    let referenceList = [...this.state.referenceList]
    for(var i = 0; i < referenceList.length; i++) {
      let ref = referenceList[i];
      if (ref.bookId == id && ref.bookName == name && ref.chapterNumber == cNum && ref.verseNumber == vNum) {
        return true;
      }
    }
    return false;
  }

  addRef2() {
    if (this.state.referenceList2) {
      if (this.state.noteIndex == -1) {
        this.setState({referenceList: this.state.referenceList2})
      } else {
        let referenceList = [...this.state.referenceList]        
        for (var i=0; i<this.state.referenceList2.length; i++) {
          let item = this.state.referenceList2[i]
          const verseNumber = item.verseNumber.toString()
          if (!this.checkIfReferencePresent(item.bookId, item.bookName, item.chapterNumber,verseNumber)) {
            referenceList.push(item)
          }
        }
        this.setState({referenceList})
      }
    }
  }

  getReference = () => {
    // const verseNum = this.prosps.verseNumber.toString()
    if (this.checkIfReferencePresent(this.props.bookId, this.props.bookName, this.props.chapterNumber, this.props.verseNumber)) {
      return;
    }
    try{
      this.setState({isLoading:true},async()=>{
        let response =  await APIFetch.getChapterContent(this.props.sourceId,this.props.bookId,this.props.chapterNumber)
        console.log("SOURCE ID ",this.props.sourceId,"BOOK ID ",this.props.bookId,"Chapter number",this.props.chapterNumber)
        if(response.length != 0){
          console.log("res -------",response)
    
          if(response.success == false){
    
            alert("response success false")
          }else{
          console.log("res",response.chapterContent.verses[this.props.verseNumber-1].text)
            let refModel = {bookId:this.props.bookId, 
              bookName: this.props.bookName, 
              chapterNumber: this.props.chapterNumber, 
              verseNumber: this.props.verseNumber.toString(), 
              verseText:response.chapterContent.verses[this.props.verseNumber-1].text,
              versionCode: this.props.version, 
              languageName: this.props.language
            };
            let referenceList = [...this.state.referenceList]
            referenceList.push(refModel)
            this.setState({referenceList,isLoading:false})
          }
        }
      })
 
  }
    catch(error){
      console.log(error)
    }
   
  }

  onAddVersePress() {
    
    this.props.navigation.navigate('SelectionTab', {getReference: this.getReference,
        bookId:this.props.navigation.state.params.bookId,
        chapterNumber:this.props.navigation.state.params.chapterNumber,
        totalVerses:this.props.navigation.state.params.totalVerses,
      })

  }

  openReference(index) {
    // todo open reference in RV page
    var list = this.state.referenceList
    var item = list[index]
    this.props.navigation.navigate('Bible', {bookId: item.bookId, bookName: item.bookName, 
      chapterNumber: item.chapterNumber, verseNumber: item.verseNumber})
  }

  deleteReference(index) {
    let referenceList = [...this.state.referenceList]
    referenceList.splice(index, 1);
    this.setState({referenceList})
  }

  render() {
    return (
     <ScrollView style={this.styles.containerEditNote}>
      <View style={this.styles.subContainer}>
      {this.state.isLoading &&
        <Spinner
        visible={this.state.isLoading}
        textContent={'Loading...'}
        // textStyle={styles.spinnerTextStyle}
        />}
        {this.state.referenceList.length == 0 
          ? 
          <Text style={this.styles.tapButton}>Tap button to add references</Text> 
          : 
          <FlowLayout style={this.styles.tapButton} ref="flow" 
            dataValue={this.state.referenceList} 
            openReference={(index) => {this.openReference(index)}} 
            deleteReference={(index) => {this.deleteReference(index)}}
            styles={this.styles}
          />
        }
        <Icon name="add-circle" style={this.styles.addIconCustom} size={28} color="gray" onPress={()=> {this.onAddVersePress()}} />
      </View>
      
      <View style={this.styles.textEditorView}>

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
      </View>

     </ScrollView> 
    )
  }

  _renderToolbarItem (action,selected, method){
    let iconName = 'format-bold'
    switch(action) {
      case actions.setBold: {
        iconName = "format-bold"
        break
      }
      case actions.setItalic: {
        iconName = "format-italic"
        break
      }
      case actions.setUnderline: {
        iconName = "format-underlined"
        break
      }
      case actions.setStrikethrough: {
        iconName = "format-strikethrough"
        break
      }
      case actions.insertBulletsList: {
        iconName = "format-list-bulleted"
        break
      }
      case actions.insertOrderedList: {
        iconName = "format-list-numbered"
        break
      }
    }

    return(
      <Icon name={iconName} 
      size={28} 
      color={selected ? 'black' : 'white'} 
      style={[
        // this.styles.iconCustom,
        {backgroundColor: selected ? 'white': 'transparent', margin:8, 
        padding:8, }
      ]}
        onPress={method} 
      />
    );
  }
}

const mapStateToProps = state =>{
  return{
    language:state.updateVersion.language,
    version:state.updateVersion.version,
    sourceId:state.updateVersion.sourceId,

    bookId:state.editNote.bookId,
    bookName:state.editNote.bookName,
    bodyText:state.editNote.bodyText,
    chapterNumber:state.editNote.chapterNumber,
    verseNumber: state.editNote.verseNumber,
    index:state.editNote.index,
    
    sizeFile:state.updateStyling.sizeFile,
    colorFile:state.updateStyling.colorFile,
    
  }
}



export  default connect(mapStateToProps,null)(EditNote)
