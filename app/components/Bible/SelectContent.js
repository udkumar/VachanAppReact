import React, { Component } from 'react';
import { Modal, Text, TouchableOpacity, View, Alert, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'



import { Card, Accordion } from 'native-base'
import { updateContentType, fetchAllContent, fetchVersionBooks, parallelMetadta } from '../../store/action/'
import { styles } from '../../screens/LanguageList/styles'
import { connect } from 'react-redux'
import Color from '../../utils/colorConstants'


var contentType = ''
class SelectContent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isExpanded: false,
    }
    this.alertPresent = false
    this.styles = styles(this.props.colorFile, this.props.sizeFile)
    this.alertPresent = false
  }

  _renderHeader = (item, expanded) => {
    var value = expanded && item.contentType
    console.log("content type ......", value)
    if (value) {
      contentType = value
    }
    return (
      <View style={this.styles.accordionHeader}>
        <Text style={this.styles.accordionHeaderText} >
          {" "}{item.contentType.charAt(0).toUpperCase() + item.contentType.slice(1)}

        </Text>
        <Icon style={this.styles.iconStyleSelection} name={expanded ? "keyboard-arrow-down" : "keyboard-arrow-up"} size={24} />
      </View>
    )
  }
  _renderHeaderInner = (item, expanded) => {
    return (
      <View style={this.styles.headerInner} >
        <Text style={this.styles.selectionHeaderModal}>
          {" "}{item.languageName}
        </Text>
        <Icon style={this.styles.iconStyleSelection} name={expanded ? "keyboard-arrow-down" : "keyboard-arrow-up"} size={24} />
      </View>
    )
  }

  _renderContentInner = (item) => {
    return (
      item.versionModels.map(v =>
        <TouchableOpacity
          style={this.styles.selectionInnerContent}
          onPress={() => {
            this.props.navigation.setParams({ modalVisible: false, visibleParallelView: true });
            this.props.updateContentType({
              parallelContentType: contentType, parallelContentLanguage: item.languageName,
              parallelContentLanguageCode: item.languageCode, parallelContentVersion: v.versionName,
              parallelContentVersionCode: v.versionCode, parallelContentSourceId: v.sourceId
            })
            this.props.fetchVersionBooks({
              language: item.languageName, versionCode: v.versionCode,
              downloaded: false, sourceId: v.sourceId
            })
            this.props.parallelMetadta({
              pCopyrightHolder: v.metaData[0].copyrightHolder,
              pDescription: v.metaData[0].description,
              pLicense: v.metaData[0].license,
              pSource: v.metaData[0].source,
              pTechnologyPartner: v.metaData[0].technologyPartner,
              pRevision: v.metaData[0].revision,
              pVersionNameGL: v.metaData[0].versionNameGL
            })
          }}
        >
          <Text style={this.styles.selectionHeaderModal}>{v.versionName}</Text>
          <Text style={this.styles.selectionHeaderModal}>{v.versionCode}</Text>
        </TouchableOpacity>)
    )
  }

  _renderContent = (item) => {
    return (
      <Accordion
        dataArray={item.content}
        animation={true}
        expanded={true}
        renderHeader={this._renderHeaderInner}
        renderContent={this._renderContentInner}
      />
    )
  }

  errorMessage() {
    if (!this.alertPresent) {
      this.alertPresent = true;
      if (this.props.error ||
        this.props.availableContents[0].content.length === 0 ||
        this.props.availableContents[1].content.length === 0 ||
        this.props.availableContents[2].content.length === 0
      ) {
        this.props.navigation.setParams({ modalVisible: false })
        Alert.alert("", "Check your internet connection", [{ text: 'OK', onPress: () => { this.alertPresent = false } }], { cancelable: false });
        this.props.fetchAllContent()
      } else {
        this.props.navigation.setParams({ modalVisible: !this.props.visible })
        this.alertPresent = false;
      }
    }
  }
  onPressModal = () => {
    this.errorMessage()
  }
  render() {
    this.styles = styles(this.props.colorFile, this.props.sizeFile)
    return (
      <View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.props.visible}
          onPress={() => { this.props.navigation.setParams({ modalVisible: this.props.visible }) }}
        >
          <View>
            <TouchableWithoutFeedback
              style={this.styles.modalContainer}
              onPressOut={() => { this.props.navigation.setParams({ modalVisible: false }) }}
            // onPress={this.onPressModal}
            >
              <View style={{ height: '80%', width: '70%', alignSelf: 'flex-end' }}>
                <Card style={{ marginTop: 40 }}>
                  <Accordion
                    dataArray={this.props.availableContents}
                    animation={true}
                    expanded={true}
                    renderHeader={this._renderHeader}
                    renderContent={this._renderContent}
                  />
                </Card>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </Modal>

        <TouchableOpacity onPress={this.onPressModal} style={[this.props.navStyles.touchableStyleRight, { flexDirection: 'row' }]}>
          <MaterialCommunityIcons
            name='book-open-variant'
            color={Color.White}
            size={24}
          />
        </TouchableOpacity>
      </View>

    )
  }
}

const mapStateToProps = state => {
  return {
    availableContents: state.contents.contentLanguages,
    error: state.contents.error,
    // isLoading:state.contents.loading,
    contentType: state.updateVersion.parallelContentType,

    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,

  }
}
const mapDispatchToProps = dispatch => {
  return {
    updateContentType: (content) => dispatch(updateContentType(content)),
    fetchAllContent: () => dispatch(fetchAllContent()),
    fetchVersionBooks: (payload) => dispatch(fetchVersionBooks(payload)),
    parallelMetadta: (payload) => dispatch(parallelMetadta(payload)),

  }
}
export default connect(mapStateToProps, mapDispatchToProps)(SelectContent)