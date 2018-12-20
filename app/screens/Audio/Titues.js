import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

import { AppRegistry, FlatList, StyleSheet, Text,Button,Image,
   View ,TouchableOpacity,Slider} from 'react-native';
var Sound = require('react-native-sound');
var song =null;

export default class Titusbible extends Component {

  static navigationOptions =({ navigation }) => ({
    //title: navigation.state.params.title,
  }
  )
constructor(props){
    super(props)

    this.state = {
        pause:false,
        SliderValue :  0
    };
}
// componentWillMount()
// {
//     song = new Sound('tt.mp3',Sound.MAIN_BUNDLE,(error) =>{
//         if (error) {
//             console.log('failed to load the sound', error);
//             return;
//           }
//     })
// }
onPressButton()
{
  song = new Sound('tt.mp3',Sound.MAIN_BUNDLE,(error) =>{
    if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      else{
        song.play((success) =>
        {
          if (!success) {
            console.log('successfully finished playing');
          }
        });

      }
})
    
}
onpauseButton(){
    if(song != null) {
            if(this.state.pause)
        song.play((success) => {
            if (!success) 
              console.log('successfully finished playing');
             });
             else song.pause();
             this.setState({pause:!this.state.pause});
            }
          
        }
 render(){
 
    return (
 <View style={styles.container}>

 {/* <Image
 style={{width: 500, height: 350}}
        source={require('../images/imagesound.jpeg')}/> */}
<View >

  <Text style = {{fontSize: 20}}>Slider Value = { this.state.SliderValue }</Text>
 
 <Slider
   step = { 1 }
   minimumValue = { 0 }
   maximumValue = { 100 }
   minimumTrackTintColor = "#009688"
   onValueChange={(ChangedValue) => this.setState({ SliderValue: ChangedValue })}
   style = {{ width: '100%' }} 
   />
  <Icon
  onPress={this.onPressButton.bind(this)}
    name='play-circle'
    size={60}
   color='#3b5998'
    style={{height:100,width:100}}/>
    <Icon
  onPress={this.onpauseButton.bind(this)}
    name='pause-circle'
    size={60}
   color='#3b5998'
    style={{height:100,width:100}}/>
  
</View>

{/* <TouchableOpacity onPress={this.onpauseButton.bind(this)}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>{this.state.pause ? 'resume':'pause'}</Text>
          </View>
        </TouchableOpacity> */}
      </View>
    );
    
}
}

const styles = StyleSheet.create({
    container: {
     flex: 1,
    margin: 10,
     paddingTop: 22,
     justifyContent: 'center',
    alignItems: 'center'
    },
    item: {
      padding: 10,
      fontSize: 18,
      height: 44,
    },
    buttonText: {
        padding: 20,
        color: '#841584'
      }
  })