import React from 'react';
import { View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import Player from '../Audio/Player'


const ChapterNdAudio = ({
    styles,
    currentVisibleChapter,navigation
    ,queryBookFromAPI,bookId,status,
    totalChapters,languageCode,versionCode,
    
    })=>(
        <View  style={{justifyContent:(currentVisibleChapter != 1 &&  currentVisibleChapter == currentVisibleChapter != totalChapters) ? 'center' : 'space-around',alignItems:'center'}}>
        {
        currentVisibleChapter == 1 
        ? null :
        <View style={navigation.getParam("visibleParallelView") ? styles.bottomBarParallelPrevView : styles.bottomBarPrevView }>
            <Icon name={'chevron-left'} color="#3F51B5" size={navigation.getParam("visibleParallelView") ? 16 : 32} 
                style={styles.bottomBarChevrontIcon} 
                onPress={()=>queryBookFromAPI(-1)}
                />
        </View>
        }
        {
        status && <View style={styles.bottomBarAudioCenter}><Player 
        languageCode={languageCode} 
        versionCode={versionCode}  
        bookId={bookId}
        chapter={currentVisibleChapter}
        />
        </View>
        }
        {
       currentVisibleChapter == totalChapters
        ? null :
        <View style={navigation.getParam("visibleParallelView") ? styles.bottomBarNextParallelView : styles.bottomBarNextView }>
            <Icon name={'chevron-right'} color="#3F51B5" size={navigation.getParam("visibleParallelView") ? 16 : 32} 
                style={styles.bottomBarChevrontIcon} 
                onPress={()=>queryBookFromAPI(1)}
                />
        </View>
        }
        </View>
)
  


export default ChapterNdAudio
// import React,{Component} from 'react';
// import { View} from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons'
// import Player from '../Audio/Player'


// export default class ChapterNdAudio extends Component{
//     constructor(props){
//         super(props)
//     }
//     render(){
//         return(
//             <View  style={{justifyContent:(this.props.currentVisibleChapter != 1 &&  this.props.currentVisibleChapter == this.props.currentVisibleChapter != this.props.totalChapters) ? 'center' : 'space-around',alignItems:'center'}}>
//             {
//             this.props.currentVisibleChapter == 1 
//             ? null :
//             <View style={this.props.navigation.getParam("visibleParallelView") ? this.props.styles.bottomBarParallelPrevView : this.props.styles.bottomBarPrevView }>
//                 <Icon name={'chevron-left'} color="#3F51B5" size={this.props.navigation.getParam("visibleParallelView") ? 16 : 32} 
//                     style={this.props.styles.bottomBarChevrontIcon} 
//                     onPress={()=>this.props.queryBookFromAPI(-1)}
//                     />
//             </View>
//             }
//             {
//             this.props.status && <View style={this.props.styles.bottomBarAudioCenter}><Player 
//             languageCode={this.props.languageCode} 
//             versionCode={this.props.versionCode}  
//             bookId={this.props.bookId}
//             chapter={this.props.currentVisibleChapter}
//             />
//             </View>
//             }
//             {
//            this.props.currentVisibleChapter == this.props.totalChapters
//             ? null :
//             <View style={this.props.navigation.getParam("visibleParallelView") ? this.props.styles.bottomBarNextParallelView : this.props.styles.bottomBarNextView }>
//                 <Icon name={'chevron-right'} color="#3F51B5" size={this.props.navigation.getParam("visibleParallelView") ? 16 : 32} 
//                     style={this.props.styles.bottomBarChevrontIcon} 
//                     onPress={()=>this.props.queryBookFromAPI(1)}
//                     />
//             </View>
//             }
//             </View>
//         )
//     }

// }
  
