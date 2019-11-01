

import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Share,
} from 'react-native';
import { Card, CardItem, Content,Container,Header, Right, Left,Body } from 'native-base';
import { HeaderBackButton, NavigationActions } from 'react-navigation';
import { noteStyle } from './styles.js';
import DbQueries from '../../utils/dbQueries'
import SplashScreen from 'react-native-splash-screen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  Menu,
  MenuContext,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import {connect} from 'react-redux';

 class NotePage extends Component {
  static navigationOptions = ({navigation}) =>({
    headerTitle: 'Note',
  });


  constructor(props){
    super(props);
    this.state = {
      colorFile:this.props.screenProps.colorFile,
      noteData:this.props.navigation.state.params.note,
      createdTime:this.props.navigation.state.params.createdTime
    }
    this.styles = noteStyle(props.screenProps.colorFile, props.screenProps.sizeFile);   
    
  }

  componentDidMount(){
    SplashScreen.hide();
  }
  openMenu =()=>{
  }
  onbackNote = (list)=>{
    this.setState({noteData:list})
    console.log("onback refence list ",this.props.referenceNote)
  }
  goToEditPage=()=>{
    this.props.navigation.navigate("EditNote",{
      onbackNote:this.onbackNote,
      referenceList: this.state.noteData,
      noteIndex:this.props.navigation.state.params.noteIndex,
      noteObject:this.props.navigation.state.params.noteObject,
      bookId: this.props.navigation.state.params.bookId,
      chapterNumber:1,
    })
  }

  addToShare = () => {
    let shareText = ''
    for (let item of this.state.noteData) {
      shareText = shareText.concat(item.bookName + " " + item.chapterNumber + ":" + item.verseNumber + " ");
      shareText = shareText.concat(item.verseText);
      shareText = shareText.concat("\n");
    }
    Share.share({message: shareText})
  }

  onDelete=()=>{
    DbQueries.deleteNote(this.state.createdTime)
    this.props.navigation.state.params.queryDb()
    // this.props.navigation.state.params.onDelete()
    this.props.navigation.dispatch(NavigationActions.back())
  }

  render() {
    return (
      <MenuContext>
      <Container>
      <Content padder>
        <Card>
          <CardItem header bordered>
              <Text style={{fontSize:18}}>
                {this.props.navigation.state.params.bodyText}
              </Text>
          </CardItem>
          <CardItem bordered>
            <Body>
              {
                this.state.noteData.map(value =>
                <View  style={{marginTop:8}}>
                <Text style={{fontWeight:"bold",fontSize:16,padding:4}}>
                  {value.bookName} {value.chapterNumber} 
                </Text>
                <Text>
                  {value.verseNumber} {value.verseText} 
                </Text>
                </View>
                )
              }
            
            </Body>
          </CardItem>
          <CardItem  bordered >
          <Body style={{alignItems:'flex-end',justifyContent:'flex-end'}}>
         
          <TouchableOpacity>
            
          <Menu onSelect={value => alert(`Selected number: ${value}`)}>
          <MenuTrigger text={<Icon name="more-vert" size={28} />} />
          <MenuOptions>
            <MenuOption onSelect={this.goToEditPage}  value={1} text='Edit' />
            <MenuOption onSelect={this.onDelete} value={2} text='Delete' />
            <MenuOption onSelect={this.addToShare} value={3} text='Share' />
            </MenuOptions>
          </Menu>
          </TouchableOpacity>
          </Body>
          </CardItem>
        </Card>
      </Content>
    </Container>
    </MenuContext>

    );
  }
}




const mapStateToProps = state =>{
  return{
    referenceNote:state.editNote.referenceNote,
  }
}


export  default connect(mapStateToProps,null)(NotePage)
