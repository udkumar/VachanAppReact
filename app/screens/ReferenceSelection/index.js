import React, { Component } from 'react';
import { getBookChaptersFromMapping, getBookNameFromMapping } from '../../utils/UtilFunctions';
import {SelectionTab} from './routes/';

export default class ReferenceSelection extends Component {
    navigateBack = ()=>{
        this.props.navigation.state.params.getReference()
        this.props.navigation.goBack()
    }
    render(){
        return(
            <SelectionTab
                screenProps={{
                    colorFile:this.props.screenProps.colorFile,
                    sizeFile:this.props.screenProps.sizeFile,
                    colorMode:this.props.screenProps.colorMode,
                    navigateBack:this.navigateBack
                }}
            
            />
        )
    }
}

