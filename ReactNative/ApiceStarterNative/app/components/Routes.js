import React, { Component } from 'react';
import { Router, Scene, Actions } from 'react-native-router-flux';
import TelaMenu from '../telas/TelaMenu';
import Tela1 from '../telas/Tela1';
import Tela2 from '../telas/Tela2';

export default class Routes extends Component {
  render() {
    return (
      <Router>
        <Scene key='root'>
          <Scene key='telamenu'
                 initial
                 component={TelaMenu}
                 hideNavBar />
          <Scene key='tela1'
                 component={Tela1}
                 hideNavBar />
          <Scene key='tela2'
                 component={Tela2}
                 hideNavBar />
        </Scene>
      </Router>
    );
  }
}
