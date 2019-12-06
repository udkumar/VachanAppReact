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
        let string = substr.slice(3).toString()
        let exRegex = /<b>(.*?)<\/b>/g
        var match = exRegex.exec(string);
        console.log("eeregex ",(match && match[1]!=null))
        
        // React.createElement("Text", {style: {color: "red", backgroundColor: "blue"}}, this.props.paragraph)
        let content = string.replace(exRegex,'$1').replace(/<br>|<br\/>/g,'\n')
        // const element = React.createElement('Text', { }, capturedContent)
        // var textElem = React.createElement(Text, [], ['Hello world']);
        // let regexMatch = string.match(regex)
        // console.log("regex match ",regexMatch)
        
        if(id == substr[0]){
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
    // var textElem = React.createElement(Text, [], ['Hello world']);

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
      <View>
        {/* <Text style={{alignSelf:'center',fontWeight:'bold',fontSize:20,marginHorizontal:10}}>{this.props.bookName}</Text>  */}
        <FlatList
          data={this.state.commentary}
          renderItem={({ item }) => (
            <View style={{margin:10}}>
              {/* <Text  style={{alignSelf:'center'}}>Book Inro</Text>
              <Text  style={{alignSelf:'center'}}>{item.book}</Text>
              <Text  style={{alignSelf:'center'}}>{item.chapter}</Text>
              <Text  style={{alignSelf:'center'}}>{item.verse}</Text> */}
              <Text  style={{alignSelf:'center',fontSize:14}}>{item.content}</Text>


              {/* {item.chapter.map((chap) =>(<View>
                  <Text>{chap.chapterIntro}</Text>
                  <Text>{chap.verseNumber}</Text>
                  <Text>{chap.content}</Text>
                </View>
              ))} */}
              {/* <Text>{item.bookId}</Text>
              <Text  style={{alignSelf:'center'}}>{typeof item.chapter === 'undefined' ? "Book Intro" : " Chapter "+item.chapter }</Text>
              <Text style={{alignSelf:'center'}}>{typeof item.verse === 'undefined' ? "Chapter Intro" : item.verse }</Text>  
              <Text style={{alignSelf:'center'}}>Commentary</Text>
              <Text>{item.content}</Text>   */}
            </View>
          )}
          keyExtractor={item => item.bookId}
        />
        </View>
        }
      </SafeAreaView>
    );
  }

 
}

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
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