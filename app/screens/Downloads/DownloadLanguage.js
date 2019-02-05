import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
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

    constructor(props){
        super(props);
        this.state = {
            downloadData:[],
            isLoading: false,
            refreshing: false,
            isConnected:false
        }
        this.styles = downloadPageStyle(this.props.screenProps.colorFile, this.props.screenProps.sizeFile);
    }

    componentDidMount() {
        // console.log("file json "+JSON.stringify(bible_data.languages))
            // this.setState({downloadData:bible_data.languages})
            this.downloadBible()
    }
    downloadBible(){
        NetInfo.isConnected.fetch().then(isConnected => {
            console.log("connected")
            if(isConnected){
            this.setState({isConnected:true})
            }
            console.log('First, is ' + (isConnected ? 'online' : 'offline'));
          });
        
        this.setState({isLoading:true},() => {
            DownloadUtil.getLanguages()
            .then(res => {
                console.log("res = " + JSON.stringify(res.language))
                // console.log("len = " + res.languages_available.length)
                // this.setState({ myArray: [...this.state.myArray, 'new value'] })
                this.setState({isLoading: false, refreshing: false, downloadData:[...this.state.downloadData,res.language]})
            })
            .catch(error => {
                console.log("error in fetch " + error)
                this.setState({isLoading: false, refreshing: false})
            });
        })
    }
    renderItem = ({item,index})=>{
        return(
            <Card style={this.styles.cardStyle}>
                <TouchableOpacity onPress={()=> this.props.navigation.navigate('DownloadVersion', {item: item})} >
                    <CardItem style={this.styles.cardItemStyle}> 
                        <Text style={this.styles.textStyle}>{item}</Text>
                    </CardItem>
                </TouchableOpacity>
            </Card>
        )
    }

    render() {
        // if(this.state.dowsnloadData[0])
        // console.log("DATA ARRAY "+ JSON.stringify(this.state.downloadData.length) )
        return (
            <View style={this.styles.container}>
            <FlatList 
                 data={this.state.downloadData}
                 renderItem={this.renderItem}
            />
            {/* <Text>{this.state.downloadData}</Text> */}
            {/* <View style={this.styles.containerMargin}>
                {this.state.isLoading ? 
                <ActivityIndicator
                    animating={this.state.isLoading} 
                    size="large" 
                    color="#0000ff" /> 
                    :  !this.state.isConnected && this.state.downloadData.length == 0 ? 
                    <TouchableOpacity onPress={()=>this.downloadBible()} style={this.styles.emptyMessageContainer}>
                        <Icon name="signal-wifi-off" style={this.styles.emptyMessageIcon}/>
                        <Text style={this.styles.messageEmpty}>
                            No Internet Connection
                        </Text>
                    </TouchableOpacity>
                    :
                <FlatList
                    data={this.state.downloadData}
                    renderItem={this.renderItem}
                />
                }
            </View> */}
            </View>
        );
    }
}