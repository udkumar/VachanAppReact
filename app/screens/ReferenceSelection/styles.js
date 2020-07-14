import {StyleSheet,Dimensions} from 'react-native'
import { Icon } from 'native-base';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
import Color from '../../utils/colorConstants'

export const styles =(colorFile, sizeFile) =>{
    return StyleSheet.create({
        emptyMessageIcon:{
            fontSize:sizeFile.emptyIconSize,
            margin:16,
            color:colorFile.iconColor,
            alignSelf:'center'
        }
    })
    
}