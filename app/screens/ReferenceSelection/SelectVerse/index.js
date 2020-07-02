import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import SelectionGrid from '../../../components/SelectionGrid/';
import { numberSelection } from './styles.js';
import {connect} from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialIcons'

 class SelectVerse extends Component {
   
  constructor(props){
    super(props)
    this.state = {
      verseData:Array.from(new Array(this.props.screenProps.totalVerses), (x,i) => i+1),
    }
    this.styles = numberSelection(this.props.colorFile, this.props.sizeFile);   

  }
  static getDerivedStateFromProps(nextProps, prevState) {
      return{verseData:Array.from(new Array(nextProps.screenProps.totalVerses), (x,i) => i+1)}
  }
 
  onVerseSelected=(item,index)=> {
    this.props.screenProps.updateSelectedVerse(item,index)
  }
  
  render() {
    console.log("verseData ",this.state.totalVerses)
    return (
      <View style={{flex:1}}>
      <SelectionGrid
      styles={this.styles}
      onNumPress={(item)=>{this.onVerseSelected(item)}}
      numbers={this.state.verseData}
      loader={this.state.isLoading}
      heighlightedNumber={this.props.screenProps.selectedVerseNumber}
      />
      <Icon name="check-circle" color='rgba(62, 64, 149, 0.8)' onPress={()=>this.props.screenProps.updateSelectedVerse(null,null)}  size={64} style={{position:'absolute',bottom:0,right:0,padding:20}}/>
      </View>
    );
  }
}

const mapStateToProps = state =>{
  return{
    sizeFile:state.updateStyling.sizeFile,
    colorFile:state.updateStyling.colorFile,
  }
}
 export default connect(mapStateToProps,null)(SelectVerse)
