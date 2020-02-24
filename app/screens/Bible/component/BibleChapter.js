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
import { styles } from '../styles';
import {connect} from 'react-redux'
import {Body,Header, Button,Right,Title, Left} from 'native-base'

class BibleChapter extends Component {
    constructor(props){
        super(props)
        this.styles = styles(this.props.colorFile, this.props.sizeFile);    
        this.state={
            currentVisibleChapter:this.props.currentVisibleChapter,
            id:this.props.id
        }
    }
    queryParallelBible =(val)=>{
        this.setState({currentVisibleChapter:val != null ? this.state.currentVisibleChapter + val : this.props.currentVisibleChapter},()=>{
        this.props.fetchParallelBible({isDownloaded:this.props.downloaded,sourceId:this.props.parallelContentSourceId,language:this.props.parallelContentLanguage,version:this.props.parallelContentVersionCode,bookId:this.state.id,chapter:val != null ? this.state.currentVisibleChapter + val: this.props.currentVisibleChapter})
            this.setState({currentVisibleChapter:this.state.currentVisibleChapter})
    })
    }
    componentDidMount(){
        this.queryParallelBible(null)
    }
    componentDidUpdate(prevProps,prevState){
    if(prevState.id !== this.state.id || prevState.currentVisibleChapter !== this.state.currentVisibleChapter ){
        this.props.fetchParallelBible({isDownloaded:this.props.downloaded,sourceId:this.props.parallelContentSourceId,language:this.props.parallelContentLanguage,version:this.props.parallelContentVersionCode,bookId:this.state.id,chapter:this.state.currentVisibleChapter})
        this.setState({id:this.state.id,currentVisibleChapter:this.state.currentVisibleChapter })

    }
    if(this.props.parallelChapter !== prevProps.parallelChapter || this.props.parallelBookId !== prevProps.parallelBookId){
        console.log("selected from its own tab")
        this.props.fetchParallelBible({isDownloaded:this.props.downloaded,sourceId:this.props.parallelContentSourceId,language:this.props.parallelContentLanguage,version:this.props.parallelContentVersionCode,bookId:this.props.parallelBookId,chapter:this.props.parallelChapter})
        this.setState({id:this.props.parallelBookId,currentVisibleChapter:this.props.parallelChapter })
    }    
    }
    render(){
        // console.log("state ",this.state.currentVisibleChapter,this.state.id)
        // console.log("props ",this.props.parallelChapter,this.props.parallelBookId)

        return(
            <View>
                {this.props.isLoading &&
                    <Spinner
                    visible={true}
                    textContent={'Loading...'}
                    //  textStyle={styles.spinnerTextStyle}
                />}
                <Header style={{height:40, borderLeftWidth:0.2, borderLeftColor:'#fff'}}>
                {/* <Left>  */}
                    <Button transparent onPress={()=>{this.props.navigation.navigate("SelectionTab",{getReference:this.queryParallelBible,updateBibleProps:false})}}>
                        <Title style={{fontSize:16}}>{getBookNameFromMapping(this.state.id,this.props.parallelContentLanguage).length > 8 ? getBookNameFromMapping(this.state.id,this.props.parallelContentLanguage).slice(0,7)+"..." : getBookNameFromMapping(this.props.id,this.props.parallelContentLanguage)} {this.state.currentVisibleChapter}</Title>
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
                    this.state.currentVisibleChapter == 1 ? null :
                    <View  style={this.styles.bottomBarParallelPrevView}>
                        <Icon name={'chevron-left'} color="#3F51B5" size={16} 
                            style={this.styles.bottomBarChevrontIcon} 
                            onPress={()=>this.queryParallelBible(-1)}
                        />
                    </View>
                    }
                    {
                    this.state.currentVisibleChapter == this.props.totalChapters.length ? null :
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
        language: state.updateVersion.language,
        languageCode:state.updateVersion.languageCode,
        versionCode:state.updateVersion.versionCode,
        sourceId:state.updateVersion.sourceId,
        downloaded:state.updateVersion.downloaded,
    
        chapterNumber:state.updateVersion.chapterNumber,
        bookName:state.updateVersion.bookName,
        bookId:state.updateVersion.bookId,
        fontFamily:state.updateStyling.fontFamily,
    
        sizeFile:state.updateStyling.sizeFile,
        colorFile:state.updateStyling.colorFile,
        isLoading:state.versionFetch.loading,

        totalChapters:state.updateVersion.totalChapters,
        
        fetchedData:state.versionFetch,
        totalVerses:state.versionFetch.totalVerses,
  
        audioURL:state.audioFetch.url,

        // paralleltotalChapters:state.parallel.totalChapters,
        parallelBookId:state.parallel.bookId,
        parallelChapter:state.parallel.chapterNumber,


        parallelContentSourceId:state.updateVersion.parallelContentSourceId,
        parallelContentVersionCode:state.updateVersion.parallelContentVersionCode,
        parallelContentLanguage:state.updateVersion.parallelContentLanguage,
        parallelContentLanguageCode:state.updateVersion.parallelContentLanguageCode,
        parallelBible:state.parallel.parallelBible
    }
  }

const mapDispatchToProps = dispatch =>{
    return {
      selectedChapter: (chapterNumber,totalVerses)=>dispatch(selectedChapter(chapterNumber,totalVerses)),
      fetchParallelBible:(data)=>dispatch(fetchParallelBible(data))
    }
  }

export default connect(mapStateToProps,mapDispatchToProps)(BibleChapter)