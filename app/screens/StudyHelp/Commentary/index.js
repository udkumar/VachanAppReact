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
              <Text  style={styles.headerTextStyle}>{params.bookName}  {params.currentChapter }</Text>
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
          if(substr[0] == id){
          let string = substr.slice(3).toString()
          let content = string.replace(/\<br>|\<br\/>/g,"\n").replace(/^\"|\"$/g,"")
            commentaryContent["book"] = substr[0]
            commentaryContent["chapter"] = substr[1]
            commentaryContent["verse"] = substr[2]
            commentaryContent["content"] = content
            commentary.push(commentaryContent)
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
    if (this.props.bookId !== prevProps.bookId) {
      this.getCommmentary()
    }
  }
  
  componentDidMount(){
    this.getCommmentary()
    SplashScreen.hide();
  }
  render(){
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
        temp.push(<Text style={{fontWeight:'bold',fontSizess:18}}>{matchBold[1]}</Text>)
        }
        else{
          temp.push(<Text >{str[i]}</Text>)
        }
      }
      return (<Text>{temp}</Text>)
    }
    console.log(" content ",this.state.content)
    return (
      <View style={styles.container}>
      {
        this.state.commentary.length == 0 ? 
         <Spinner
         visible={true}
         textContent={'Loading...'}
         // textStyle={styles.spinnerTextStyle}
     />
      :
      <View>
        {/* <Text style={{alignSelf:'center',fontWeight:'bold',fontSize:20,marginHorizontal:10}}>{this.props.bookName}</Text>  */}
        <FlatList
          data={this.state.commentary}
          renderItem={({ item }) => (
            <View>
              {(isNaN(parseInt(item.chapter)) && isNaN(parseInt(item.verse))) ? <Text  style={{alignSelf:'center',fontWeight:'300',marginTop:8,fontSize:16}}>Book Intro</Text>:null}
              {(!isNaN(parseInt(item.chapter)) && isNaN(parseInt(item.verse))) ? <Text  style={{alignSelf:'center',fontWeight:'300',marginTop:8,fontSize:16}}>Chapter Intro</Text>:null}
              {!isNaN(parseInt(item.verse)) && <Text  style={{alignSelf:'center',marginTop:10,fontSize:16}}>Verse Number : {item.verse}</Text>}
              <Text  style={{alignSelf:'center',fontSize:14,}}>{item.content.match(/<b>(.*?)<\/b>/g) ? convertToText(item.content):item.content}</Text>
            </View>
          )}
          keyExtractor={item => item.bookId}
        />
        </View>
        }
      </View>
    );
  }

 
}

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    marginHorizontal:10
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
    color:"#fff",
    textAlign:'center'
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