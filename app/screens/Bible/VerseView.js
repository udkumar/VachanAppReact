import React, { Component } from 'react';
import {
  Text,
} from 'react-native';
import { connect } from 'react-redux'
import { getResultText } from '../../utils/UtilFunctions'

class VerseView extends Component {
  constructor(props) {
    super(props)
    this.itemHeights = []

  }
  onPress() {
    this.props.getSelection(
      this.props.index,
      this.props.chapterNumber,
      this.props.verseData.number,
      this.props.verseData.text
    );
  }

  has(selectedReferences, obj) {
    for (var i = 0; i < selectedReferences.length; i++) {
      if (selectedReferences[i] == obj) {
        return true;
      }
    }
    return false;
  }
  isHighlight() {
    for (var i = 0; i <= this.props.HightlightedVerse.length; i++) {
      if (this.props.HightlightedVerse[i] == this.props.verseData.number) {
        return true
      }
    }
    return false
  }
  // isNoted(){
  //   var arr =[]
  //   for(var i = 0 ;i<=this.props.notesList.length-1; i++ ){
  //     for(var j = 0 ;j<=this.props.notesList[i].verses.length-1; j++ ){
  //       var index = arr.indexOf(this.props.notesList[i].verses[j])
  //       if(index == -1){
  //         arr.push(this.props.notesList[i].verses[j])
  //       }
  //     }
  //     }
  //   var value = arr.filter(v=> v == this.props.verseData.number)
  //   if(value[0]){
  //     return true
  //   }
  //   else{ 
  //     return false
  //   }
  // }
  render() {
    let obj = this.props.chapterNumber + '_' + this.props.index + '_' + this.props.verseData.number + '_' + this.props.verseData.text;
    let isSelect = this.has(this.props.selectedReferences, obj)
    let isHighlight = this.isHighlight()
    if (this.props.verseData.number == 1) {
      return (
        <Text style={this.props.styles.textStyle}>
          {
            this.props.chapterHeader != null ?
              <Text style={this.props.styles.sectionHeading}>
                {this.props.chapterHeader} {"\n"}
              </Text>
              :
              null
          }
          <Text onPress={() => { this.onPress() }}>
            <Text style={this.props.styles.verseChapterNumber}>
              {this.props.chapterNumber}{" "}
            </Text>
            <Text style={[isSelect && isHighlight
              ? this.props.styles.verseTextSelectedHighlighted
              : !isSelect && !isHighlight
                ? this.props.styles.verseTextNotSelectedNotHighlighted
                : !isSelect && isHighlight
                  ? this.props.styles.verseTextNotSelectedHighlighted
                  : this.props.styles.verseTextSelectedNotHighlighted,
            ]}
            >
              {getResultText(this.props.verseData.text)}
            </Text>
          </Text>
          {
            (this.props.verseData.metadata && this.props.verseData.metadata[0].section) ?
              <Text style={this.props.styles.sectionHeading}>
                {"\n"} {this.props.verseData.metadata[0].section.text}
              </Text>
              : null
          }
          {/* {isNoted ? <Icon name="note-outline" size={20} style={{padding:8}} /> :null}  */}
        </Text>
      )
    }
    return (
      <Text style={this.props.styles.textStyle} onPress={() => { this.onPress() }} >
        <Text>
          <Text style={this.props.styles.verseNumber}>
            {this.props.verseData.number}{" "}
          </Text>
          <Text style={[isSelect && isHighlight
            ? this.props.styles.verseTextSelectedHighlighted
            : !isSelect && !isHighlight
              ? this.props.styles.verseTextNotSelectedNotHighlighted
              : !isSelect && isHighlight
                ? this.props.styles.verseTextNotSelectedHighlighted
                : this.props.styles.verseTextSelectedNotHighlighted,
          ]}
          >
            {getResultText(this.props.verseData.text)}
          </Text>
        </Text>
        {
          (this.props.verseData.metadata && this.props.verseData.metadata[0].section) ?
            <Text style={this.props.styles.sectionHeading}>
              {"\n"} {this.props.verseData.metadata[0].section.text}
            </Text>
            : null
        }
        {/* {isNoted ? <Icon name="note-outline" size={20} style={{padding:8}} /> :null}  */}
      </Text>
    )
  }
}

const mapStateToProps = state => {
  return {

    // chapterNumber:state.updateVersion.chapterNumber,
    bookId: state.updateVersion.bookId,
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,

  }
}

export default connect(mapStateToProps, null)(VerseView)