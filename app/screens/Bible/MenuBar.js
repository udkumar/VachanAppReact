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
const { Popover } = renderers

export default class MennuBar extends Component {
    
 
    find_dimesions(layout){
      const {x, y, width, height} = layout;
    //   console.warn(x);
    //   console.warn(y);
      console.log("WIDTH",width)
      console.log("height",height)
    }
  render() {
        return (
            <View>
            {this.state.showBottomBar 
                ? 
                <View style={this.styles.bottomBar}>
            
                  <View style={this.styles.bottomOption}>
                  <TouchableOpacity onPress={this.doHighlight}  
                  >
                    <Text style={this.styles.bottomOptionText}>
                      {this.state.bottomHighlightText == true ? 'HIGHLIGHT' : 'REMOVE HIGHLIGHT' }
                    </Text>
                    <Icon name={'border-color'} color="white" size={24} style={this.styles.bottomOptionIcon} />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={this.styles.bottomOptionSeparator} />
                  
                  <View style={this.styles.bottomOption}>  
                    <TouchableOpacity onPress={this.addToNotes} 
                    >        
                      <Text style={this.styles.bottomOptionText}>
                        NOTES
                      </Text>
                      <Icon name={'note'} color="white" size={24} 
                      style={this.styles.bottomOptionIcon} 
                      />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={this.styles.bottomOptionSeparator} />          
            
                  <View style={this.styles.bottomOption}>   
                    <TouchableOpacity onPress={this.addToShare}  
                    >       
                      <Text style={this.styles.bottomOptionText}>
                        SHARE
                      </Text>
                      <Icon name={'share'} color="white" size={24} style={this.styles.bottomOptionIcon} />
                    </TouchableOpacity>
                  </View>
            
                </View>
                : null }
            </View>
        )
        
  }
}

