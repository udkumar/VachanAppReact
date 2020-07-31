import React, { Component } from 'react';
//Import React
import {  StyleSheet,View,Text } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

class VideoPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playing:true,
      paused: false,
    };
  }
  onError = () => alert('Oh! ', error);
  onReady(){
    this.setState({playing:true})
  }
  onChangeState(){
  }

  render() {
      console.log("YOUTUBE URL  ",this.props.url)
    return (
       <YoutubePlayer
          ref={'playerRef'}
          height={'50%'}
          width={'100%'}
          videoId={this.props.url}
          play={this.state.playing}
          onChangeState={event =>this.props.onChangeState(event)}
          onReady={() => this.onReady}
          onError={this.onError}
          onPlaybackQualityChange={q => console.log("QUALITY CHANGE ",q)}
          volume={50}
          playbackRate={1}
        />
       
    );
  }
}
const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  toolbar: {
    marginTop: 30,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  mediaPlayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'black',
  },
});
export default VideoPlayer;