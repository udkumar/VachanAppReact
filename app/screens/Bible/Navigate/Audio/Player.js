import React, { Component } from 'react';
import {
  View,
  Text,
  StatusBar,
  ToastAndroid
} from 'react-native';
import SeekBar from './SeekBar';
import Controls from './Controls';
import Video from 'react-native-video';
import {GIT_BASE_API} from '../../../../utils/APIConstant/'
import {fetchAPI} from '../../../../store/action/'
import {connect} from 'react-redux'
class Player extends Component {
  constructor(props) {
    super(props);

    this.state = {
      paused: true,
      totalLength: 1,
      currentPosition: 0,
      selectedTrack: 0,
      audioFile:null,
      repeatOn: false,
      shuffleOn: false,
      // visibleAudio:false
    };
  }

  setDuration(data) {
    this.setState({totalLength: Math.floor(data.duration)});
  }

  setTime(data) {
    this.setState({currentPosition: Math.floor(data.currentTime)});
  }

  seek(time) {
    time = Math.round(time);
    this.refs.audioElement && this.refs.audioElement.seek(time);
    this.setState({
      currentPosition: time,
      paused: false,
    });
  }

  onBack() {
    this.refs.audioElement.seek(this.state.currentPosition-5);
    // if (this.state.currentPosition < 10 && this.state.selectedTrack > 0) {
    //   this.refs.audioElement && this.refs.audioElement.seek( 0)
    //   this.setState({ isChanging: true });
    //   setTimeout(() => this.setState({
    //     currentPosition: 0,
    //     paused: false,
    //     totalLength: 1,
    //     isChanging: false,
    //     selectedTrack: this.state.selectedTrack - 1,
    //   }), 0);
    // } else {
    //   this.refs.audioElement.seek(0);
    //   this.setState({
    //     currentPosition: 0,
    //   });
    // }
  }

  onForward() {
    
    this.refs.audioElement.seek(this.state.currentPosition+5);

    /* if (this.state.selectedTrack < this.props.tracks.length - 1) {
      this.refs.audioElement && this.refs.audioElement.seek(0);
      this.setState({ isChanging: true });
      setTimeout(() => this.setState({
        currentPosition: 0.5,
        totalLength: 1,
        paused: false,
        isChanging: false,
        selectedTrack: this.state.selectedTrack + 1,
      }), 0);
    } */
  }

 async  fetchMP3(){
    this.props.apiData = []
    const version_code = this.props.version.toLowerCase() 
    // console.log("MP3 RESPONSE ",response,this.props.languageCode,this.props.version,this.props.bookId,this.props.currentChapter)
    var apiURL =   GIT_BASE_API + this.props.languageCode + "/" + version_code + "/" + this.props.bookId + "/" + this.props.currentChapter + ".mp3"
     await this.props.fetchAPI(apiURL,'mp3')
     var res = await this.props.apiData
    console.log("response url audio ",res.url)
    if(res.length !==0){
    console.log("response url audio ",res.url)
      this.setState({audioFile:res.url})
      if(this.props.error){
        this.setState({audioFile:null})
      }
    }
    }
    static getDerivedStateFromProps(nextProps, prevState){
      console.log("nextProps..........",nextProps,"prevState|||||||||||||||",prevState)
      // if(nextProps.audioFile !== prevState.audioFile){
        return { audioFile: nextProps.apiData.url};
    //  }
    //  else return null;
   }
    componentDidUpdate(prevProps, prevState) {
      // only update chart if the data has changed
      if (prevProps.language !== this.props.language || prevProps.version !==this.props.version || prevProps.bookId !==this.props.bookId || prevProps.currentChapter !==this.props.currentChapter ) {
       this.fetchMP3()
      }
    }
    componentDidMount(){
      this.fetchMP3()
    }

  render() {
    const track = this.state.audioFile;
    return (
      <View style={styles.container}>
        {/* <SeekBar
          onSeek={this.seek.bind(this)}
          trackLength={this.state.totalLength}
          onSlidingStart={() => this.setState({paused: true})}
          currentPosition={this.state.currentPosition} /> */}
          <Controls
          onPressRepeat={() => this.setState({repeatOn : !this.state.repeatOn})}
          repeatOn={this.state.repeatOn}
          // shuffleOn={this.state.shuffleOn}
          // forwardDisabled={this.state.selectedTrack === this.props.tracks.length - 1}
          onPressShuffle={() => this.setState({shuffleOn: !this.state.shuffleOn})}
          onPressPlay={() => this.setState({paused: false})}
          onPressPause={() => this.setState({paused: true})}
          onBack={this.onBack.bind(this)}
          onForward={this.onForward.bind(this)}
          paused={this.state.paused}/>
        <Video source={{uri: track}} // Can be a URL or a local file.
          ref="audioElement"
          paused={this.state.paused}               // Pauses playback entirely.
          resizeMode="cover"           // Fill the whole screen at aspect ratio.
          repeat={false}                // Repeat forever.
          onLoadStart={this.loadStart} // Callback when video starts to load
          onLoad={this.setDuration.bind(this)}    // Callback when video loads
          onProgress={this.setTime.bind(this)}    // Callback every ~250ms with currentTime
          onEnd={this.onEnd}           // Callback when playback finishes
          onError={this.videoError}    // Callback when video cannot be loaded
          style={styles.audioElement} />
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
  },
  audioElement: {
    height: 0,
    width: 0,
  }
};


const mapStateToProps = state =>{
  return{
    apiData:state.APIFetch.data,
    isFetching:state.APIFetch.isFetching,
    error:state.APIFetch.error,
  }
}

const mapDispatchToProps = dispatch =>{
  return {
    fetchAPI:(api) =>dispatch(fetchAPI(api))
  }
}
export  default connect(mapStateToProps,mapDispatchToProps)(Player)