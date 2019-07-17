import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableWithoutFeedback
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
const Constants = require('../../utils/constants')
import {getResultText} from '../../utils/UtilFunctions';
import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers,
} from 'react-native-popup-menu';
const { Popover } = renderers

export default class VerseView extends Component {

  constructor(props){
    super(props)
    this.state  = {
      opened:false
    }
  }

  has(selectedReferences, obj) {
    for(var i = 0; i < selectedReferences.length; i++) {
      if (selectedReferences[i] == obj) {
        return true;
      }
    }
    return false;
  }
  onBackdropPress(){
    this.setState({ opened: false });
  }

  highlighted = (verse) =>{ 
    var found = false;
      for(var i=0; i<= this.props.HightlightedVerse.length-1; i++ ){
        if(this.props.HightlightedVerse[i].verseNumber == verse && this.props.HightlightedVerse[i].chapterNumber == this.props.chapterNumber) {
          // console.log("verse "+verse+" highlighted verse "+this.props.HightlightedVerse[i].verseNumber)
          found = true
        }
      }
      // return found
      if(found){
        return true
      }
      else{
        return false
      }
    }
  render() {
    const TriggerMenuOnText = () => (
      <Text>
          <Text style={this.props.styles.verseNumber} >
             {this.props.verseData.number}{" "}
           </Text>
             <Text style={isSelect && isHighlight 
                   ? this.props.styles.verseTextSelectedHighlighted 
                     : !isSelect && !isHighlight 
                     ? this.props.styles.verseTextNotSelectedNotHighlighted
                     : !isSelect && isHighlight
                     ? this.props.styles.verseTextNotSelectedHighlighted
                     : this.props.styles.verseTextSelectedNotHighlighted}
                     >
               {getResultText(this.props.verseData.text)}
            </Text> 
          </Text>
    )
    
    let obj = this.props.chapterNumber + '_' + this.props.index + '_' + this.props.verseData.number;
    let isSelect = this.has(this.props.selectedReferences, obj)
    let isHighlight = this.highlighted(this.props.verseData.number)

        return (
          <Menu onSelect={value => alert(`Selected number: ${value}`)}>
            <MenuTrigger text={<TriggerMenuOnText/>}/>
            <MenuOptions style={{flexDirection:'row',justifyContent:"center"}}>
                       <MenuOption 
                        optionsContainerStyle={{width:200}} 
                         onSelect={this.props.makeHighlight}  
                         style={{alignItems:'center' }}
                       >
                         <Text >{this.props.HighlightedText == true ? "Highlight" : "Remove Highlight"}</Text>
                       </MenuOption>
                       <MenuOption  onSelect={this.props.makeNotes} style={{alignItems:'center'}}>
                         <Text>Note</Text>
                       </MenuOption>
                       <MenuOption onSelect={this.props.share} style={{alignItems:'center'}}>
                         <Text>Share</Text>
                       </MenuOption>
             </MenuOptions>
          </Menu>
        )
        
  }
}