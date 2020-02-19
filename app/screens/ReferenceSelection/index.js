import React, { Component } from 'react';
import { getBookChaptersFromMapping, getBookNameFromMapping } from '../../utils/UtilFunctions';
import {SelectionTab} from './routes/';

export default class ReferenceSelection extends Component {
    constructor(props){
        super(props)
    }
    navigateBack = ()=>{
        this.props.navigation.goBack()
    }
    render(){
        return(
            <SelectionTab
                screenProps={{
                    navigateBack:this.navigateBack,
                }}
            />
        )
    }
}

