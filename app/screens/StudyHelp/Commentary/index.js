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
import {Card,CardItem,Content,Body} from 'native-base'
import Icon from 'react-native-vector-icons/MaterialIcons';
import startEndIndex from '../../../assets/commentary_mapping'
import {updateContentType} from '../../../store/action/'
import { NavigationEvents } from 'react-navigation';
import APIFetch from '../../../utils/APIFetch'
import { ScrollView } from 'react-native-gesture-handler';


class Commentary extends Component {

  static navigationOptions = ({navigation}) =>{
    const { params={} } = navigation.state 
    return{
        headerTitle:(
          <View style={styles.headerLeftStyle}>
            <View style={{marginRight:10}}>
              <TouchableOpacity style={styles.touchableStyleLeft}  
              onPress={() =>{navigation.navigate("SelectionTab", {bookId:params.bookId,chapterNumber:params.currentChapter,totalVerses:params.totalVerses,getReference:params.callBackForUpdateBook,contentType:'commentary'})}}>
                <Text  style={styles.headerTextStyle}>{params.bookName}  {params.currentChapter }</Text>
              <Icon name="arrow-drop-down" color="#fff" size={24}/>
              </TouchableOpacity>
            </View>
            <View style={{marginRight:10}}>
              <TouchableOpacity onPress={() =>{navigation.navigate("LanguageList", {callBackForUpdateBook:params.callBackForUpdateBook,contentType:'commentary'})}} style={styles.headerLeftStyle}>
                <Text style={styles.headerTextStyle}>{params.languageName}  {params.versionCode}</Text>
                <Icon name="arrow-drop-down" color="#fff" size={24}/>
              </TouchableOpacity>
           
            </View>
          </View>
       
      ), 
        headerTintColor:"#fff",
    }
}
    constructor(props){
      super(props)
      console.log("COMMENTARY PROPS ",this.props.navigation.state.routeName)

        this.state = {
          commentary: []
        }
    }
  async getCommmentary(){
    // sourceId,bookId,chapterNumber
    const value = await APIFetch.commentaryContent()
    this.setState({commentary:value})
    console.log("commentary from api ",value)
  
  }

  componentDidMount(){
    this.props.navigation.setParams({
      bookName:this.props.bookName,
      currentChapter: this.props.chapterNumber,
      languageName:this.props.language,
      versionCode:this.props.version,
      updateContentType:this.props.updateContentType('Commentary')

    })
    this.getCommmentary()
  }
  render(){
    // return(
    //   <View>{this.state.commentary}</View>
    // )
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
      <SafeAreaView style={styles.container}>
      <ScrollView>
      <NavigationEvents
      onWillFocus={() =>this.getCommmentary()}
      />
      {
        this.state.commentary.length == 0 ? 
         <Spinner
         visible={true}
         textContent={'Loading...'}
         // textStyle={styles.spinnerTextStyle}
     />
      :
      <Card>
      <CardItem header bordered>
        <Text>{this.state.commentary.bookCode} {this.state.commentary.chapterId}</Text>
      </CardItem>
      {this.state.commentary.bookIntro  == '' ? null :
      <CardItem header bordered>
        <Text>{this.state.commentary.bookIntro.match(/<b>(.*?)<\/b>/g) ? convertToText(this.state.commentary.bookIntro) : this.state.commentary.bookIntro}</Text>
      </CardItem>}
      { this.state.commentary.chapterIntro == '' ? null :
      <CardItem header bordered>
       <Text>{this.state.commentary.chapterIntro.match(/<b>(.*?)<\/b>/g) ? convertToText(this.state.commentary.chapterIntro) : this.state.commentary.chapterIntro}</Text>
      </CardItem>
      }
      <CardItem>
      <FlatList
          data={this.state.commentary.commentaries}
          renderItem={({ item }) => (
            <View>
            <CardItem bordered>
            <Body>
            <Text>Verse Number : {item.verses}</Text>
            <Text>{item.text.match(/<b>(.*?)<\/b>/g) ? convertToText(item.text):item.text}</Text>
            </Body>
            </CardItem>
            </View>
          )}
          // keyExtractor={item => item.bookId}
          // ListFooterComponent={<View style={styles.addToSharefooterComponent} />}
        />
        </CardItem>
        </Card>
        }
        </ScrollView>
      </SafeAreaView>

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
  }
}
const mapDispatchToProps = dispatch =>{
  return {
    updateContentType:(content) =>dispatch(updateContentType(content)),
  }
}

export  default connect(mapStateToProps,mapDispatchToProps)(Commentary)