import React, { Component } from 'react';
import { ActivityIndicator, Text,TouchableOpacity ,Alert,FlatList,View} from 'react-native';
import {Card} from 'native-base'
import AsyncStorageUtil from '../../utils/AsyncStorageUtil'
import AsyncStorageConstants from '../../utils/AsyncStorageConstants'

export default class VersionList extends Component {
    constructor(props) {
        super(props);
        console.log("propsvalues........."+JSON.stringify(this.props.navigation.state.params))
        this.state = {
          langaugeProp:this.props.navigation.state.params ? this.props.navigation.state.params.languages.language : null,
          versionData:[],
          isLoading:false
        }
    }
    static navigationOptions = ({navigation}) => ({
      headerTitle: 'Versions',
  });
    _onLongPressButton =()=> {
      this.props.screenProps.Navigatehome()
    }
    componentDidMount(){
      return fetch('https://stagingapi.autographamt.com/app/versions')
        .then((response) => response.json())
        .then((responseJson) => {
          var data = []
          for(var key in responseJson.bible){
              if(key == this.state.langaugeProp){
                console.log("VERSION RESPONSE KEY"+JSON.stringify(responseJson.bible[key]))
                data.push(responseJson.bible[key])
              }
          }
          this.setState({
            isLoading: false,
            versionData:data
            })
        })
        .catch((error) => {
          console.error(error);
        });
    }
  
    fetchContent =(versionInfo)=>{
      for(var versionCode in versionInfo){
        console.log("version info "+versionCode)
        this.props.screenProps.updateLanguage(this.props.navigation.state.params.languages.languageCode,this.props.navigation.state.params.languages.language,versionCode,"Indian Revised Version")
        this.props.navigation.navigate('Bible',{versionId:versionInfo[versionCode].version_id})
        this.props.screenProps.updateVersionId(versionInfo[versionCode].version_id)
        AsyncStorageUtil.setAllItems([[AsyncStorageConstants.Keys.LanguageCode, this.props.navigation.state.params.languages.languageCode],
          [AsyncStorageConstants.Keys.LanguageName,this.props.navigation.state.params.languages.language],
          [AsyncStorageConstants.Keys.VersionCode,versionCode],
          [AsyncStorageConstants.Keys.VersionName,"Indian Revised Version"]
        ]);
      }
    
  }
  render() {
    return (
      <View style={{flex:1}}>
      {
        this.state.isLoading ? <ActivityIndicator/>  :null
      }
      
      {
         this.state.versionData.length > 0 ?  
         this.state.versionData.map((item)=>{
          return Object.keys(item).map((value,i) =>
          <TouchableOpacity onPress={()=>this.fetchContent(item)}>
            <Card style={{padding:8}} >
              <Text key={i}>{item[value].version_id}</Text>
            </Card>
          </TouchableOpacity>
        )
         })
         : null
       } 
     </View>
    );
  }
}