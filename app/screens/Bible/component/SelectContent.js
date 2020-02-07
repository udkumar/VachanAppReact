import React, { useState,useEffect} from 'react';
import {Modal, Text,TouchableOpacity,Dimensions,StyleSheet,Animated,LayoutAnimation,FlatList, View, Alert,TouchableWithoutFeedback} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import {Card,CardItem,Content,Body,List,ListItem,Left,Right,} from 'native-base'
import Orientation from 'react-native-orientation';
import Accordion from 'react-native-collapsible/Accordion';
import {styles} from '../../LanguageList/styles'
import {connect} from 'react-redux'


renderHeader = (section,index, _, isActive) => {
  return (
    <Animated.View
      duration={400}
      style={[stylesSelection.header, isActive ? stylesSelection.active : stylesSelection.inactive]}
      transition="backgroundColor"
    >
      <Text style={stylesSelection.headerText}>{section.content}</Text>
    </Animated.View>
  );
};

renderContent = (section,index, _, isActive)=> {
  return (
    <Animated.View
      duration={400}
      style={[stylesSelection.content, isActive ? stylesSelection.active : stylesSelection.inactive]}
      transition="backgroundColor">
        {section.contentVersion ?  section.contentVersion.map((ele, i, key) => (
          <List>
            <ListItem button={true}>
            <TouchableOpacity 
              onPress={()=>{navigation.setParams({modalVisible:!visible});Orientation.lockToLandscape()}} 
              >
            <Left>
            <Animated.View
              duration={400}
              style={{padding:10}}
              transition="backgroundColor"
            >
            <Text>{ele.language}</Text>
            
            {
              ele.commentaries.map((com)=>(
                <Text>{com.code}</Text>
              ))
            }
            </Animated.View>
            </Left>
          </TouchableOpacity>
          </ListItem>
          </List>
      )) :  null}
      {/* </Animated.View> */}
    </Animated.View>
  );
}

const ExpandableItemComponent = ({
  visible,
  index,
  item,
  navigation,
  updateLayout,
})=>(
  <View>
    {item.length == 0 ? null :
    <Accordion
    // activeSections={activeSections}
    sections={item}
    // touchableComponent={TouchableOpacity}
    renderHeader={renderHeader}
    renderContent={renderContent}
    duration={400}
    // onChange={navigation}
    />
    }
  </View>

  )



const SelectContent = ({
  visible,
  navStyles,
  navigation,
  availableCommentaries
})=>{
  const [list, updateList] = useState(availableCommentaries)
  const updateLayout = (index)=>{
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    let responseay = [...list]
    responseay[index]['isExpanded'] = !responseay[index]['isExpanded']
    updateList(responseay)
    // console.log("AVAILABLE COMMENTARY ......",list)
  }
 useEffect(()=>{
  updateLayout
  updateList(availableCommentaries)
  
 },[])

  return(
  <View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={visible}
          onPress={()=>{navigation.setParams({modalVisible:false})}} 
          >
          <TouchableWithoutFeedback
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              }} 
          onPressOut={()=>{navigation.setParams({modalVisible:false})}} 
          >
          <View style={{height:'80%',width:'70%',alignSelf:'flex-end',top:40}}>
          <Card>
          
          <ExpandableItemComponent 
          visible={visible}
          item={[availableCommentaries]} 
          navigation={navigation} 
          updateLayout={updateLayout}
          />

          </Card>
          </View>
          </TouchableWithoutFeedback>
        </Modal>
        <TouchableOpacity  style={[navStyles.touchableStyleRight,{flexDirection:'row'}]}>
            <Icon 
              onPress={()=>{navigation.setParams({modalVisible:!visible})}} 
              name='add-circle'
              color={"#fff"} 
              size={20} 
          /> 
        </TouchableOpacity>
      </View>
  )
}
const mapStateToProps = state =>{
  return{
    availableCommentaries:state.commentaryFetch.availableCommentaries,
  }
}

const stylesSelection = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    paddingTop: 50,
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '300',
    marginBottom: 20,
  },
  header: {
    backgroundColor: '#F5FCFF',
    padding: 10,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    padding: 20,
    backgroundColor: '#fff',
  },
  active: {
    backgroundColor: 'rgba(255,255,255,1)',
  },
  inactive: {
    backgroundColor: 'rgba(245,252,255,1)',
  },
  selectors: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  selector: {
    backgroundColor: '#F5FCFF',
    padding: 10,
  },
  activeSelector: {
    fontWeight: 'bold',
  },
  selectTitle: {
    fontSize: 14,
    fontWeight: '500',
    padding: 10,
  },
  multipleToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 30,
    alignItems: 'center',
  },
  multipleToggle__title: {
    fontSize: 16,
    marginRight: 8,
  },
});
export default connect(mapStateToProps,null)(SelectContent)
