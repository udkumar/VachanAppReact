import React, { Component } from 'react';

import VideoPlayer from '../../components/Video/VideoPlayer';
import { bookStyle } from './styles.js'
import {
    View,
    Text
} from 'react-native';
import { connect } from 'react-redux'

class PlayVideo extends Component {
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state
        return {
            headerTitle: params.title
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            url: this.props.navigation.state.params.url,
            title: this.props.navigation.state.params.title,
            description: this.props.navigation.state.params.description,
            theme: this.props.navigation.state.params.theme
        }
        this.styles = bookStyle(this.props.colorFile, this.props.sizeFile);

    }
    componentDidMount() {
        this.props.navigation.setParams({
            title: this.state.theme
        })
    }
    render() {
        return (
            <View style={this.styles.container}>
                <Text style={this.styles.title}>
                    {this.state.title}
                </Text>
                <VideoPlayer url={this.state.url} description={this.state.description} styles={this.styles} />
                <Text style={this.styles.description}>
                    {this.state.description}
                </Text>
            </View>
        )
    }
}
const mapStateToProps = state => {
    return {
        languageCode: state.updateVersion.languageCode,
        sizeFile: state.updateStyling.sizeFile,
        colorFile: state.updateStyling.colorFile,
    }
}

export default connect(mapStateToProps, null)(PlayVideo)
