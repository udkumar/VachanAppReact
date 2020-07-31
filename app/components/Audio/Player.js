import React, { Component } from 'react';
import {
  View,
  ActivityIndicator
} from 'react-native';
import Controls from './Controls';
import Video from 'react-native-video';
import { connect } from 'react-redux'
import { fetchAudioUrl } from '../../store/action'
import Color from '../../utils/colorConstants'

class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paused: true,
      totalLength: 1,
      currentPosition: 0,
      selectedTrack: 0,
      audioFile: null,
      repeatOn: false,
      shuffleOn: false,
    };
  }

  setDuration(data) {
    this.setState({ totalLength: Math.floor(data.duration) });
  }

  setTime(data) {
    this.setState({ currentPosition: Math.floor(data.currentTime) });
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
    this.refs.audioElement.seek(this.state.currentPosition - 5);
  }

  onForward() {
    this.refs.audioElement.seek(this.state.currentPosition + 5);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.props.loading ?
          <ActivityIndicator style={{ alignItems: 'center', justifyContent: 'center', }} size="large" color={Color.Blue_Color} /> :
          (this.props.audioURL &&
            <View style={this.props.styles.audiocontainer}>
              <Controls
                styles={this.props.styles}
                onPressRepeat={() => this.setState({ repeatOn: !this.state.repeatOn })}
                repeatOn={this.state.repeatOn}
                onPressShuffle={() => this.setState({ shuffleOn: !this.state.shuffleOn })}
                onPressPlay={() => this.setState({ paused: false })}
                onPressPause={() => this.setState({ paused: true })}
                onBack={this.onBack.bind(this)}
                onForward={this.onForward.bind(this)}
                paused={this.state.paused} />
              <Video source={{ uri: this.props.audioURL }} // Can be a URL or a local file.
                ref="audioElement"
                paused={this.state.paused}               // Pauses playback entirely.
                resizeMode="cover"           // Fill the whole screen at aspect ratio.
                repeat={false}                // Repeat forever.
                onLoadStart={this.loadStart} // Callback when video starts to load
                onLoad={this.setDuration.bind(this)}    // Callback when video loads
                onProgress={this.setTime.bind(this)}    // Callback every ~250ms with currentTime
                onEnd={this.onEnd}           // Callback when playback finishes
                onError={this.videoError}    // Callback when video cannot be loaded
              />
            </View>)
        }
      </View>
    );
  }
}



const mapStateToProps = state => {
  return {
    audioURL: state.audioFetch.url,
    error: state.audioFetch.error,
    loading: state.audioFetch.loading,

    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    fetchAudioUrl: (payload) => dispatch(fetchAudioUrl(payload)),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Player)


