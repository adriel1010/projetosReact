import React from 'react';
import ReactDOM from 'react-dom';
import { combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { reducer as toastrReducer } from 'react-redux-toastr';
import usuarioReducer from './usuarioReducer';
import filtroItensReducer from './filtroItensReducer';

import Login from './Login.jsx';
import App from './App.jsx';
import ApiceToaster from '../../lib_react_frontend/componentes/ApiceToaster.jsx';

import '../../lib_react_frontend/style/index.css';
import '../../lib_react_frontend/style/common.css';
import '../style/styles.jsx';
import '../../style/index.css';
import modalSenhaReducer from '../componentes/modalSenhaReducer';

/**
 * Registra uma store para ouvir eventos do redux e dispara
 * qualquer evento recebido que tenha sido registrado na aplicação.
 * @param {Store} store A Store do redux
 * @param {Object} eventos Um objeto com os eventos do redux.
 */
function registrarEventos(store, eventos) {
  store.subscribe(async () => {
    const lastAction = store.getState().lastAction;
    for (const key in eventos) {
      if (key === lastAction.type) {
        await eventos[key](store.dispatch, store.getState(), lastAction);
      }
    }
  });
}

/**
 * Representa as opções globais disponíveis no sistema.
 */
export class Options {
  usarFiltro = false;
  iniciarAberto = false;
  loginFirebase = false;
  iconePersonalizado = false;
  componentes = false;
  componentesSwitch = false;
}

/**
 * Inicia a aplicação principal do sistema.
 * @param {Object} reducers Um objeto que será passado para o combine reducers do redux.
 * @param {Function} menus Uma function que deve retornar uma lista de menuItens.
 * @param {String} icone O Ícone principal.
 * @param {String} nomeAplicacao O Nome da aplicação.
 * @param {String} cookie O Cookie principal de login.
 * @param {String} urlApi A URL de requisição.
 * @param {Options} options As opções do sistema representada pelo Objeto Options.
 * @param {Object} eventos Objeto de eventos sendo que cada key é um evento do redux.
 */
export function iniciarAplicacao(reducers, menus, icone, nomeAplicacao,
                                 cookie, urlApi, options = {}, eventos, absolutePaths, usaImagem, eventoDeInicio) {
  
  if (eventoDeInicio) eventoDeInicio();
  console.log('ulrAPI: ' + urlApi);

  /**
   * Seta as variáveis globais da aplicação, essas variáveis
   * podem ser acessadas de qualquer lugar.
   */
  global.app = {
    cookie,
    urlApi,
    icone,
    menus,
    nomeAplicacao,
    options,
    usaImagem,
  };

  /**
   * Cria a store do redux e combina todos os reducers
   * passado por parâmetro mais os reducers padrões.
   */
  const store = createStore(combineReducers({
    ...reducers,
    usuario: usuarioReducer,
    toastr: toastrReducer,
    filtroItens: filtroItensReducer,
    mudarSenha: modalSenhaReducer,
    lastAction: (state = null, action) => action,
  }));

  // Registra os eventos:
  registrarEventos(store, eventos);
  // Renderiza a aplicação:
  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <div>
          <Route component={ApiceToaster} />
          {options.componentes ? options.componentes(store) : []}
          <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/login" component={Login} />
            <Route path="/app" component={App} />
            {absolutePaths ? absolutePaths.map(x =>
            <Route exact path={x.path} component={x.component} />
            ) : null}
            {options.componentesSwitch ? options.componentesSwitch(store) : []}
          </Switch>
        </div>
      </BrowserRouter>
    </Provider>,
    document.getElementById('app')
  );
}

