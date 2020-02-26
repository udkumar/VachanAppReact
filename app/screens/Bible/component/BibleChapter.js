import React, { Component} from 'react';
import {
  Text,
  View,
  ScrollView,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import VerseView from '../VerseView'
// import AsyncStorageUtil from '../../utils/AsyncStorageUtil';
// import {AsyncStorageConstants} from '../../utils/AsyncStorageConstants'
import Player from '../Navigate/Audio/Player';
import Spinner from 'react-native-loading-spinner-overlay';
// import {getResultText} from '../../utils/UtilFunctions';
import {getBookNameFromMapping,getBookChaptersFromMapping} from '../../../utils/UtilFunctions';
import {selectedChapter,fetchVersionLanguage,fetchVersionContent,fetchAudioUrl,fetchParallelBible} from '../../../store/action/'
import { styles } from './styles';
import {connect} from 'react-redux'
import {Body,Header, Button,Right,Title, Left} from 'native-base'

class BibleChapter extends Component {
    constructor(props){
        super(props)
        this.styles = styles(this.props.colorFile, this.props.sizeFile);    
        this.state={
            currentParallelViewChapter:this.props.currentChapter,
            id:this.props.id,
            bookName:this.props.bookName,
            totalChapters:this.props.totalChapters,
            totalVerses:this.props.totalVerses
        }
    }
    queryParallelBible =(val)=>{
        this.setState({currentParallelViewChapter:val != null ? this.state.currentParallelViewChapter + val : this.props.currentChapter},()=>{
        this.props.fetchParallelBible({isDownloaded:false,sourceId:this.props.parallelContentSourceId,language:this.props.parallelContentLanguage,version:this.props.parallelContentVersionCode,bookId:this.state.id,chapter:val != null ? this.state.currentParallelViewChapter + val: this.props.currentChapter})
            this.setState({currentParallelViewChapter:this.state.currentParallelViewChapter
            })
        })
    }
    getRef=(item)=>{
        this.setState({currentParallelViewChapter:item.chapterNumber},()=>{
            this.props.fetchParallelBible({isDownloaded:false,sourceId:this.props.parallelContentSourceId,
                language:this.props.parallelContentLanguage,version:this.props.parallelContentVersionCode,
                bookId:item.bookId,chapter:item.chapterNumber})
                this.setState({
                    currentParallelViewChapter:item.chapterNumber,
                    id:item.bookId
                })
            })
        
    }

    componentDidMount(){
        this.queryParallelBible(null)
    }
    
    render(){
        return(
            <View style={this.styles.container}>
                {this.props.isLoading &&
                    <Spinner
                    visible={true}
                    textContent={'Loading...'}
                    //  textStyle={styles.spinnerTextStyle}
                />}
                <Header style={{height:40, borderLeftWidth:0.2, borderLeftColor:'#fff'}}>
                {/* <Left>  */}
                    <Button transparent onPress={()=>{this.props.navigation.navigate("SelectionTab",{getReference:this.getRef,bookId:this.state.id,chapterNumber:this.state.currentParallelViewChapter,totalChapters:this.state.totalChapters,totalVerses:this.state.totalVerses})}}>
                        <Title style={{fontSize:16}}>{getBookNameFromMapping( this.state.id ,this.props.parallelContentLanguage).length > 8 ? getBookNameFromMapping(this.state.id ,this.props.parallelContentLanguage).slice(0,7)+"..." : getBookNameFromMapping(this.state.id,this.props.parallelContentLanguage)} {this.state.currentParallelViewChapter}</Title>
                        <Icon name="arrow-drop-down" color="#fff" size={20}/>
                    </Button>
                {/* </Left>  */}
                <Right>
                <Button transparent onPress={()=>this.props.toggleParallelView(false)}>
                    <Icon name='cancel' color={'#fff'} size={20}/>
                </Button>
                </Right>
                </Header>
              <ScrollView showsVerticalScrollIndicator={false} ref={(ref) => { this.scrollViewRef = ref; }} >
                <View style={this.styles.chapterList}>
                    {this.props.parallelBible.map((verse, index) => 
                    <View>
                        <Text letterSpacing={24}
                            style={this.styles.verseWrapperText}>
                            <Text style={this.styles.verseNumber} >
                            {verse.number}{" "}
                            </Text>
                            <Text style={{fontFamily:'NotoSans-Regular'}}
                            >
                            {verse.text}
                        </Text>         
                        </Text>
                        {index == this.props.parallelBible.length - 1  && ( this.props.showBottomBar ? <View style={{height:64, marginBottom:4}} />: null ) }
                    </View>
                    )}
                </View>
                </ScrollView>
                {/* <View> */}
                    {
                    this.state.currentParallelViewChapter == 1 ? null :
                    <View  style={this.styles.bottomBarParallelPrevView}>
                        <Icon name={'chevron-left'} color="#3F51B5" size={16} 
                            style={this.styles.bottomBarChevrontIcon} 
                            onPress={()=>this.queryParallelBible(-1)}
                        />
                    </View>
                    }
                    {
                    this.state.currentParallelViewChapter == this.state.totalChapters   ? null :
                    <View style={this.styles.bottomBarNextParallelView}>
                        <Icon name={'chevron-right'} color="#3F51B5" size={16} 
                            style={this.styles.bottomBarChevrontIcon} 
                            onPress={()=>this.queryParallelBible(1)}
                        />
                    </View>
                    }
                {/* </View> */}
            </View>
        )
    }

}


const mapStateToProps = state =>{
    return{
        sizeFile:state.updateStyling.sizeFile,
        colorFile:state.updateStyling.colorFile,
        // downloaded:false,

        parallelContentSourceId:state.updateVersion.parallelContentSourceId,
        parallelContentVersionCode:state.updateVersion.parallelContentVersionCode,
        parallelContentLanguage:state.updateVersion.parallelContentLanguage,
        parallelContentLanguageCode:state.updateVersion.parallelContentLanguageCode,
        parallelBible:state.parallel.parallelBible
    }
  }

const mapDispatchToProps = dispatch =>{
    return {
      fetchParallelBible:(data)=>dispatch(fetchParallelBible(data))
    }
  }

export default connect(mapStateToProps,mapDispatchToProps)(BibleChapter)