import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Linking,
  Platform,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import {Segment,Button,Tab,Tabs} from 'native-base'
import { SelectBookPageStyle } from './styles.js';
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
const AsyncStorageConstants = require('../../utils/AsyncStorageConstants')
import {NavigationActions} from 'react-navigation'

export default class SelectBook extends Component {

  static navigationOptions = ({navigation}) =>{
    const { params = {} } = navigation.state;
    return{
      headerLeft: (
        <View style={{flexDirection:"row"}}>
          <Icon name="clear" style={{fontSize:20,color:"#fff",fontWeight:"bold",marginLeft:16}} onPress={() =>{navigation.dispatch(NavigationActions.back())}}/>
        </View>
      ),
 
    }
   
  
  }

  constructor(props){
    super(props)

    this.state = {
      colorFile:this.props.screenProps.colorFile,
      sizeFile:this.props.screenProps.sizeFile,
      colorMode:this.props.screenProps.colorMode,
      activeTab:true,
      booksList: this.props.screenProps.booksList,
      OTSize:this.getOTSize(this.props.screenProps.booksList),
      NTSize:this.getNTSize(this.props.screenProps.booksList),
    }
    console.log("IN SelectBook, bok len"  + JSON.stringify(this.props.screenProps.booksList))
    this.styles = SelectBookPageStyle(this.state.colorFile, this.state.sizeFile);
    
    this.viewabilityConfig = {
        itemVisiblePercentThreshold: 100,
        waitForInteraction: true
    }
  }

  toggleButton(value){
    this.setState({activeTab:value})
    if(value == false){
      console.log("pressed")
      this.flatlistRef.scrollToIndex({index:this.state.OTSize,viewPosition:0,animated: false,viewOffset:0})
    }
    else{
      this.flatlistRef.scrollToIndex({index:0,viewPosition:0,animated: false,viewOffset:0})
    }
  }


   componentWillReceiveProps(props){
     this.setState({
        colorFile:props.screenProps.colorFile,
        colorMode: props.screenProps.colorMode,
        sizeFile:props.screenProps.sizeFile,
        lastRead: props.screenProps.lastRead,
        booksList: props.screenProps.booksList,
        OTSize:this.getOTSize(props.screenProps.booksList),
        NTSize:this.getNTSize(props.screenProps.booksList)
      })
    console.log("OT SIZE " +this.state.OTSize)
   
    this.styles = SelectBookPageStyle(props.screenProps.colorFile, props.screenProps.sizeFile);   
  }
 
  getItemLayout = (data, index) => (
    { length: 48, offset: 48 * index, index }
  )


renderItem = ({item, index})=> {
    return (
      <TouchableOpacity 
          onPress={
            ()=>this.props.navigation.navigate('ChapterSelection', {bookId: item.bookId, 
                bookName: item.bookName, bookIndex: index, numOfChapters: item.numOfChapters})
          }>
          <View 
            style={this.styles.bookList}>
            <Text
              style={
                this.styles.textStyle
              }>
              {item.bookName}
            </Text>
            <Icon 
              name='chevron-right' 
              color="gray" 
              style={this.styles.iconCustom}
              />
          </View>
        </TouchableOpacity>
    );
  }

  getOTSize(bookList){
    var count = 0;
    for(var i=0 ; i<bookList.length ; i++){
      if(bookList[i].bookNumber <= 39){
        count ++;
      }
      else{
        break;
      }

    }
    return count 
  }

  getNTSize(bookList){
    var count = 0;
    for(var i=bookList.length-1 ; i>=0 ; i--){
      if(bookList[i].bookNumber >= 41){
        count++
      }
      else{
        break;
      }
    }
    return count 
  }

  onViewableItemsChanged = ({ viewableItems, changed }) => {
      console.log("Visible items are", viewableItems);
      if (viewableItems.length > 0) {
        if (viewableItems[0].index < this.state.OTSize) {
          // toggel to OT
          this.setState({activeTab:true})
        } else {
          // toggle to NT
          this.setState({activeTab:false})
        }
      }
  }


  render(){
    let activeBgColor = 
      this.state.colorMode == AsyncStorageConstants.Values.DayMode ? '#3F51B5' : '#fff'
    let inactiveBgColor = 
      this.state.colorMode == AsyncStorageConstants.Values.DayMode ? '#fff' : '#3F51B5'
   
   
    return (
      <View style={this.styles.container}>
       
        <View style={this.styles.bookNameContainer}>
            <Segment>
              {
                this.state.OTSize > 0 
              ?
              <Button 
                active={this.state.activeTab} 
                style={[{
                  backgroundColor: this.state.activeTab ? activeBgColor : inactiveBgColor,
                  width: this.state.NTSize == 0 ? width : width/2,
                  },this.styles.segmentButton]} 
                onPress={this.toggleButton.bind(this,true)
                }
              >
                <Text 
                  style={{color:this.state.activeTab ? inactiveBgColor : activeBgColor
                  }}>
                  Old Testament
                </Text>
              </Button>
              : null}
              {
                this.state.NTSize > 0 

              ?
              <Button 
                active={!this.state.activeTab} 
                style={[{
                  backgroundColor: !this.state.activeTab ? activeBgColor : inactiveBgColor,
                  width: this.state.OTSize == 0 ? width : width/2,                  
                },this.styles.segmentButton]} 
                onPress={this.toggleButton.bind(this,false)}>
                <Text 
                  active={!this.state.activeTab} 
                  style={[
                    {
                      color:!this.state.activeTab ? inactiveBgColor : activeBgColor
                    },this.styles.buttonText]
                  }>
                  New Testament
                </Text>
              </Button>
              :null}
            </Segment>
            <FlatList
              ref={ref => this.flatlistRef = ref}
              data={this.state.booksList}
              getItemLayout={this.getItemLayout}
              onScroll={this.handleScroll}
              renderItem={this.renderItem}
              extraData={this.styles}
              keyExtractor={item => item.bookNumber}
              onViewableItemsChanged={this.onViewableItemsChanged}
              viewabilityConfig={this.viewabilityConfig}
            />
        </View> 
      </View>
    );
  }

}

