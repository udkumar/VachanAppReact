import React, { Component } from 'react';
import { ActivityIndicator, Text,TouchableOpacity ,Alert,FlatList,View} from 'react-native';
import {Card} from 'native-base'
import AsyncStorageUtil from '../../utils/AsyncStorageUtil'
import AsyncStorageConstants from '../../utils/AsyncStorageConstants'
import APIFetch from '../../utils/APIFetch'


export default class VersionList extends Component {
    constructor(props) {
        super(props);
        console.log("propsvalues........."+JSON.stringify(this.props.navigation.state.params))
        this.state = {
          langaugeProp:this.props.navigation.state.params ? this.props.navigation.state.params.languages.languageName : null,
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
    async componentDidMount(){
      this.setState({isLoading:true})
      const versionRes = await APIFetch.getVersions()
      var data = []
      for(var key in versionRes.bible){
          if(key == this.state.langaugeProp){
            console.log("VERSION RESPONSE KEY"+JSON.stringify(versionRes.bible[key]))
            data.push(versionRes.bible[key])
          }
      }
      this.setState({
        isLoading: false,
        versionData:data
        })
     
    }
  
    fetchContent =(versionInfo)=>{
      for(var versionCode in versionInfo){
        console.log("version info "+versionCode)
        this.props.screenProps.updateLanguage(this.props.navigation.state.params.languages.languageCode,this.props.navigation.state.params.languages.languageName,versionCode,"Indian Revised Version")
        this.props.navigation.navigate('Bible',{versionId:versionInfo[versionCode].version_id})
        this.props.screenProps.updateVersionId(versionInfo[versionCode].version_id)
        AsyncStorageUtil.setAllItems([[AsyncStorageConstants.Keys.LanguageCode, this.props.navigation.state.params.languages.languageCode],
          [AsyncStorageConstants.Keys.LanguageName,this.props.navigation.state.params.languages.languageName],
          [AsyncStorageConstants.Keys.VersionCode,versionCode],
          [AsyncStorageConstants.Keys.VersionName,"Indian Revised Version"]
        ]);
      }
    
  }
  render() {
    // console.log("is connected in version page "+this.props.screenProps.isConnected)
    console.log("version data "+JSON.stringify(this.state.versionData))
    return (
      <View style={{flex:1}}>
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
         :  <ActivityIndicator 
         animating={this.state.isLoading ? true : false} 
         size="large" 
         color="#0000ff" />
       } 
     </View>
    );
  }
}