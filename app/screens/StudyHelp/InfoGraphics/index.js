
import React, { Component } from 'react';
import { StyleSheet, Image, TouchableOpacity, Text, View } from 'react-native';
import { connect } from 'react-redux'
import { updateAudio, updateContentType } from '../../../store/action/'
import { NavigationEvents } from 'react-navigation';
import Color from '../../../utils/colorConstants'
import Icon from 'react-native-vector-icons/MaterialIcons'


class Infographics extends Component {

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state
    return {
      headerTitle: (
        <View style={{ flex: 1, marginRight: 10 }}>
          <TouchableOpacity style={styles.touchableStyleLeft}
          >
            <Text style={styles.headerTextStyle}>{params.file} </Text>
            <Icon name="arrow-drop-down" color={Color.White} size={24} />
          </TouchableOpacity>
        </View>
      ),
      headerTintColor: Color.White,
    }
  }
  constructor(props) {
    super(props)
    this.state = {
      GridViewItems: [],
      Height_Layout: '',
      Width_Layout: ''
    }
  }
  getImage = () => {
    this.props.navigation.setParams({ file: this.props.file })
  }
  componentDidMount() {
    this.props.navigation.setParams({
      bookName: this.props.bookName,
      currentChapter: this.props.chapterNumber,
      languageName: this.props.language,
      versionCode: this.props.version,
      updateContentType: this.props.updateContentType('Infographics'),
      file: this.props.file
    })
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <NavigationEvents
          onWillFocus={() => this.props.navigation.setParams({ file: this.props.file })}
        />
        <Image style={{ height: "98%", width: '98%' }} source={{ uri: this.props.filePath }} />
      </View>
    )
  }

}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
  },
  GridViewBlockStyle: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
    height: 220,
    margin: 5,
    backgroundColor: '#00BCD4'

  },
  GridViewInsideTextItemStyle: {
    color: Color.White,
    padding: 4,
    fontSize: 18,
    justifyContent: 'center',
  },
  headerLeftStyle: {
    flexDirection: 'row',
    flex: 1,
  },
  headerRightStyle: {
    flexDirection: 'row',
    flex: 1,
  },
  touchableStyleRight: {
    flexDirection: "row",
    marginRight: 10
  },
  touchableStyleLeft: {
    flexDirection: "row",
    marginLeft: 10,
  },
  headerTextStyle: {
    fontSize: 16,
    color: Color.White,
    textAlign: 'center'
  },
});
const mapStateToProps = state => {
  return {
    language: state.updateVersion.language,
    contentType: state.updateVersion.contentType,

    chapterNumber: state.updateVersion.chapterNumber,
    totalChapters: state.updateVersion.totalChapters,
    bookName: state.updateVersion.bookName,
    bookId: state.updateVersion.bookId,

    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,

    filePath: state.infographics.url,
    file: state.infographics.fileName

  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateAudio: (audio) => dispatch(updateAudio(audio)),
    updateContentType: (content) => dispatch(updateContentType(content)),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Infographics)
