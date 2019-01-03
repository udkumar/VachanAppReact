import React from 'react';

import {
  StyleSheet,
  View,
  Dimensions,
  Text
} from 'react-native';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
import {Segment,Button,Tab,Tabs} from 'native-base'
var screen = Dimensions.get('window');
const SearchResultTypes = {
    BOOK: 0,
    CHAPTER: 1,
    VERSE: 2
  };
export default class RenderSummary extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
        <Segment>
              <Button 
                style={[
                    {backgroundColor:this.props.activeTab === SearchResultTypes.BOOK ?  "#3F51B5":"#fff"},
                ]} 
                onPress={() =>this.props.toggleFunction(SearchResultTypes.BOOK)} 
                active={this.props.activeTab == SearchResultTypes.BOOK ? true : false} 
                first
              ><Text style={{paddingHorizontal:16}}>Book</Text></Button>
              <Button 
                 style={[
                    {backgroundColor:this.props.activeTab === SearchResultTypes.CHAPTER ?  "#3F51B5":"#fff"},
                ]} 
                onPress={() =>this.props.toggleFunction(SearchResultTypes.CHAPTER)} 
                active={this.props.activeTab == SearchResultTypes.BOOK ? true : false} 
              ><Text style={{paddingHorizontal:16}}>Chapter</Text></Button>
              <Button
                    style={[
                        {backgroundColor:this.props.activeTab === SearchResultTypes.VERSE ?  "#3F51B5":"#fff"},
                    ]} 
                    onPress={() =>this.props.toggleFunction(SearchResultTypes.VERSE)} 
                    active={this.props.activeTab == SearchResultTypes.BOOK ? true : false} 
                    last ><Text style={{paddingHorizontal:16}}>Verse</Text></Button>
        </Segment>
    );
  }

}

