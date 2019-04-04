import React from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import uuid from 'uuid/v1';
import Input from '../componentes/Input.jsx';
import Button from '../componentes/Button.jsx';
import Row from '../componentes/Row.jsx';
import Api from '../../utils/Api.jsx';
import Cookies from '../../lib_react_frontend/utils/Cookies.jsx';
import ApiceFadeIn from '../../lib_react_frontend/componentes/ApiceFadeIn.jsx';

/**
 * Tela de login padrão utilizada nos sistemas, é possível passar uma cor
 * para ele de forma a customizar ela.
 */
class Login extends React.Component {

  constructor() {
    super();
    this.state = {
      login: '',
      senha: '',
      uuid: uuid(),
    };

    // Padrão do LTE:
    document.body.className = 'hold-transition login-page';
  }

  /**
   * @override
   */
  componentDidMount() {
    // Foca o input do login:
    this.inputLogin.focus();
    // Faz a tela aparecer lentamente:
    this.apiceFadeIn.fadeIn();

  }

  /**
   * Trata as validações antes de realizar o login.
   */
  realizarValidacoes() {
    if (!this.state.login) {
      this.inputLogin.focus();
      toastr.error('Atenção!', 'Informe o login!');
      return;
    }
    return true;
  }

  /**
   * Realiza o login no backend.
   */
  async realizarLogin() {

    if (!this.realizarValidacoes()) {
      return;
    }
   
    try {
      const ret = await Api.login(this.state.login.toUpperCase(), this.state.senha);
      if (ret.status) {
        // Sucesso no login!
        const dezAnos = new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 365 * 10));
        Cookies.set(global.app.cookie, ret.dados.token, dezAnos);
        this.props.history.push(global.app.options.landingPage || '/app');
      } else { 
        toastr.error('Atenção!', 'Usuário ou senha inválido');
      }
    } catch (ex) {
      console.log(ex);
      toastr.error('Erro!', 'Rode o atualizador pelo console, provavelmente há um erro!');
    }
  }

  render() {
    const nome1 = global.app.nomeAplicacao.split(' ')[0];
    const nome2 = global.app.nomeAplicacao.split(' ')[1];
    const nome3 = global.app.nomeAplicacao.split(' ')[2];

    return (
      <ApiceFadeIn ref={e => this.apiceFadeIn = e}>
        <div className="login-box">
          {/* Header: */}
          {global.app.usaImagem ?
            <div className="login-logo wx-250 hx-50 bg25s" />
            :
            <div className="login-logo hx-50 ">
              <i className={'fa rxzz ' + global.app.icone} />
              <b>{nome1}</b> {nome2} <b>{nome3}</b>
            </div>}

          {/* Corpo: */}
          <div className="login-box-body">
            <div className="stripe" />
            <div>
              {/* Login: */}
              <div className="form-group has-feedback ">
                <Input placeholder="Digite seu login"
                  value={this.state.login}
                  ref={e => this.inputLogin = e}
                  onKeyEnter={() => this.inputSenha.focus()}
                  onChange={(e) => this.setState({ login: e.target.value })}
                  name={this.state.uuid} />
                <i className="fa fa-sign-in form-control-feedback" />
              </div>

              {/* Senha: */}
              <div className="form-group has-feedback">
                <Input placeholder="Digite sua senha"
                  value={this.state.senha}
                  ref={e => this.inputSenha = e}
                  onChange={(e) => this.setState({ senha: e.target.value })}
                  onKeyEnter={this.realizarLogin.bind(this)}
                  uppercase={false}
                  type="password" />
                <i className="fa fa-lock form-control-feedback" />
              </div>

              {/* Linha de realizar login: */}
              <Row>
                <div className="col-sm-2 col-sm-offset-4 text-center">
                  <Button icon="fa-sign-in"
                    label="Entrar"
                    className="btn-primary"
                    onClick={this.realizarLogin.bind(this)} />
                </div>
              </Row>
            </div>
          </div>
        </div>
      </ApiceFadeIn>
    );
  }

}

export default connect(null, (dispatch) => ({
  dispatch,
}))(Login);
