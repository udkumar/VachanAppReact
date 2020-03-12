import React,{Component} from 'react';
import {
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  StyleSheet,
  ScrollView,
  Modal,
  Text,
  View
} from 'react-native';
var RNFS = require('react-native-fs');
import SplashScreen from 'react-native-splash-screen'
import Spinner from 'react-native-loading-spinner-overlay';
import {connect} from 'react-redux'
import {Accordion,Card,CardItem,Content,Body,Header,Container, Right,Left,Title,Button} from 'native-base'
import{fetchDictionaryContent} from '../../../store/action/index'
import {getBookNameFromMapping} from '../../../utils/UtilFunctions';
import Icon from 'react-native-vector-icons/MaterialIcons';
import startEndIndex from '../../../assets/commentary_mapping'
import { NavigationEvents } from 'react-navigation';
import APIFetch from '../../../utils/APIFetch'
import {styles} from './styles'


class Dictionary extends Component {

    constructor(props){
      super(props)

        this.state = {
          commentary: [],
          modalVisible:false,
          wordDescription:[]
        }
        this.styles = styles(this.props.colorFile, this.props.sizeFile)
    }
  componentDidMount(){
    this.props.fetchDictionaryContent({parallelContentSourceId:this.props.parallelContentSourceId})
  }
  componentWillUpdate(nextProps) {
    this.props.fetchDictionaryContent({parallelContentSourceId:this.props.parallelContentSourceId})
  }
  fetchWord=async(word)=>{
      var wordDescription = await APIFetch.fetchWord(this.props.parallelContentSourceId,word.wordId)
      this.setState({
        wordDescription:wordDescription.meaning,
        modalVisible:true
      })
  }
    _renderHeader = (item, expanded) =>{
        return(
          <View style={{
            flexDirection: "row",
            padding: 10,
            justifyContent: "space-between",
            alignItems: "center" ,
            }}>
            <Text style={{ fontWeight: "600" }} >
            {" "}{item.letter}
              
            </Text>
            <Icon style={styles.iconStyle} name={expanded ? "keyboard-arrow-down" : "keyboard-arrow-up" }  size={24}/>

          </View>
        )
    }
    _renderContent = (item) =>{
      return(
        item.words.map(w=>
        <TouchableOpacity 
          style={{
            // flexDirection: "row",
            padding: 10,
            }}
            onPress={()=>this.fetchWord(w)}
          >
            <Text>{w.word}</Text>
          </TouchableOpacity>
      )
      )
    }

  render(){
    console.log(" dictionary content ",this.state.wordDescription)
    return (
        <View>
        <Header style={{height:40,borderLeftWidth:0.5,borderLeftColor:'#fff'}} >
          <Body>
            <Title style={{fontSize:16}}>{this.props.parallelContentVersionCode}</Title>
          </Body>
          <Right>
          <Button transparent onPress={()=>this.props.toggleParallelView(false)}>
            <Icon name='cancel' color={'#fff'} size={20}/>
          </Button>
          </Right>
        </Header>
        <Accordion 
          dataArray={this.props.dictionaryContent}
          animation={true}
          expanded={true}
          renderHeader={this._renderHeader}
          renderContent={this._renderContent}
        />
        <Modal
          animated={true}
          transparent={true}
          visible={this.state.modalVisible}>
          <TouchableWithoutFeedback
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              }} 
            onPressOut={()=>this.setState({modalVisible:false})} 
            > 
          <View style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'}}>
           <View style={{width:'70%'}}>
           <Icon name='cancel' size={28} color={'#ff'} style={{position:'absolute',top:-20,right:-20}}/>
            <Card>
              <CardItem><Text>Description: {this.state.wordDescription.definition}</Text></CardItem>
              <CardItem><Text>Keywrod: {this.state.wordDescription.keyword}</Text></CardItem>
              <CardItem><Text>See Also: {this.state.wordDescription.seeAlso}</Text></CardItem>
            </Card>
          </View>
          </View>
          {/* <View style={{ height:'70%',width:'70%',alignSelf:'center',backgroundColor:'#fff'}}>
            <Text>{this.state.wordDescription.definition}</Text>
          </View>  */}
          </TouchableWithoutFeedback>
        </Modal>
    </View>
    )
}
}


const mapStateToProps = state =>{
  return{
    language: state.updateVersion.language,
    versionCode:state.updateVersion.versionCode,
    chapterNumber:state.updateVersion.chapterNumber,
    totalChapters:state.updateVersion.totalChapters,
    bookName:state.updateVersion.bookName,
    bookId:state.updateVersion.bookId,
    sizeFile:state.updateStyling.sizeFile,
    colorFile:state.updateStyling.colorFile,

    contentType:state.updateVersion.contentType,

    parallelContentSourceId:state.updateVersion.parallelContentSourceId,
    parallelContentVersionCode:state.updateVersion.parallelContentVersionCode,
    parallelContentLanguage:state.updateVersion.parallelContentLanguage,
    dictionaryContent:state.dictionaryFetch.dictionaryContent,
    parallelContentLanguageCode:state.updateVersion.parallelContentLanguageCode
  }

}
const mapDispatchToProps = dispatch =>{
  return {
    
    fetchDictionaryContent:(payload)=>dispatch(fetchDictionaryContent(payload)),
    fetchWordId:(payload)=>dispatch(fetchWordId(payload)),
  }
}
export  default connect(mapStateToProps,mapDispatchToProps)(Dictionary)