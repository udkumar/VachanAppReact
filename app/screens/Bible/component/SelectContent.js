import React, {Component} from 'react';
import {Modal, Text,TouchableOpacity,Dimensions,StyleSheet,Animated,LayoutAnimation,FlatList, View, Alert,TouchableWithoutFeedback} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import {Card,CardItem,Content,Body,List,ListItem,Left,Right,Accordion} from 'native-base'
import Orientation from 'react-native-orientation';
import {styles} from '../../LanguageList/styles'
import {connect} from 'react-redux'


  class SelectContent extends Component {
     constructor(props){
         super(props)
         this.state = {
            isExpanded :false
         }
     }
     _renderHeader = (item, expanded) =>(
          <View style={{
            flexDirection: "row",
            padding: 10,
            justifyContent: "space-between",
            alignItems: "center" ,
            backgroundColor: "#A9DAD6" }}>
            <Text style={{ fontWeight: "600" }}>
              {" "}{item.contentType}
            </Text>
            <Icon style={styles.iconStyle} name={expanded ? "keyboard-arrow-down" : "keyboard-arrow-up" }  size={24}/>

          </View>
        )
      _renderHeaderInner(item,expanded){
        return (
            <View style={{
              flexDirection: "row",
              padding: 10,
              justifyContent: "space-between",
              alignItems: "center" ,
              backgroundColor: "#A9DAD6" }}>
              <Text style={{ fontWeight: "600" }}>
                {" "}{item.languageName}
              </Text>
              <Icon style={styles.iconStyle} name={expanded ? "keyboard-arrow-down" : "keyboard-arrow-up" }  size={24}/>
  
            </View>
          )
      }
      _renderContentInner(item){
        <Text style={{marginLeft:8}} >{item.versionModels.map(v=><Text>{v.versionName}</Text>)}</Text>
      }
      _renderContent = (item) =>(
            // <Text style={{marginLeft:8}} >{item.content.map(v=><Text>{v.languageName}</Text>)}</Text>
            <Accordion
            dataArray={item.content}
            animation={true}
            expanded={true}
            renderHeader={this._renderHeaderInner}
            renderContent={this._renderContentInner}
            />
        )
      
      render(){
          return(
            <View>
            <Modal
              animationType="fade"
              transparent={true}
              visible={this.props.visible}
              onPress={()=>{this.props.navigation.setParams({modalVisible:false})}} 
              >
              <TouchableWithoutFeedback
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  }} 
              onPressOut={()=>{this.props.navigation.setParams({modalVisible:false})}} 
              >
              <View style={{height:'80%',width:'70%',alignSelf:'flex-end',top:40}}>
              <Card>
                {/* <FlatList
                data={this.props.availableContents}
                extraData={this.props}
                renderItem={({item, index, separators}) =>( */}
                    <Accordion 
                    dataArray={this.props.availableContents}
                    animation={true}
                    expanded={true}
                    renderHeader={this._renderHeader}
                    renderContent={this._renderContent}
                    />
                {/* )}
            /> */}
              </Card>
              </View>
              </TouchableWithoutFeedback>
            </Modal>
            <TouchableOpacity  style={[this.props.navStyles.touchableStyleRight,{flexDirection:'row'}]}>
                <Icon 
                  onPress={()=>{this.props.navigation.setParams({modalVisible:!this.props.visible})}} 
                  name='add-circle'
                  color={"#fff"} 
                  size={20} 
              /> 
            </TouchableOpacity>
          </View>
          )
      }
  }

const mapStateToProps = state =>{
  return{
    availableContents:state.contents.contentLanguages,
    // commentaryLanguages:state.contents.commentaryLanguages,
  }
}
export default connect(mapStateToProps,null)(SelectContent)