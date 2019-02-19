import React, { Component } from 'react';
import {
    Text, StyleSheet, View, ListView, TextInput, ActivityIndicator, Alert,
  NetInfo
} from 'react-native';
import DownloadUtil from '../../utils/DownloadUtil'
import {Card, CardItem} from 'native-base'
import {downloadPageStyle} from './styles.js'
import Icon from 'react-native-vector-icons/MaterialIcons'
import bible_data from '../../assets/TestLangApi.json'



export default class DownloadLanguage extends Component {

    static navigationOptions = ({navigation}) => ({
        headerTitle: 'Languages',
    });



    constructor(props) {
 
        super(props);
     
        this.state = {
     
          isLoading: true,
          text: '',
        
        }
     
        this.arrayholder = [] ;
      }
     
      componentDidMount() {
     
        return fetch('https://reactnativecode.000webhostapp.com/FruitsList.php')
          .then((response) => response.json())
          .then((responseJson) => {
            let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            this.setState({
              isLoading: false,
              dataSource: ds.cloneWithRows(responseJson),
            }, function() {
     
              // In this block you can do something with new state.
              this.arrayholder = responseJson ;
     
            });
          })
          .catch((error) => {
            console.error(error);
          });
          
      }
     
      GetListViewItem (fruit_name) {
        
       Alert.alert(fruit_name);
      
      }
      
       SearchFilterFunction(text){
         
         const newData = this.arrayholder.filter(function(item){
             const itemData = item.fruit_name.toUpperCase()
             const textData = text.toUpperCase()
             return itemData.indexOf(textData) > -1
         })
         this.setState({
             dataSource: this.state.dataSource.cloneWithRows(newData),
             text: text
         })
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
        if (this.state.isLoading) {
          return (
            <View style={{flex: 1, paddingTop: 20}}>
              <ActivityIndicator />
            </View>
          );
        }
     
        return (
     
          <View style={styles.MainContainer}>
     
          <TextInput 
           style={styles.TextInputStyleClass}
           onChangeText={(text) => this.SearchFilterFunction(text)}
           value={this.state.text}
           underlineColorAndroid='transparent'
           placeholder="Search Here"
            />
     
            <ListView
     
              dataSource={this.state.dataSource}
     
              renderSeparator= {this.ListViewItemSeparator}
     
              renderRow={(rowData) => <Text style={styles.rowViewContainer} 
     
              onPress={this.GetListViewItem.bind(this, rowData.fruit_name)} >{rowData.fruit_name}</Text>}
     
              enableEmptySections={true}
     
              style={{marginTop: 10}}
     
            />
     
          </View>
        );
      }

























    // constructor(props){
    //     super(props);
    //     this.state = {
    //         downloadData:[],
    //         isLoading: false,
    //         refreshing: false,
    //         isConnected:false
    //     }
    //     this.styles = downloadPageStyle(this.props.screenProps.colorFile, this.props.screenProps.sizeFile);
    // }

    // componentDidMount() {
    //     console.log("file json "+JSON.stringify(bible_data.languages))
    //         this.setState({downloadData:bible_data.languages})
    //        this.downloadBible()
    // }
    // downloadBible(){
    //     NetInfo.isConnected.fetch().then(isConnected => {
    //         console.log("connected")
    //         if(isConnected){
    //         this.setState({isConnected:true})
    //         }
    //         console.log('First, is ' + (isConnected ? 'online' : 'offline'));
    //       });
        
    //     this.setState({isLoading:true},() => {
    //         DownloadUtil.getLanguages()
    //         .then(res => {
    //             console.log("res = " + JSON.stringify(res))
    //             console.log("len = " + res)
    //             this.setState({isLoading: false, refreshing: false, downloadData: res.languages_available})
    //         })
    //         .catch(error => {
    //             console.log("error in fetch " + error);
    //             this.setState({isLoading: false, refreshing: false})
    //         });
    //     })
    // }
    // renderItem = ({item,index})=>{
    //     return(
    //         <Card style={this.styles.cardStyle}>
    //             <TouchableOpacity onPress={()=> this.props.navigation.navigate('DownloadVersion', {item: item})} >
    //                 <CardItem style={this.styles.cardItemStyle}> 
    //                     <Text style={this.styles.textStyle}>{item.langauge_name}</Text>
    //                 </CardItem>
    //             </TouchableOpacity>
    //         </Card>
    //     )
    // }

    // render() {
    //     // if(this.state.dowsnloadData[0])
    //     // console.log("DATA ARRAY "+ JSON.stringify(this.state.downloadData.length) )
    //     return (
    //         <View style={this.styles.container}>
    //         <FlatList 
    //              data={this.state.downloadData}
    //              renderItem={this.renderItem}
    //         />
    //         {/* <Text>{this.state.downloadData}</Text> */}
    //         {/* <View style={this.styles.containerMargin}>
    //             {this.state.isLoading ? 
    //             <ActivityIndicator
    //                 animating={this.state.isLoading} 
    //                 size="large" 
    //                 color="#0000ff" /> 
    //                 :  !this.state.isConnected && this.state.downloadData.length == 0 ? 
    //                 <TouchableOpacity onPress={()=>this.downloadBible()} style={this.styles.emptyMessageContainer}>
    //                     <Icon name="signal-wifi-off" style={this.styles.emptyMessageIcon}/>
    //                     <Text style={this.styles.messageEmpty}>
    //                         No Internet Connection
    //                     </Text>
    //                 </TouchableOpacity>
    //                 :
    //             <FlatList
    //                 data={this.state.downloadData}
    //                 renderItem={this.renderItem}
    //             />
    //             }
    //         </View> */}
    //         </View>
    //     );
    // }
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
   
