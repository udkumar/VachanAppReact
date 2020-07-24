import React, { Component } from 'react';
import {
  Dimensions,
  FlatList,
  Alert,
  Text,
  View
} from 'react-native';
import { connect } from 'react-redux'
import { Body, Header, Right, Title, Button } from 'native-base'
import { fetchCommentaryContent, fetchVersionBooks } from '../../../store/action/index'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles'
import Color from '../../../utils/colorConstants'
import ReloadButton from '../../../components/ReloadButton';
import HTML from 'react-native-render-html';


class Commentary extends Component {

  constructor(props) {
    super(props)
    this.state = {
      commentary: []
    }
    this.styles = styles(this.props.colorFile, this.props.sizeFile)
    this.alertPresent = false
  }
  componentDidMount() {
    this.props.fetchCommentaryContent({ parallelContentSourceId: this.props.parallelContentSourceId, bookId: this.props.bookId, chapter: this.props.currentVisibleChapter })
  }
  componentDidUpdate(prevProps) {
    if (this.props.bookId != prevProps.bookId || prevProps.currentVisibleChapter != this.props.currentVisibleChapter) {
      this.props.fetchCommentaryContent({ parallelContentSourceId: this.props.parallelContentSourceId, bookId: this.props.bookId, chapter: this.props.currentVisibleChapter })
    }
  }

  errorMessage() {
    if (!this.alertPresent) {
      this.alertPresent = true;
      if (this.props.error) {
        Alert.alert("", "Check your internet connection", [{ text: 'OK', onPress: () => { this.alertPresent = false } }], { cancelable: false });
        this.props.fetchCommentaryContent({ parallelContentSourceId: this.props.parallelContentSourceId, bookId: this.props.bookId, chapter: this.props.currentVisibleChapter })
      } else {
        this.alertPresent = false;
      }
    }
  }
  updateData = () => {
    this.errorMessage()
  }
  componentWillUnmount() {
    this.props.fetchVersionBooks({
      language: this.props.language,
      versionCode: this.props.versionCode,
      downloaded: this.props.downloaded, sourceId: this.props.sourceId
    })
  }
  render() {
    const bookId = this.props.bookId
    const value = this.props.books.length != 0 && this.props.books.filter(function (entry) {
      return entry.bookId == bookId
    })
    const bookName = value ? value[0].bookName : this.props.bookName
   
    return (
      <View style={this.styles.container}>
        <Header style={{ height: 40, borderLeftWidth: 0.5, borderLeftColor: Color.White }} >
          <Body>
            <Title style={{ fontSize: 16 }}>{this.props.parallelContentVersionCode}</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => this.props.toggleParallelView(false)}>
              <Icon name='cancel' color={Color.White} size={20} />
            </Button>
          </Right>
        </Header>

        {
          (this.props.error) ?
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ReloadButton
                styles={this.styles}
                reloadFunction={this.updateData}
              />
            </View>
            :
            <View style={{ flex: 1 }}>
              <Text style={[this.styles.commentaryHeading, { margin: 10 }]}>{bookName} {} {this.props.commentaryContent.chapter}</Text>
              <FlatList
                data={this.props.commentaryContent.commentaries}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1, margin: 16 }}
                renderItem={({ item }) => (
                  <View style={{ padding: 10 }}>
                    {item.verse &&
                      (item.verse == 0 ?
                        <Text style={this.styles.commentaryHeading}>Chapter Intro</Text> :
                        <Text style={this.styles.commentaryHeading}>Verse Number : {item.verse}</Text>
                      )}
                    <HTML 
                    tagsStyles={{p:this.styles.textString}} html={item.text} imagesMaxWidth={Dimensions.get('window').width} />
                  </View>
                )}
                ListFooterComponent={<View style={{ height: 40, marginBottom: 40 }}></View>}
                ListHeaderComponent={<View>
                  {this.props.commentaryContent.bookIntro == '' ? null :
                    <View style={this.styles.cardItemBackground}>
                      <Text style={this.styles.commentaryHeading}>Book Intro</Text>
                    <HTML tagsStyles={{p:this.styles.textString}} html={this.props.commentaryContent.bookIntro} imagesMaxWidth={Dimensions.get('window').width} />
                    </View>}
                </View>}
              />
            </View>
        }
      </View>
    )
  }
}


const mapStateToProps = state => {
  return {

    language: state.updateVersion.language,
    versionCode: state.updateVersion.versionCode,
    sourceId: state.updateVersion.sourceId,
    downloaded: state.updateVersion.downloaded,

    chapterNumber: state.updateVersion.chapterNumber,
    totalChapters: state.updateVersion.totalChapters,
    bookName: state.updateVersion.bookName,
    bookId: state.updateVersion.bookId,
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,

    contentType: state.updateVersion.contentType,
    books: state.versionFetch.data,

    parallelContentSourceId: state.updateVersion.parallelContentSourceId,
    parallelContentVersionCode: state.updateVersion.parallelContentVersionCode,
    parallelContentLanguage: state.updateVersion.parallelContentLanguage,
    commentaryContent: state.commentaryFetch.commentaryContent,
    error: state.commentaryFetch.error,
    parallelContentLanguageCode: state.updateVersion.parallelContentLanguageCode
  }

}
const mapDispatchToProps = dispatch => {
  return {

    fetchCommentaryContent: (payload) => dispatch(fetchCommentaryContent(payload)),
    fetchVersionBooks: (payload) => dispatch(fetchVersionBooks(payload)),

  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Commentary)