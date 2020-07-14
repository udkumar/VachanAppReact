import React, { Component} from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import Spinner from 'react-native-loading-spinner-overlay';
import {fetchParallelBible,fetchVersionBooks} from '../../store/action'
import { styles } from './styles';
import {connect} from 'react-redux'
import {getResultText} from '../../utils/UtilFunctions'
import {Header, Button,Right,Title} from 'native-base'
import Color from '../../utils/colorConstants'
import ReloadButton from '../ReloadButton';

class BibleChapter extends Component {
    constructor(props){
        super(props)
        this.styles = styles(this.props.colorFile, this.props.sizeFile);    
        this.state={
            currentParallelViewChapter:JSON.parse(this.props.currentChapter),
            id:this.props.id,
            bookName:this.props.bookName,
            totalChapters:this.props.totalChapters,
        }
        this.alertPresent = false
    }
    queryParallelBible =(val)=>{
         console.log(" qQUERYBIBLE PARALLEL ",val,"totalChapters ",this.props.totalChapters)
        this.setState({currentParallelViewChapter:val != null ? this.state.currentParallelViewChapter + val : this.props.currentChapter},()=>{
        this.props.fetchParallelBible({isDownloaded:false,sourceId:this.props.parallelContentSourceId,
            language:this.props.parallelContentLanguage,
            version:this.props.parallelContentVersionCode,
            bookId:this.state.id,
            chapter:this.state.currentParallelViewChapter})
            // this.setState({currentParallelViewChapter:this.state.currentParallelViewChapter
            // })
        })
    }
    getRef=(item)=>{
        console.log(" QUERYBIBLE PARALLEL ITEM",item)
        this.setState({currentParallelViewChapter:item.chapterNumber},()=>{
            this.props.fetchParallelBible({isDownloaded:false,sourceId:this.props.parallelContentSourceId,
                language:this.props.parallelContentLanguage,version:this.props.parallelContentVersionCode,
                bookId:item.bookId,chapter:item.chapterNumber})
                this.setState({
                    currentParallelViewChapter:item.chapterNumber,
                    id:item.bookId,
                    bookName:item.bookName,
                    totalChapters:item.totalChapters
                })
            })
    }
    
    componentDidMount(){
        this.queryParallelBible(null)
    }
    componentWillUnmount(){
      this.props.fetchVersionBooks({language:this.props.language,
        versionCode:this.props.versionCode,
        downloaded:this.props.downloaded,sourceId:this.props.sourceId})
    }
    errorMessage(){
        if (!this.alertPresent) {
            this.alertPresent = true;
            if (this.props.error) {
                Alert.alert("", "Check your internet connection", [{text: 'OK', onPress: () => { this.alertPresent = false } }], { cancelable: false });
            } else {
                this.alertPresent = false;
            }
        }
    }

    updateData = ()=>{
      if(this.props.error){
        this.errorMessage()
        this.queryParallelBible(null)
      }
      else{
        return
      }
    }
   
    render(){
        console.log("book name ",this.state.bookName, this.props.books.length)
        const bookId = this.state.id
        const value = this.props.books.length !=0 && this.props.books.filter(function (entry){
            return  entry.bookId == bookId
         })
        const bookName = value ?  value[0].bookName : this.state.bookName
        this.styles = styles(this.props.colorFile, this.props.sizeFile);    
        return(
            <View style={this.styles.container}>
                <Header style={{height:40,borderLeftWidth:0.2, borderLeftColor:Color.White}}>
                <Button transparent onPress={()=>{this.props.navigation.navigate("SelectionTab",{getReference:this.getRef,parallelContent:true,bookId:this.state.id,bookName:this.state.bookName,chapterNumber:this.state.currentParallelViewChapter,totalChapters:this.state.totalChapters})}}>
                    <Title style={{fontSize:16}}>{bookName.length > 8 ? bookName.slice(0,7)+"..." : bookName} {this.state.currentParallelViewChapter}</Title>
                    <Icon name="arrow-drop-down" color={Color.White} size={20}/>
                </Button>
                <Right>
                <Button transparent onPress={()=>this.props.toggleParallelView(false)}>
                    <Icon name='cancel' color={Color.White} size={20}/>
                </Button>
                </Right>
                </Header>
                {this.props.isLoading &&
                    <Spinner
                    visible={true}
                    textContent={'Loading...'}
                />}
                {
                (this.props.error) ?
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <ReloadButton
                styles={this.styles}
                reloadFunction={this.queryParallelBible}
               />   
                </View>
                :
                <View style={{flex:1}}>
                <ScrollView contentContainerStyle={{paddingBottom:20}} showsVerticalScrollIndicator={false} ref={(ref) => { this.scrollViewRef = ref; }} >
                    {this.props.parallelBible.map((verse, index) => 
                    <View style={{marginHorizontal:16}}>
                        {verse.number == 1 ? 
                        <Text letterSpacing={24}
                        style={this.styles.verseWrapperText}>
                        <Text style={this.styles.sectionHeading}>
                            {verse.metadata ? (verse.metadata[0].section && verse.metadata[0].section.text+"\n"): null }
                        </Text>
                        <Text style={this.styles.verseChapterNumber} >
                        {this.state.currentParallelViewChapter}{" "}
                        </Text>
                        <Text style={this.styles.textString}
                        >
                        {getResultText(verse.text)}
                        </Text>         
                        </Text>
                        :
                        <Text letterSpacing={24}
                            style={this.styles.verseWrapperText}>
                                <Text style={this.styles.sectionHeading}>
                            {verse.metadata ? (verse.metadata[0].section && verse.metadata[0].section.text+"\n"): null }
                                </Text>
                            <Text style={this.styles.verseNumber} >
                            {verse.number}{" "}
                            </Text>
                            <Text style={this.styles.textString}
                            >
                            {getResultText(verse.text)}
                        </Text>         
                        </Text>
                        }
                    </View>
                    )}
                    <View style={this.styles.addToSharefooterComponent}>
                    {
                    <View style ={this.styles.footerView}>
                    {(this.props.revision !==null && this.props.revision !== '') &&  <Text style={this.styles.textListFooter}><Text style={this.styles.footerText}>Copyright:</Text>{' '}{this.props.revision}</Text>}
                    {(this.props.license !==null && this.props.license !=='') && <Text style={this.styles.textListFooter}><Text style={this.styles.footerText}>License:</Text>{' '}{this.props.license}</Text>}
                    {(this.props.technologyPartner !==null && this.props.technologyPartner !=='' ) && <Text style={this.styles.textListFooter}><Text style={this.styles.footerText}>Technology partner:</Text>{' '}{this.props.technologyPartner}</Text>}
                    </View>
                    }
                    </View>
                </ScrollView>

                <View style={{justifyContent:(this.state.currentParallelViewChapter != 1 &&  this.state.currentParallelViewChapter == this.state.currentParallelViewChapter != this.state.totalChapters) ? 'center' : 'space-around',alignItems:'center'}}>
                {
                this.state.currentParallelViewChapter == 1 ? null :
                <View  style={this.styles.bottomBarParallelPrevView}>
                    <Icon name={'chevron-left'} color={Color.Blue_Color} size={16} 
                        style={this.styles.bottomBarChevrontIcon} 
                        onPress={()=>this.queryParallelBible(-1)}
                    />
                </View>
                }
                {
                this.state.currentParallelViewChapter == this.state.totalChapters   ? null :
                <View style={this.styles.bottomBarNextParallelView}>
                    <Icon name={'chevron-right'} color={Color.Blue_Color} size={16} 
                        style={this.styles.bottomBarChevrontIcon} 
                        onPress={()=>this.queryParallelBible(1)}
                    />
                </View>
                }
                </View>
                </View>

            }
            </View>
        )
    }

}


const mapStateToProps = state =>{
    return{
        sizeFile:state.updateStyling.sizeFile,
        colorFile:state.updateStyling.colorFile,
        books:state.versionFetch.data,
        // downloaded:false,

        language: state.updateVersion.language,
        versionCode:state.updateVersion.versionCode,
        sourceId:state.updateVersion.sourceId,
        downloaded:state.updateVersion.downloaded,

        parallelContentSourceId:state.updateVersion.parallelContentSourceId,
        parallelContentVersionCode:state.updateVersion.parallelContentVersionCode,
        parallelContentLanguage:state.updateVersion.parallelContentLanguage,
        parallelContentLanguageCode:state.updateVersion.parallelContentLanguageCode,
        parallelBible:state.parallel.parallelBible,
        parallelContentType:state.updateVersion.parallelContentType,

        revision:state.updateVersion.pRevision,
        license:state.updateVersion.pLicense,
        technologyPartner:state.updateVersion.pTechnologyPartner,

        error:state.parallel.error,
        loading:state.parallel.loading
    }
  }

const mapDispatchToProps = dispatch =>{
    return {
      fetchParallelBible:(data)=>dispatch(fetchParallelBible(data)),
    fetchVersionBooks:(payload)=>dispatch(fetchVersionBooks(payload)),


    }
  }

export default connect(mapStateToProps,mapDispatchToProps)(BibleChapter)