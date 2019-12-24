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


const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
];


class Commentary extends Component {
  static navigationOptions = ({navigation}) =>{
    const { params={} } = navigation.state 

    return{
      headerTitle:(
        <View style={styles.headerLeftStyle}>
          <View style={{marginRight:10}}>
              <Text style={styles.headerTextStyle}>{params.bookName}  {params.currentChapter }</Text>
          </View>
          
        </View>
     
    ), 
    }
  }
    constructor(props){
       console.log("commentry props ",props)
      super(props)
        this.state = {
          commentary: []
        }
    }
  getCommmentary(){
    RNFS.readFileAssets('mhcc_commentary.csv').then((res) => {
      var lines = res.split("\n");
      const id = this.props.bookId.toUpperCase()
      // const id ='GEN'
      console.log("book id ",id)

      let commentary = []
      for(var i=0; i<=lines.length-1; i++){
          commentaryContent = {}
          const substr =  lines[i].split("\t")
          let string = substr.slice(3).toString()
          let content = string.replace(/\<br>|\<br\/>/,"").replace(/\<br>|\<br\/>/g,"\n").replace(/^\"|\"$/g,"")
          if(substr[0] == id ){
            if(isNaN(parseInt(substr[1])) && isNaN(parseInt(substr[2])) || parseInt(substr[1]) === this.props.chapterNumber){
            commentaryContent["book"] = substr[0]
            commentaryContent["chapter"] = substr[1]
            commentaryContent["verse"] = substr[2]
            commentaryContent["content"] = content
            commentary.push(commentaryContent)
            }
        }
      }

      this.setState({commentary})
      this.props.navigation.setParams({
        bookName:this.props.bookName
      })
    })
    .catch(error=>{console.log("erorr ",error)})
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    console.log("props ",this.props,this.prevProps)
    if (this.props.bookId !== prevProps.bookId || this.props.chapterNumber !== prevProps.chapterNumber) {
      this.getCommmentary()
    }
  }
  
  componentDidMount(){
    this.getCommmentary()
    SplashScreen.hide();
  }
  render(){
    console.log(" content ",this.state.commentary)
    var convertToText = (response) => {
      let exRegex = /<b>(.*?)<\/b>/g
    //replaced string with bld because on spliting with '<b>' tag ,all text get mixed not able to identify where to apply the bold style 
      let splitstr = response.replace(exRegex,'BLD<b>$1</b>BLD')
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
          temp.push(<Text >{str[i]}</Text>)
        }
      }
      return (<Text>{temp}</Text>)
    }
    return (
      <SafeAreaView style={styles.container}>
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
        <Text>{this.props.bookName} {this.props.chapterNumber}</Text>
      </CardItem>
        <FlatList
          data={this.state.commentary}
          renderItem={({ item }) => (
            <View>
             {(isNaN(parseInt(item.chapter)) && isNaN(parseInt(item.verse))) ? <CardItem >
            <Text>Book Intro</Text>
            </CardItem>:null}
            {(!isNaN(parseInt(item.chapter)) && isNaN(parseInt(item.verse))) ? 
            <CardItem>
            <Text>Chapter Intro</Text>
            </CardItem>:null}
            {!isNaN(parseInt(item.verse)) &&  <CardItem>
             <Text>Verse Number : {item.verse}</Text>
            </CardItem>}
            <CardItem bordered>
            <Body >
            <Text>{item.content.match(/<b>(.*?)<\/b>/g) ? convertToText(item.content):item.content}</Text>
            </Body>
            </CardItem>
            </View>
          )}
          keyExtractor={item => item.bookId}
          ListFooterComponent={<View style={styles.addToSharefooterComponent} />}
        />
        </Card>
        }
        {/* <View style={{height:60, marginBottom:4}} /> */}
      </SafeAreaView>

    );
  }

 
}

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    marginBottom:40
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  headerTextStyle:{
    fontSize:16,
    color:"#fff"
},
headerLeftStyle:{
  flex:1,
  marginHorizontal:10
},
});


const mapStateToProps = state =>{
  return{
    chapterNumber:state.updateVersion.chapterNumber,
    totalChapters:state.updateVersion.totalChapters,
    bookName:state.updateVersion.bookName,
    bookId:state.updateVersion.bookId,
    sizeFile:state.updateStyling.sizeFile,
    colorFile:state.updateStyling.colorFile,

  }
}

export  default connect(mapStateToProps,null)(Commentary)