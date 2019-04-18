import React, { Component } from 'react';
import { Text, StyleSheet, View, FlatList, TextInput, ActivityIndicator} from 'react-native';



export default class LanguagesList extends Component {

    static navigationOptions = ({navigation}) => ({
        headerTitle: 'Languages',
    });

    constructor(props) {
 
      super(props);
   
      this.state = {
   
        isLoading: true,
        text: '',
        languages:[]
      
      }
   
    }
   
    componentDidMount() {
   
      return fetch('https://stagingapi.autographamt.com/app/languages')
        .then((response) => response.json())
        .then((responseJson) => {
          var lanVer = []
          for(var key in responseJson){
            lanVer.push({"language":key,"languageCode":responseJson[key]})
          }
          this.setState({
            isLoading: false,
             languages: lanVer,
            })
        
          // console.log("json data "+JSON.stringify(responseJson))
        
        })
        .catch((error) => {
          console.error(error);
        });
        
    }
   
    GetListViewItem (value) {
     this.props.navigation.navigate('VersionList',  {languages: value });
    }
    
    ListViewItemSeparator = () => {
      return (
        <View
          style={{
            height: .5,
            width: "100%",
            backgroundColor: "#000",
          }}
        />
      );
    }
   
   
    render() {
      console.log("lANGUAGES .....",this.state.languages)
      return (
        <View style={styles.MainContainer}>
        {/* <TextInput 
         style={styles.TextInputStyleClass}
         onChangeText={(text) => this.SearchFilterFunction(text)}
         value={this.state.text}
         underlineColorAndroid='transparent'
         placeholder="Search Here"
          /> */}
          {this.state.languages.length > 0 ? 
          <FlatList 
            data={this.state.languages}
            extraData={this.state}
            renderItem={({item}) => (
              <Text onPress={this.GetListViewItem.bind(this, item)}>{item.language}</Text>)
            }
            // renderRow={({rowData}) => <Text style={styles.rowViewContainer} 
            // onPress={this.GetListViewItem.bind(this, rowData)}>{rowData}</Text>}
   
            // enableEmptySections={true}
   
            // style={{marginTop: 10}}
   
          />
          :null}
        </View>
      );
    }

}
const styles = StyleSheet.create({
 
    MainContainer :{
    
     justifyContent: 'center',
     flex:1,
     margin: 7,
    
     },
    
    rowViewContainer: {
      fontSize: 17,
      padding: 10
     },
    
     TextInputStyleClass:{
           
      textAlign: 'center',
      height: 40,
      borderWidth: 1,
      borderColor: '#009688',
      borderRadius: 7 ,
      backgroundColor : "#FFFFFF"
           
      }
    
   });
   