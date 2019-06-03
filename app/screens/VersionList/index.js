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
          versionData:[],
          languageName:this.props.navigation.state.params ? this.props.navigation.state.params.versions.languageName:null,
          versionData:[]
        }
    }
    static navigationOptions = ({navigation}) => ({
      headerTitle: 'Versions',
  });
    _onLongPressButton =()=> {
      this.props.screenProps.Navigatehome()
    }
    async componentDidMount(){
      this.setState({
        versionData:this.props.navigation.state.params.versions.versionModels
        })
     
    }
  
    fetchContent =(versionInfo)=>{
        this.props.screenProps.updateLanguage('',this.state.languageName,versionInfo.versionCode,"Indian Revised Version")
        this.props.navigation.navigate('Bible',{versionId:versionInfo.versionId})
        this.props.screenProps.updateVersionId(versionInfo.versionId)
        AsyncStorageUtil.setAllItems([
          [AsyncStorageConstants.Keys.LanguageCode, ''],
          [AsyncStorageConstants.Keys.LanguageName,this.state.languageName],
          [AsyncStorageConstants.Keys.VersionCode,versionInfo.versionCode],
          [AsyncStorageConstants.Keys.VersionName,"Indian Revised Version"]
        ]);
    
  }
  render() {
    // console.log("version data "+JSON.stringify(this.state.versionData))
    return (
      <View style={{flex:1}}>
      {
         this.state.versionData.length > 0 ?  
         <FlatList 
            data={this.state.versionData}
            extraData={this.state}
            renderItem={({item}) => (
              <TouchableOpacity  onPress={()=>this.fetchContent(item)}>
                <Card style={{padding:8}}>
                  <Text>{item.versionName}</Text>
                </Card>
              </TouchableOpacity >
            )}
      
          />
         : <ActivityIndicator 
         size="large" 
         color="#0000ff" />
       } 
     </View>
    );
  }
}