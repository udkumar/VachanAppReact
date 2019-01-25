import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import { AppRegistry, FlatList,translate,StyleSheet,Slider, Text,Button,Image,
   View ,TouchableWithoutFeedback,Dimensions} from 'react-native';
import Video from 'react-native-video';

var Sound = require('react-native-sound');

song = new Sound('tt.mp3',Sound.MAIN_BUNDLE,(error) =>{
  if (error) {
      console.log('failed to load the sound', error);
      return;
    }
})
 function secondsToTime(time) {
  return ~~(time/60)+ ":" + (time % 60 <10 ? "0":"")+ time %60;
}



//var song =null;

export default class Titusbible extends Component {
  static navigationOptions = ({navigation}) =>{
    const { params = {} } = navigation.state;
        return{
            headerTitle:(<Text style={{fontSize:16,color:"white",marginLeft:10}}>Audio</Text>),
            headerRight:(
                <Icon name="close"  style={{fontSize:20,marginRight:10,color:"#fff"}} onPress={() => {params.closeOnPress()}} />
            ),

        }
    }
  increase = (key, value) => {
    this.setState({
      [key]: this.state[key] + value,
    });
  }

 
constructor(props){
    super(props)
    this.toggleplay= this.toggleplay.bind(this);
    this.state = {
      isPlaying: false,
      paused:false,
      close:this.props.screenProps.close,
      progress: 0,
      duration:0,
      progressWithOnComplete: 0,
      progressCustomized: 0,
    };
}
handleProgressPress = e => {
  const position = e.nativeEvent.locationX;
  const progress = (position / 250) * this.state.duration;
  const isPlaying = !this.state.paused;
  
  this.song.seek(progress);
};

handleProgress=(progress)=>{

  this.setState({
    progress:progress.currentTime / this.state.duration
  })
}
handleLoad =(meta)=>{

this.setState({
  duration:meta.duration
})
}
handleEnd = () => {
  this.setState({ paused: true });
};

toggleplay(){
  console.log("toggle")
  if (this.state.progress >= 1) {
    this.song.seek(0);
  }
  this.setState({ paused: !this.state.paused,})
  if(song != null) {
                if(this.state.paused)
            song.play((success) => {
                if (!success) 
                  console.log('successfully finished playing');
                 });
                 else song.pause();
                 this.setState({pause:!this.state.paused});
                }
              
            }
  
  componentDidMount(){
      console.log("DID MOUNT OF NOTEPAD")
      this.props.navigation.setParams({ 
          closeOnPress: this.props.screenProps.closeSplitScreen,
      })
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
// onPressButton()
// {
//   song = new Sound('tt.mp3',Sound.MAIN_BUNDLE,(error) =>{
//     if (error) {
//         console.log('failed to load the sound', error);
//         return;
//       }
//       else{
//         song.play((success) =>
//         {
//           if (!success) {
//             console.log('successfully finished playing');
//           }
//         });

//       }
// })
    
// }
// onpauseButton(){
//     if(song != null) {
//             if(this.state.pause)
//         song.play((success) => {
//             if (!success) 
//               console.log('successfully finished playing');
//              });
//              else song.pause();
//              this.setState({pause:!this.state.pause});
//             }
          
//         }



 render(){
  const barWidth = Dimensions.get('screen').width - 10;
  const progressCustomStyles = {
    backgroundColor: 'red', 
    borderRadius: 0,
    borderColor: 'orange'}
 
    return (
 <View style={styles.container}>

 
<View >

  
  <Image
 style={{  width: 220, height: 200, marginTop: -50, 

 bottom: 50,  flexDirection: 'column',
 justifyContent: 'center',
 alignItems: 'center',
 position: 'absolute',
 alignSelf: 'center',
 
}}
source={require('../../assets/backmusic.jpg')}/>
 <Video
          pause={this.state.pause}
          source={{uri:'https://www.robtowns.com/music/blind_willie.mp3'}}
          onLoad={this.handleLoad}
          
          onProgress={this.handleProgress}
          onEnd={this.handleEnd}
          ref={ref => {
            this.song = ref;}}
          />
          
<TouchableWithoutFeedback onPress={this.handleProgressPress} >
 <Slider style={{position: 'absolute',alignSelf: 'center',bottom:30}}
            width={barWidth}
            value={this.state.progress}
            
            
          />
</TouchableWithoutFeedback>
        <Icon
  onPress={this.toggleplay}
   name={!this.state.paused ? "pause" : "play"}
    size={40}
   color='#3b5998'
   
 
    style={{height:90,width:90, top:30,position: 'absolute',alignSelf: 'center', justifyContent: 'center',flexDirection: 'column',
    alignItems: 'center'}}/>
    
     <Icon
 name='backward'
    size={30}
   color='#3b5998'
    style={{height:50,width:50,position: 'absolute' ,right:100, top:30,
    flexDirection: 'row', justifyContent: 'center'}}/>
    <Icon
 name='forward'
    size={30}
   color='#3b5998'
    style={{height:50,width:50,position: 'absolute',left: 80, top:30, flexDirection: 'row', justifyContent: 'center'}}/>


     <TouchableWithoutFeedback >
          <Text style={styles.duration}>{
            secondsToTime(Math.floor(this.state.progress*this.state.duration))}
            </Text>
          </TouchableWithoutFeedback>
         
  {/* <Icon
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
   */}
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
      },
      duration: {
        marginLeft:15,
        color: '#841584'
      },
      buttonContainer: {
        marginTop: 15,
      },
      separator: {
        marginVertical: 30,
        borderWidth: 0.5,
        borderColor: '#DCDCDC',
      },
  })