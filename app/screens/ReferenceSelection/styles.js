import {StyleSheet} from 'react-native'

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