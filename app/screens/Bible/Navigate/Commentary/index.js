import React,{useEffect,useState} from 'react';
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
import {Card,CardItem,Content,Body,Header, Right,Left,Title} from 'native-base'
import Icon from 'react-native-vector-icons/MaterialIcons';
import {updateContentType} from '../../../../store/action/'
import { NavigationEvents } from 'react-navigation';
import APIFetch from '../../../../utils/APIFetch'
import { ScrollView } from 'react-native-gesture-handler';
import Orientation from 'react-native-orientation';

const Commentary =({_orientationDidChange}) =>{
  const [commentary, updateCommentary] = useState([]);
  
  useEffect(async()=>{
    // console.log("bookId,chapterNumber commentary ",bookId,chapterNumber)
    try{
      const value = await APIFetch.commentaryContent()
      console.log("value ",value)
      updateCommentary(value)
    }
    catch(error ){
      updateCommentary([])
      console.log('erorr commentary ',error)
    }
  },[])
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
    <SafeAreaView>
      <Header style={{position:'absolute',top:-40,height:40,borderLeftWidth:0.5,borderLeftColor:'#fff'}} >
      <Left/>
          <Body>
            <Title>Header</Title>
          </Body>
      <Left />
      <Right>
        <TouchableOpacity  onPress={()=>{_orientationDidChange}}>
          <Icon name="close" color={"#fff"} size={20}/>
        </TouchableOpacity >
      </Right>
    </Header>

    <ScrollView>
    {/* <NavigationEvents
    onWillFocus={() =>getCommmentary()}
    /> */}
    {
      commentary.length == 0 ? 
       <Spinner
       visible={true}
       textContent={'Loading...'}
       // textStyle={styles.spinnerTextStyle}
   />
    :
    <Card>
    <CardItem header bordered>
      <Text>{commentary.bookCode} {commentary.chapterId}</Text>
    </CardItem>
    {commentary.bookIntro  == '' ? null :
    <CardItem header bordered>
      <Text>{commentary.bookIntro.match(/<b>(.*?)<\/b>/g) ? convertToText(commentary.bookIntro) : commentary.bookIntro}</Text>
    </CardItem>}
    {/* { commentary.chapterIntro == '' ? null :
    <CardItem header bordered>
     <Text>{commentary.chapterIntro.match(/<b>(.*?)<\/b>/g) ? convertToText(commentary.chapterIntro) : commentary.chapterIntro}</Text>
    </CardItem>
    } */}
    <CardItem>
    <FlatList
        data={commentary.commentaries}
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

// Commentary.navigationOptions = ({ navigation }) => ({

//   // headerTitleStyle: { alignSelf: 'center',flex:1 },
//   title: 'Commentary',
 
// })
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

export  default connect(mapStateToProps,mapDispatchToProps) (Commentary)