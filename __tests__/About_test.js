// import 'react-native';
// import React from 'react';
// import App from '../App';

// // Note: test renderer must be required after react-native.
// import renderer from 'react-test-renderer';

// it('renders correctly', () => {
//   const tree = renderer.create(
//     <App />
//   );
// });



import 'react-native';
// import React from 'react';
import * as React from 'react'

import renderer from 'react-test-renderer';
import About from '../app/screens/About/About'

it('renders correctly', () => {
  const tree = renderer.create(
    <About />
    ).toJSON();
  expect(tree).toMatchSnapshot();
});