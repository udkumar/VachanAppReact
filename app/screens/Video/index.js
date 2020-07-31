import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux'
import APIFetch from '../../utils/APIFetch'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { bookStyle } from './styles.js'
import { Card, CardItem } from 'native-base'


class Video extends Component {
  static navigationOptions = {
    headerTitle: 'Video',
  };

  constructor(props) {
    super(props);
    this.state = {
      videos: [],
      isLoading: false
    }
    this.styles = bookStyle(this.props.colorFile, this.props.sizeFile);
  }
  async fetchVideo() {
    const videos = await APIFetch.fetchVideo(this.props.languageCode)
    videoBook = []
    this.setState({ videos: videos[0].books })
    for (var key in videos[0].books) {
      videoBook.push({ bookId: key, details: videos[0].books[key] })
      console.log(" VIDEO KEY ", key, videos[0].books[key])
    }
    this.setState({ videos: videoBook })
  }
  playVideo(val) {
    const videoId = val.url.replace("https://youtu.be/", "");
    this.props.navigation.navigate("PlayVideo", { url: videoId, title: val.title, description: val.description, theme: val.theme })
  }
  onChangeState = (val) => {
    console.log("Value on change state ", val)
  }
  componentDidMount() {
    this.fetchVideo()
  }
  renderItem = ({ item }) => {
    var bookName = null
    if (this.props.books) {
      for (var i = 0; i <= this.props.books.length - 1; i++) {
        var bId = this.props.books[i].bookId
        if (bId == item.bookId) {
          bookName = this.props.books[i].bookName
        }
      }
    } else {
      this.setState({ bookmarksList: [] })
      return
    }
    var value = item.details.map(e =>
      <TouchableOpacity style={this.styles.videoView} onPress={() => this.playVideo(e)}>
        <Card>
          <CardItem>
            <Text style={this.styles.videoText}>{bookName} : {e.title}</Text>
          </CardItem>
        </Card>
      </TouchableOpacity>
    )
    return (
      <View>
        {bookName && value}
      </View>
    )
  }
  render() {

    return (
      <View style={this.styles.container}>
        {
          this.state.isLoading ?
            <ActivityIndicator animate={true} style={{ justifyContent: 'center', alignSelf: 'center' }} /> :
            <FlatList
              data={this.state.videos}
              contentContainerStyle={this.state.videos.length === 0 && this.styles.centerEmptySet}
              renderItem={this.renderItem}
              ListEmptyComponent={
                <View style={this.styles.emptyMessageContainer}>
                  <Icon name="video-library" style={this.styles.emptyMessageIcon} />
                  <Text
                    style={this.styles.messageEmpty}>
                    No Video for this language
                  </Text>
                </View>
              }
            />
        }
      </View>
    )
  }
}

const mapStateToProps = state => {
  return {
    languageCode: state.updateVersion.languageCode,
    books: state.versionFetch.data,
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
  }
}


export default connect(mapStateToProps, null)(Video)


