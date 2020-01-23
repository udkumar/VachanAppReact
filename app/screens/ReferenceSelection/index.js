import React, { Component } from 'react';
import { getBookChaptersFromMapping, getBookNameFromMapping } from '../../utils/UtilFunctions';
import {SelectionTab} from './routes/';

export default class ReferenceSelection extends Component {
    constructor(props){
        super(props)
        console.log(" current Content Type",this.props.navigation.state.params.contentType)

    }
    navigateBack = ()=>{
        this.props.navigation.state.params.getReference()
        this.props.navigation.goBack()
    }
    render(){
        return(
            <SelectionTab
                screenProps={{
                    navigateBack:this.navigateBack,
                    contentType:this.props.navigation.state.params.contentType

                }}
            />
        )
    }
}

