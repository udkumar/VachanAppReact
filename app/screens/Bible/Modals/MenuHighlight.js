import { Text, View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
// import { Constants } from 'expo';
import React, {Component} from 'react';
import { MenuContext, Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

export default class App extends Component {
  render() {
    return (
      <MenuContext>
        <View style={styles.container}>
          <Text style={styles.paragraph}>
            Try long press on contact
          </Text>
          <TouchableWithoutFeedback onLongPress={this.openMenu}>
            <View style={styles.card}>
              <Text>My first contact name</Text>
              <Menu ref={c => (this.menu = c)}>
                <MenuTrigger text="..." />
                <MenuOptions>
                  <MenuOption onSelect={() => alert(`Save`)} text="Save" />
                  <MenuOption onSelect={() => alert(`Delete`)}>
                    <Text style={{ color: 'red' }}>Delete</Text>
                  </MenuOption>
                  <MenuOption
                    onSelect={() => alert(`Not called`)}
                    disabled={true}
                    text="Disabled"
                  />
                </MenuOptions>
              </Menu>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </MenuContext>
    );
  }

  openMenu = () => {
    this.menu.open();
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  card: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
});
