import React, { Component } from 'react';
import {
  View,
  Text,
  WebView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'

// import DbQueries from '../utils/dbQueries'

export default class Video extends Component {
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
          headerTitle:(<Text style={{fontSize:14,color:"white",marginLeft:10}}>Video</Text>),
          headerRight:(
              <Icon name="close"  style={{fontSize:20,marginRight:10,color:"#fff"}} onPress={() => {params.closeOnPress()}} />
          ),
          tabBarIcon: (<Icon name="video-library" size={20} style={{color:'#fff'}}/>)


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
      <View style={{ height: 240 }}>
       <WebView
          javaScriptEnabled={true}
          domStorageEnabled={true}
          source={{ uri: "https://www.youtube.com/embed/0iayQ1xPsnc" }}

        />
      </View>
    );
  }
}
