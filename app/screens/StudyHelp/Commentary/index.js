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


export default class commentary extends Component {
    constructor(props){
      super(props)
        this.state = {
          commentary: []
        }
    }
  getCommmentary(){
    RNFS.readFileAssets('mhcc_commentary.csv').then((res) => {
      var lines = res.split("\n");
      const id = 'GEN'
      let commentary = []
      let bookIntro = ''
      let chapterNumber = 1
      let chapterContent = []
      for(var i=0; i<=lines.length-1; i++){
        const substr =  lines[i].split("\t")
        if(id == substr[0] && chapterNumber == (!isNaN(parseInt(substr[1])) && substr[1])){
          let content = substr.slice(3)
          // const b = /<b[^>]*>([\s\S]*?)<\/b>/ig
          // const br = /<br\s*\/?>/ig;
      
          bookIntro = isNaN(parseInt(substr[1])) && content
          chapterNumber =  !isNaN(parseInt(substr[1])) && substr[1] 
            chapterContent.push({ 
            chapterIntro:isNaN(parseInt(substr[2])) && content,
            verseNumber:!isNaN(parseInt(substr[2])) && substr[2],
            content : content
          })
        }
      }
      let book = {
        bookId:id,
        bookIntro:bookIntro,
        chapterNumber:chapterNumber,
        chapter:chapterContent
      }
      commentary.push(book)
      this.setState({commentary})
      console.log(" commentary  ....",commentary.length)
    })
    .catch(error=>{console.log("erorr ",error)})
  }
  componentDidMount(){
    this.getCommmentary()
    SplashScreen.hide();
    
  }

  render(){
   
    console.log("state ",this.state.commentary)
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
        <FlatList
          data={this.state.commentary}
          renderItem={({ item }) => (
            <View>
              <Text>{item.bookId}</Text>
              {item.chapter.map((chap) =>(<View>
                  <Text>{chap.chapterIntro}</Text>
                  <Text>{chap.verseNumber}</Text>
                  <Text>{chap.content}</Text>
                </View>
              ))}
              {/* <Text>{item.bookId}</Text>
              <Text  style={{alignSelf:'center'}}>{typeof item.chapter === 'undefined' ? "Book Intro" : " Chapter "+item.chapter }</Text>
              <Text style={{alignSelf:'center'}}>{typeof item.verse === 'undefined' ? "Chapter Intro" : item.verse }</Text>  
              <Text style={{alignSelf:'center'}}>Commentary</Text>
              <Text>{item.content}</Text>   */}
            </View>
          )}
          keyExtractor={item => item.bookId}
        />
        }
      </SafeAreaView>
    );
  }

 
}

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    margin:4
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
});
