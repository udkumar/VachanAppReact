import React,{Component} from 'react';
import {
  SafeAreaView,
  NativeModules,
  TouchableOpacity,
  LayoutAnimation,
  FlatList,
  StyleSheet,
  TextInput,
  Text,
  Dimensions,
  View
} from 'react-native';
var RNFS = require('react-native-fs');
import {connect} from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {updateDimensions,closeSplitScreen} from '../../../../store/action/'

 const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
UIManager.setLayoutAnimationEnabledExperimental(true);

const DATA = [
  {
    id: 'bd7acbeac1b146c2aed53ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afcc60548d3a4f8fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f3da1471fbd96145571e29d72',
    title: 'Third Item',
  },
];


class Commentary extends Component {
  constructor(){
    super()
    this.state ={
      w: 100,
      h: 100,
    }
  }
  _onPress = () => {
        LayoutAnimation.spring();
        this.setState({w: this.state.w + 10, h: this.state.h + 10})
      }
  static navigationOptions =  ({navigation}) => {
    const { params={} } = navigation.state 
    return{
      headerTintColor: '#3F51B5',
      headerStyle: {
        backgroundColor: '#3F51B5'
      },
     
      headerRight:(
        <TouchableOpacity  onPress={params.close}>
          <Icon name='close' color="#fff" size={28} style={{marginHorizontal:8}} />
        </TouchableOpacity>
      ),
      headerLeft:(
        <Text>Commentary</Text>
        // <Icon name='close' color="#fff" size={28} style={{marginHorizontal:8}} />
      )}
  };
    
  componentDidUpdate(){
    console.log("update close ",this.props.close)
  }
  getCommmentary(){
    RNFS.readFileAssets('mhcc_commentary.csv').then((res) => {
      var lines = res.split("\n");
      // const id = this.props.bookId.toUpperCase()
      const id ='GEN'

      let commentary = []
      for(var i=0; i<=lines.length-1; i++){
        commentaryContent = {}
        const substr =  lines[i].split("\t")
        let string = substr.slice(3).toString()
        let exRegex = /<b>(.*?)<\/b>/g

        let content = string.replace(exRegex,'$1').replace(/<br>|<br\/>/g,'\n')
        // const element = React.createElement('Text', { }, capturedContent)
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
    })
  }

  componentDidMount(){
    this.props.navigation.setParams({
      close:this.closeOnPress
    })
    this.getCommmentary()
  }
  closeOnPress=()=>{
    this.props.closeSplitScreen(true)
  }
  render(){
    console.log("close ",this.props.close)
    var textElem = React.createElement(Text, [], ['Hello world']);

    return (
      <SafeAreaView style={styles.container}>
       <View>
         <View style={[styles.box, {width: this.state.w, height: this.state.h}]} />
        <TouchableOpacity onPress={this._onPress}>
           <View style={styles.button}>
             <Text style={styles.buttonText}>Press me!</Text>
           </View>
         </TouchableOpacity>
       </View>
      {/* {
        this.state.commentary.length == 0 ? 
         <Spinner
         visible={true}
         textContent={'Loading...'}
     />
      :
        <FlatList
          data={this.state.commentary}
          renderItem={({ item }) => (
            <View>
              <Text  style={{alignSelf:'center'}}>{item.content}</Text>
            </View>
          )}
          keyExtractor={item => item.bookId}
        />
        } */}
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
  box: {
        width: 100,
        height: 100,
        backgroundColor: 'red',
      },
  button: {
    backgroundColor: 'black',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
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
    close: state.updateSplitScreen.close,
    heightOfSplitScreen:state.updateSplitScreen.height,
    widthOfSplitScreen:state.updateSplitScreen.width
  }
}
const mapDispatchToProps = dispatch =>{
  return {
    closeSplitScreen: (close)=>dispatch(closeSplitScreen(close)),
    updateDimensions: (h,w)=>dispatch(updateDimensions(close)),

  }
}
export  default connect(mapStateToProps,mapDispatchToProps)(Commentary)


// import React from 'react';
// import {
//   NativeModules,
//   LayoutAnimation,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   View,
// } from 'react-native';

// const { UIManager } = NativeModules;

// UIManager.setLayoutAnimationEnabledExperimental &&
//   UIManager.setLayoutAnimationEnabledExperimental(true);

// export default class Commentary extends React.Component {
//   state = {
//     w: 100,
//     h: 100,
//   };

//   _onPress = () => {
//     // Animate the update
//     LayoutAnimation.spring();
//     this.setState({w: this.state.w + 15, h: this.state.h + 15})
//   }

//   render() {
//     return (
//       <View style={styles.container}>
//         <View style={[styles.box, {width: this.state.w, height: this.state.h}]} />
//         <TouchableOpacity onPress={this._onPress}>
//           <View style={styles.button}>
//             <Text style={styles.buttonText}>Press me!</Text>
//           </View>
//         </TouchableOpacity>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   box: {
//     width: 200,
//     height: 200,
//     backgroundColor: 'red',
//   },
//   button: {
//     backgroundColor: 'black',
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//     marginTop: 15,
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
// });
