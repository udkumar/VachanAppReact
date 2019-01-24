import React from 'react';

import {
  StyleSheet,
  View,
  Dimensions,
  ScrollView,
  Text
} from 'react-native';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
import {Segment,Button,Tab,Tabs} from 'native-base'

import {parseFile} from '../../utils/TextParser'
const activeTab = {
    BOOK: 0,
    CHAPTER: 1,
    VERSE: 2
  };
export default class RenderSummary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeTab :activeTab.BOOK,
      summaryOfBook:[],
    }
    this.toggleButton = this.toggleButton.bind(this)
  }
  componentDidMount(){
     parseFile(this.props.bookId,this.props.currentVisibleChapter).then((value)=>{
        this.setState({summaryOfBook:value})
      })
  }
  toggleButton(activeTab){
    if (this.state.activeTab == activeTab) {
      return;
    }

    this.setState({summaryOfBook: []}, () => {
      switch (activeTab) {
        case activeTab.BOOK: {
          parseFile(this.state.bookId,null).then((value)=>{
            console.log("value "+JSON.stringify(value))
            this.setState({summaryOfBook:value})
          })
          break;
        }
        case activeTab.CHAPTER: {
          parseFile(this.props.bookId,this.props.currentVisibleChapter).then((value)=>{
            console.log("value "+JSON.stringify(value))
            this.setState({summaryOfBook:value})
          })
          break;
        }
        case activeTab.VERSE: {
          break;
        }
      }
    })
    this.setState({activeTab})
  }
  render() {
    return (
      <View>
        <Segment>
              <Button 
                style={[
                    {backgroundColor:this.state.activeTab === activeTab.BOOK ?  "#3F51B5":"#fff"},
                ]} 
                onPress={() =>this.toggleButton(activeTab.BOOK)} 
                active={this.state.activeTab == activeTab.BOOK ? true : false} 
                first
              ><Text style={{paddingHorizontal:16}}>Book</Text></Button>
              <Button 
                 style={[
                    {backgroundColor:this.state.activeTab === activeTab.CHAPTER ?  "#3F51B5":"#fff"},
                ]} 
                onPress={() =>this.toggleButton(activeTab.CHAPTER)} 
                active={this.state.activeTab == activeTab.BOOK ? true : false} 
              ><Text style={{paddingHorizontal:16}}>Chapter</Text></Button>
              <Button
                    style={[
                        {backgroundColor:this.state.activeTab === activeTab.VERSE ?  "#3F51B5":"#fff"},
                    ]} 
                    onPress={() =>this.toggleButton(activeTab.VERSE)} 
                    active={this.state.activeTab == activeTab.BOOK ? true : false} 
                    last ><Text style={{paddingHorizontal:16}}>Verse</Text></Button>
        </Segment>
        {/* <ScrollView>
            {this.state.summaryOfBook.map((item)=>
              <Text>{item.key} {item.value}</Text>
            )}
            <View style={{height:65, marginBottom:4}} />
        </ScrollView> */}
    </View>
    )
  }

}

