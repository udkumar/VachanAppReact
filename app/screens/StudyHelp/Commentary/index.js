import React,{Component} from 'react';
import {
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Text,
  View
} from 'react-native';
var RNFS = require('react-native-fs');
import SplashScreen from 'react-native-splash-screen'
import Spinner from 'react-native-loading-spinner-overlay';
import {connect} from 'react-redux'
import {Card,CardItem,Content,Body,Header,Container, Right,Left,Title,Button} from 'native-base'
import{fetchCommentaryContent} from '../../../store/action/index'
import Icon from 'react-native-vector-icons/MaterialIcons';
import startEndIndex from '../../../assets/commentary_mapping'
import { NavigationEvents } from 'react-navigation';
import APIFetch from '../../../utils/APIFetch'
import { ScrollView } from 'react-native-gesture-handler';


class Commentary extends Component {

    constructor(props){
      super(props)

        this.state = {
          commentary: []
        }
    }
  componentDidMount(){
    this.props.fetchCommentaryContent({contentSourceId:this.props.contentSourceId,bookId:this.props.bookId,chapter:this.props.chapterNumber})
  }
  render(){

    // console.log("UPDATE VERSION ",this.props.contentType )

    var convertToText = (response) => {
      let exRegex = /<b>(.*?)<\/b>/g
    //replaced string with bld because on spliting with '<b>' tag ,all text get mixed not able to identify where to apply the bold style 
      let splitstr = response.replace(/\<br>|\<br\/>/g,"\n").replace(exRegex,'BLD<b>$1</b>BLD')
    //splited with bld will remove the bld text and will be left with b tag and ext can easily get bold
      let str = splitstr.split('BLD')
      console.log(str)
      let temp =[]
      for(var i=0;i<=str.length-1;i++){
        let matchBold = exRegex.exec(str[i])
        if(matchBold != null ){
        temp.push(<Text style={{fontWeight:'bold',fontSize:16}}>{matchBold[1]} : </Text>)
        }
        else{
          temp.push(<Text>{str[i]}</Text>)
        }
      }
      return (<Text>{temp}</Text>)
    }
    return (
      <View>
        <Header style={{height:40,borderLeftWidth:0.5,borderLeftColor:'#fff'}} >
          <Body>
            <Title style={{fontSize:16}}>{this.props.constentVersionCode}</Title>
          </Body>
          <Right>
          <Button transparent onPress={()=>this.props.toggleParallelView(false)}>
            <Icon name='close' color={'#fff'} size={20}/>
          </Button>
          </Right>
        </Header>
    <ScrollView>
    {/* <NavigationEvents
    onWillFocus={() =>getCommmentary()}
    /> */}
    {
      this.props.commentaryContent.length == 0 ? 
       <Spinner
       visible={true}
       textContent={'Loading...'}
       // textStyle={styles.spinnerTextStyle}
   />
    :
    <Card>
    <CardItem header bordered>
      <Text>{this.props.commentaryContent.bookCode} {this.props.commentaryContent.chapterId}</Text>
    </CardItem>
    {this.props.commentaryContent.bookIntro  == '' ? null :
    <CardItem header bordered>
      <Text>{convertToText(this.props.commentaryContent.bookIntro)}</Text>
    </CardItem>}
  
    <CardItem>
    <FlatList
        data={this.props.commentaryContent.commentaries}
        renderItem={({ item }) => (
          <View style={{paddingBottom:4}}>
          {/* <CardItem bordered> */}
          <Body>
              {item.verse ? <Text style={{fontWeight:'bold'}}>Verse Number : {item.verse}</Text> :null}  
          <Text>{convertToText(item.text)}</Text>
          </Body>
          </View>
        )}
        // keyExtractor={item => item.bookId}
      />
      </CardItem>
      </Card>
      }
      </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
headerLeftStyle:{
  flex:1,
  marginHorizontal:10,
  flexDirection:'row',
},

headerRightStyle:{
  flexDirection:'row',
  flex:1,

},
touchableStyleRight:{
    flexDirection:"row",
    marginRight:10
},
touchableStyleLeft:{
  flexDirection:"row",
    marginLeft:10,
},
headerTextStyle:{
    fontSize:16,
    color:"#fff",
    textAlign:'center'
},
});


const mapStateToProps = state =>{
  return{
    language: state.updateVersion.language,
    version:state.updateVersion.version,
    chapterNumber:state.updateVersion.chapterNumber,
    totalChapters:state.updateVersion.totalChapters,
    bookName:state.updateVersion.bookName,
    bookId:state.updateVersion.bookId,
    sizeFile:state.updateStyling.sizeFile,
    colorFile:state.updateStyling.colorFile,

    contentType:state.updateVersion.contentType,

    contentSourceId:state.updateVersion.contentSourceId,
    constentVersionCode:state.updateVersion.constentVersionCode,
    commentaryContent:state.commentaryFetch.commentaryContent
  }

}
const mapDispatchToProps = dispatch =>{
  return {
    
    fetchCommentaryContent:(payload)=>dispatch(fetchCommentaryContent(payload)),
  }
}
export  default connect(mapStateToProps,mapDispatchToProps)(Commentary)