import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Card, CardItem } from 'native-base';
import { connect } from 'react-redux'
import firebase from 'react-native-firebase'
import { noteStyle } from './styles.js';

class Note extends Component {

  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Notes',

  });

  constructor(props) {
    super(props)
    this.state = {
      colorFile: this.props.colorFile,
      sizeFile: this.props.sizeFile,
      notesData: [],
      referenceList: [],
      isLoading: false
    }
    this.styles = noteStyle(props.colorFile, props.sizeFile);

    this.queryDb = this.queryDb.bind(this)
    this.onDelete = this.onDelete.bind(this)
  }

  onDelete = (createdTime, body, k, l) => {
    var data = [...this.state.notesData]
    data.forEach((a, i) => {
      var firebaseRef = firebase.database().ref("users/" + this.props.uid + "/notes/" + this.props.sourceId + "/" + a.bookId)
      if (i == k) {
        console.log("A ", a.notes.length)
        a.notes.forEach((b, j) => {
          if (b.body == body && j == l && createdTime == b.createdTime) {
            var updates = {}
            if (a.notes.length == 1) {
              data.splice(i, 1)
              updates[a.chapterNumber] = null
              firebaseRef.update(updates)
            }
            else {
              a.notes.splice(j, 1)
              updates[a.chapterNumber] = a.notes
              firebaseRef.update(updates)
            }
          }
        })
      }
    })
    this.setState({ notesData: data })
  }
  queryDb() {
    if (this.props.email) {
      this.setState({ isLoading: true }, () => {
        var firebaseRef = firebase.database().ref("users/" + this.props.uid + "/notes/" + this.props.sourceId)
        firebaseRef.once('value', (snapshot) => {
          if (snapshot.val() === null) {
            this.setState({ notesData: [], isLoading: false })
          }
          else {
            var arr = []
            var notes = snapshot.val()
            console.log(" log Notes ", snapshot.val())
            for (var bookKey in notes) {
              for (var chapterKey in notes[bookKey]) {
                if (notes[bookKey][chapterKey] != null) {
                  arr.push({
                    bookId: bookKey,
                    chapterNumber: chapterKey,
                    notes: Array.isArray(notes[bookKey][chapterKey]) ? notes[bookKey][chapterKey] : [notes[bookKey][chapterKey]]
                  })
                }
              }
            }
            arr.sort(function (a, b) {
              console.log(" notes date ", a.notes[0].modifiedTime)
              return new Date(b.notes[0].modifiedTime) - new Date(a.notes[0].modifiedTime)
            })
            this.setState({
              notesData: arr,
              isLoading: false
            })
          }
        })
        this.setState({ isLoading: false })
      })
    }
    else {
      console.log("not logged in")
    }
  }
  componentDidMount() {
    this.queryDb()
  }


  bodyText(text) {
    var jparse = text == '' ? '' : text
    var strParse = jparse.replace(/<(?:.|\n)*?>/gm, '');
    var strParse1 = strParse.replace('&nbsp', ' ')
    return strParse1 == '' ? 'No additional text' : strParse1
  }
  dateFormate(modifiedTime) {
    var date = new Date(modifiedTime).toLocaleString()
    return date
  }
  renderItem = ({ item, index }) => {
    var bookName = null
    if (this.props.books) {
      for (var i = 0; i <= this.props.books.length - 1; i++) {
        var bId = this.props.books[i].bookId
        if (bId == item.bookId) {
          bookName = this.props.books[i].bookName
        }
      }
    } else {
      this.setState({ notesData: [] })
      return
    }
    let value = item.notes && item.notes.map((val, j) =>
      <TouchableOpacity style={this.styles.noteContent}
        onPress={() => {
          this.props.navigation.navigate("EditNote", {
            bcvRef: {
              bookId: item.bookId,
              bookName: bookName,
              chapterNumber: item.chapterNumber,
              verses: val.verses
            },
            notesList: item.notes,
            contentBody: this.bodyText(val.body),
            // noteObject:item.notes,
            onbackNote: this.queryDb,
            noteIndex: j,
          })
        }}>
        <Card>
          <CardItem style={this.styles.cardItemStyle}>
            <View style={this.styles.notesContentView}>
              <Text style={this.styles.noteText} >{this.props.language} {this.props.versionCode} {bookName} {item.chapterNumber} {"-"} {val.verses.join()}</Text>
              <View style={this.styles.noteCardItem}>
                <Text style={this.styles.noteFontCustom}>{this.dateFormate(val.modifiedTime)}</Text>
                <Icon name="delete-forever" style={this.styles.deleteIon} onPress={() => this.onDelete(val.createdTime, val.body, index, j)} />
              </View>
            </View>
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
        {this.state.isLoading ?
          <ActivityIndicator animate={true} style={{ justifyContent: 'center', alignSelf: 'center' }} /> :
          <FlatList
            contentContainerStyle={this.state.notesData.length === 0
              ? this.styles.centerEmptySet : this.styles.noteFlatlistCustom}
            data={this.state.notesData}
            renderItem={this.renderItem}
            ListEmptyComponent={
              <View style={this.styles.emptyMessageContainer}>
                <Icon name="note" style={this.styles.emptyMessageIcon} onPress={() => { this.props.navigation.navigate("Bible") }} />
                <Text
                  style={this.styles.messageEmpty}>
                  Select verse to Note
                </Text>
              </View>
            }
          />
        }
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
    sourceId: state.updateVersion.sourceId,

    language: state.updateVersion.language,
    versionCode: state.updateVersion.versionCode,
    email: state.userInfo.email,
    uid: state.userInfo.uid,
    books: state.versionFetch.data,

  }
}

export default connect(mapStateToProps, null)(Note)