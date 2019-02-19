import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AppRegistry, FlatList,translate,StyleSheet,Slider,  Text,Button,Image,
   View ,TouchableWithoutFeedback,Dimensions} from 'react-native';

   import songlist from '../Songlist/tt.mp3'
import Video from 'react-native-video';

var Sound = require('react-native-sound');

// song = new Sound('tt.mp3',Sound.MAIN_BUNDLE,(error) =>{
//   if (error) {
//       console.log('failed to load the sound', error);
//       return;
//     }
// })

 function secondsToTime(time) {
  return ~~(time/60)+ ":" + (time % 60 <10 ? "0":"")+ time %60;
}



export default class Titusbible extends Component {
  static navigationOptions = ({navigation}) =>{
    return{
        headerTitle:(<Text style={{fontSize:16,color:"white",marginLeft:10}}>Audio</Text>),
        headerRight:(
            <Icon name="close"  style={{fontSize:20,marginRight:10,color:"#fff"}}/>
        )
    }
}
 

 
constructor(props){
    super(props)
    //this.toggleplay= this.toggleplay.bind(this);
    this.state = {
      isPlaying: false,
      paused:false,
      progress: 0,
      duration:0,
     
    };
}
handleMainButtonTouch = () => {
  if (this.state.progress >= 1) {
    this.player.seek(0);
  }

   this.setState({ paused: !this.state.paused,})
};
handleProgressPress = e => {
  const position = e.nativeEvent.locationX;
  const progress = (position / 250) * this.state.duration;
  const isPlaying = !this.state.paused;
  this.player.seek(progress);
};

handleProgress=(progress)=>{

  this.setState({
    progress:progress.currentTime / this.state.duration
  })
}
handleLoad =(meta)=>{

this.setState({
  duration:meta.duration,
  paused: true
})
}
handleEnd = () => {
  this.setState({ paused: true });
};

// toggleplay(){
//   console.log("toggle")
//   if (this.state.progress >= 1) {
//     this.player.seek(0);
//   }
//   this.setState({ paused: !this.state.paused,})
//   if(song != null) {
//                 if(this.state.paused)
//             song.play((success) => {
//                 if (!success) 
//                   console.log('successfully finished playing');
//                  });
//                  else song.pause();
//                  this.setState({pause:!this.state.paused});
//                 }
              
//             }
  





 render(){
  const barWidth = Dimensions.get('screen').width - 10;
 
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
          paused={this.state.paused}
          source={songlist}
          onLoad={this.handleLoad}
          onProgress={this.handleProgress}
          ignoreSilentSwitch={"ignore"}
          playWhenInactive={true}
          playInBackground={true}
          muted={false}
          resizeMode={"cover"}
          repeat={false}
          onEnd={this.handleEnd}
          ref={ref => {
            this.player = ref;}}
          />
          
<TouchableWithoutFeedback onPress={this.handleProgressPress} >
 <Slider style={{position: 'absolute',alignSelf: 'center',bottom:30}}
            width={barWidth}
            value={this.state.progress}
            onSlidingStart={() => this.setState({paused: true})}
            />
</TouchableWithoutFeedback >
<TouchableWithoutFeedback >
        <Icon 
onPress={this.handleMainButtonTouch}
   name={!this.state.paused ? "pause" : "play"}
    size={40}
   color='#3b5998'
   
 
    style={{height:90,width:90, top:30,position: 'absolute',alignSelf: 'center', justifyContent: 'center',flexDirection: 'column',
    alignItems: 'center'}}/>
    </TouchableWithoutFeedback>
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