import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import Header from '../template/header/Header.jsx';
import SideBar from '../template/sidebar/SideBar.jsx';
import MenuItem from '../template/sidebar/MenuItem.jsx';
import MenuTree from '../template/sidebar/MenuTree.jsx';
import ContentWrapper from '../componentes/ContentWrapper.jsx';
import Footer from '../template/footer/Footer.jsx';
import Cookies from '../../lib_react_frontend/utils/Cookies.jsx';
import GenericApi from '../../lib_react_frontend/utils/GenericApi';
import ApiceValidadorSessao from '../../lib_react_frontend/componentes/ApiceValidadorSessao.jsx';
import Input from '../componentes/Input.jsx';
import ModalAlterarSenha from './ModalAlterarSenha';
/**
 * Tela da aplicação.
 */
class App extends React.Component {

  componentWillReceiveProps(nextProps) {
    if (nextProps.mudarSenha != this.props.mudarSenha) {
      this.modalSenha.getWrappedInstance().show();
    }
  }

  async componentWillMount() {
    document.body.className = 'skin-purple-light sidebar-mini ' +
      (global.app.options.iniciarAberto ? '' : 'sidebar-collapse');
    const ret = await GenericApi.validarAuth();
    if (ret.status) {
      this.props.dispatch({
        type: 'on_login',
        usuario: ret.dados.usuario,
      });
    }
  }

  getConteudo() {
    const createItem = (rota, label, icone, render, children) => ({
      rota, label, icone, render, children,
    });
    return global.app.menus(this.props.redux, createItem).filter(x => x);
  }

  onChangeFiltro(e) {
    this.props.dispatch({
      type: 'on_filtrar_itens',
      valor: e.target.value,
    });
  }

  /**
   * Realiza o logout da aplicação, isso apaga o token de autenticação
   * e retorna à pagina de login.
   */
  realizarLogout() {
    Cookies.erase(global.app.cookie);
    this.props.history.push('/');
  }

  renderMenuItens() {
    return this.getConteudo().map(x => (
      x.children ? (
        <MenuTree key={x.rota} label={x.label} icon={x.icone}>
          {x.children.map(q => (
            <MenuItem key={q.rota} path={'/app/' + x.rota + '/' + q.rota}
                      label={q.label} icon={q.icone} />
          ))}
        </MenuTree>
      ) : (
        x.rota ? <MenuItem key={x.rota} path={'/app/' + x.rota} label={x.label} icon={x.icone} /> : null
      )
    ));
  }

  renderRoutes() {
    const conteudos = this.getConteudo();
    const routes = [];
    for (const conteudo of conteudos) {
      if (conteudo.children) {

        for (const child of conteudo.children) {
          routes.push(
            <Route exact key={child.rota}
                   path={'/app/' + conteudo.rota + '/' + child.rota}
                   component={child.render || ContentWrapper} />
          );
        }

      } else {
        routes.push(
          <Route exact
                 key={conteudo.rota}
                 path={'/app/' + conteudo.rota}
                 component={conteudo.render || ContentWrapper} />
        );
      }
    }
    return routes;
  }

  render() {
    return (
      <ApiceValidadorSessao history={this.props.history}>
        <Header tituloGrande={global.app.nomeAplicacao}
                tituloPequeno={<i className={'fa ' + global.app.icone} />}
                icon={global.app.icone}
                usuario={{}}
                rota={global.app.options.landingPage || '/app'}
                onLogout={this.realizarLogout.bind(this)} />

        <SideBar>
          {global.app.options.usarFiltro && (
            <Input value={this.props.filtroItens}
                  placeholder='Pesquisar'
                  onChange={this.onChangeFiltro.bind(this)} />
          )}
          {this.renderMenuItens()}
        </SideBar>

        <Switch>
          {this.renderRoutes()}
          <Route component={ContentWrapper} />
        </Switch>

        <ModalAlterarSenha ref={e => this.modalSenha = e} />
        <Footer titulo="Gerenciador de Vendas" link="http://gerenciadorvendas.com.br" />
      </ApiceValidadorSessao>
    );
  }

}

export default connect((state) => ({
  usuario: state.usuario,
  filtroItens: state.filtroItens,
  redux: state,
  mudarSenha: state.mudarSenha,
}), (dispatch) => ({
  dispatch,
}))(App);

