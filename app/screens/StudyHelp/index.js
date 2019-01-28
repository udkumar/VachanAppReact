import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
const height = Dimensions.get('window').height;

export default class StudyHelp extends Component {
    constructor(props){
        super(props)
        console.log("PROPS ON NOTEPAD "+JSON.stringify(props))
        this.state ={
            close:this.props.screenProps.close
        }
    }
    static navigationOptions = ({navigation}) =>{
        const { params = {} } = navigation.state;
            return{
                headerTitle:(<Text style={{fontSize:16,color:"white",marginLeft:10}}>Study Help</Text>),
                headerRight:(
                    <Icon name="close"  style={{fontSize:20,marginRight:10,color:"#fff"}} onPress={() => {params.closeOnPress()}} />
                ),
                tabBarIcon: (<Icon name="list" size={35} style={{color:'#fff'}}/>)


            }
        }
    componentDidMount(){
        console.log("DID MOUNT OF NOTEPAD")
        this.props.navigation.setParams({ 
            closeOnPress: this.props.screenProps.closeSplitScreen,
        })
    }

  render() {
    return (
      <View>
            <FlatList
            data={[{key:'SUMMARY',screen:'Summary'},{key:'FOOTNOTES',screen:'Footnotes'},{key:'COMMANTRY',screen:'Commentry'},{key:'DICTIONARY',screen:'Dictionary'}]}
            numColumns={2}
            renderItem={({item}) =>
                <TouchableOpacity
                    style={{
                    flex:0.50,
                    borderRightWidth:1, 
                    borderBottomWidth:1,
                    height:height/5.5, 
                    justifyContent:"center"
                }}
                onPress={()=>{this.props.navigation.navigate(item.screen)}}
                >
                    <Text style={{textAlign:"center", alignItems:"center"}}>{item.key}</Text>
                </TouchableOpacity>
            }/>
      </View>
    );
  }
}
