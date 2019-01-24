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
    static navigationOptions = ({navigation}) =>{
        return{
            headerTitle:(<Text style={{fontSize:16,color:"white",marginLeft:10}}>StudyHelp</Text>),
            headerRight:(
                <Icon name="close"  style={{fontSize:20,marginRight:10,color:"#fff"}}/>
            )
        }
    }

  render() {
    return (
      <View>
            <FlatList
            data={[{key:'SUMMARY',screen:'Summary'},{key:'FOOTNOTES',screen:'Foonotes'},{key:'COMMANTRY',screen:'Commentry'},{key:'DICTIONARY',screen:'Dictionary'}]}
            numColumns={2}
            renderItem={({item}) =>
                <TouchableOpacity
                    style={{
                    flex:0.50,
                    borderRightWidth:1, 
                    borderBottomWidth:1,
                    height:height/6, 
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
