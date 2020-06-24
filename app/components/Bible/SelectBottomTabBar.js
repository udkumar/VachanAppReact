import React, {Component} from 'react';
import {Text,TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'


const SelectBottomTabBar = ({styles,bottomHighlightText,doHighlight,addToNotes,addToShare})=>(
    <View style={styles.bottomBar}>
  
    <View style={styles.bottomOption}>
    <TouchableOpacity onPress={doHighlight}
    >
      <Text style={styles.bottomOptionText}>
      {bottomHighlightText == true ? 'HIGHLIGHT' : 'REMOVE HIGHLIGHT' }
      </Text>
      <Icon name={'border-color'} color="white" size={24} style={styles.bottomOptionIcon} />
      </TouchableOpacity>
    </View>
    
    <View style={styles.bottomOptionSeparator} />
    
    <View style={styles.bottomOption}>  
      <TouchableOpacity onPress={addToNotes} 
      >        
        <Text style={styles.bottomOptionText}>
          NOTES
        </Text>
        <Icon name={'note'} color="white" size={24} 
        style={styles.bottomOptionIcon} 
        />
      </TouchableOpacity>
    </View>
    
    <View style={styles.bottomOptionSeparator} />          

    <View style={styles.bottomOption}>   
      <TouchableOpacity onPress={addToShare}>       
        <Text style={styles.bottomOptionText}>
          SHARE
        </Text>
        <Icon name={'share'} color="white" size={24} style={styles.bottomOptionIcon} />
      </TouchableOpacity>
    </View>
    <View style={styles.bottomOptionSeparator} />   
  </View>
)
  

export default SelectBottomTabBar

// import React, {Component} from 'react';
// import {Text,TouchableOpacity, View} from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons'


// export default class SelectBottomTabBar extends Component {
//   constructor(props){
//     super(props)
//     console.log(" PROPS IN SELECT BOTTOM TAB BAR ",props)
//   }
//   render(){
//     return(
//       <View style={{flex:1}}>
//       <View style={this.props.styles.bottomOption}>
//       <TouchableOpacity onPress={()=>this.props.doHighlight}
//       >
//         <Text style={this.props.styles.bottomOptionText}>
//         {this.props.bottomHighlightText == true ? 'HIGHLIGHT' : 'REMOVE HIGHLIGHT' }
//         </Text>
//         <Icon name={'border-color'} color="white" size={24} style={this.props.styles.bottomOptionIcon} />
//         </TouchableOpacity>
//       </View>
      
//       <View style={this.props.styles.bottomOptionSeparator} />
      
//       <View style={this.props.styles.bottomOption}>  
//         <TouchableOpacity onPress={()=>this.props.addToNotes} 
//         >        
//           <Text style={this.props.styles.bottomOptionText}>
//             NOTES
//           </Text>
//           <Icon name={'note'} color="white" size={24} 
//           style={this.props.styles.bottomOptionIcon} 
//           />
//         </TouchableOpacity>
//       </View>
      
//       <View style={this.props.styles.bottomOptionSeparator} />          
  
//       <View style={this.props.styles.bottomOption}>   
//         <TouchableOpacity onPress={()=>this.props.addToShare}>       
//           <Text style={this.props.styles.bottomOptionText}>
//             SHARE
//           </Text>
//           <Icon name={'share'} color="white" size={24} style={this.props.styles.bottomOptionIcon} />
//         </TouchableOpacity>
//       </View>
//       <View style={this.props.styles.bottomOptionSeparator} />   
//     </View>
//     )
//   }

// }
  