import React, {Component} from 'react';
import {Modal, Text,TouchableOpacity,Dimensions,StyleSheet,Animated,LayoutAnimation,FlatList, View, Alert,TouchableWithoutFeedback} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import {Card,CardItem,Content,Body,List,ListItem,Left,Right,Accordion} from 'native-base'
import {updateContentType,fetchAllContent} from '../../../store/action/'
import {styles} from '../../LanguageList/styles'
import {connect} from 'react-redux'



var contentType = ''

  class SelectContent extends Component {
     constructor(props){
         super(props)
         this.state = {
            isExpanded :false,
            // contentType:this.props.contentType
         }
      //  this.updateContent = this.props.updateContentType({contentType:expanded == true ? item.contentType : this.props.contentType})

     }
  
     _renderHeader = (item, expanded) =>{
      var value = expanded && item.contentType 
      console.log("content type ......",value)
      if(value){
        contentType = value
      }
       return(
          <View style={{
            flexDirection: "row",
            padding: 10,
            justifyContent: "space-between",
            alignItems: "center" ,
            }}>
            <Text style={{ fontWeight: "600" }} >
            {" "}{item.contentType.charAt(0).toUpperCase()+item.contentType.slice(1)}
             
            </Text>
            <Icon style={styles.iconStyle} name={expanded ? "keyboard-arrow-down" : "keyboard-arrow-up" }  size={24}/>

          </View>
        )
      }
      _renderHeaderInner=(item,expanded)=>{
          // this.props.updateContentType({})
          return(
            <View style={{
              flexDirection: "row",
              padding: 10,
              justifyContent: "space-between",
              alignItems: "center" ,
               }}>
              <Text style={{ fontWeight: "600" }}>
                {" "}{item.languageName}
              </Text>
              <Icon style={styles.iconStyle} name={expanded ? "keyboard-arrow-down" : "keyboard-arrow-up" }  size={24}/>
            </View>
          )
        }
      
      _renderContentInner = (item)=>{

        return(
          item.versionModels.map(v=>
          <TouchableOpacity 
            style={{
              // flexDirection: "row",
              padding: 10,
              }}
              onPress={()=>{
                this.props.navigation.setParams({modalVisible:false,visibleParallelView:true});
                this.props.updateContentType({parallelContentType:contentType,parallelContentLanguage:item.languageName,parallelContentLanguageCode:item.languageCode,parallelContentVersion:v.versionName,parallelContentVersionCode:v.versionCode,parallelContentSourceId:v.sourceId})
              }} 
            >
              <Text >{v.versionName}</Text>
              <Text>{v.versionCode}</Text>
            </TouchableOpacity>)
        
      )}

      _renderContent = (item) =>{
          return(
            <Accordion
            dataArray={item.content}
            animation={true}
            expanded={true}
            renderHeader={this._renderHeaderInner}
            renderContent={this._renderContentInner}
          />
          )
      }
      // componentDidUpdate(prevProps,prevState){
      //   if(prevProps.availableContents !==prevState.availableContents){
      //     this.props.fetchAllContent()
      //   }
      // }
      render(){

          return(
            <View>
            <Modal
              animationType="fade"
              transparent={true}
              visible={this.props.visible}
              onPress={()=>{this.props.navigation.setParams({modalVisible:!this.props.visible})}} 
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
    contentType:state.updateVersion.parallelContentType,

  }
}
const mapDispatchToProps = dispatch =>{
  return {
    updateContentType:(content) =>dispatch(updateContentType(content)),
    fetchAllContent:()=>dispatch(fetchAllContent()),
    
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(SelectContent)