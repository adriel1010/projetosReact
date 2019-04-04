import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Column } from '../lib_react_adminlte/componentes/Table.jsx';
import LabeledInput from '../lib_react_adminlte/componentes/LabeledInput.jsx';
import Cadastro from './Cadastro.jsx';
import  { RadioGroup, RadioButton }  from '../lib_react_adminlte/componentes/RadioGroup.jsx' 
import Checkbox from '../lib_react_adminlte/componentes/Checkbox.jsx';
import Api from '../utils/Api.jsx';
import $ from 'jquery';
import ApiceComboEditPanel from '../lib_react_adminlte/componentes/ApiceComboEditPanel.jsx';

/**
 * Componente de cadastro de funcionário.
 */
class CadastroUsuario extends React.Component {

  state = {
    registro: this.getRegistroLimpo(),
  };

  onChange(prop, event) {
    let value = event.target ? event.target.value : event;
    if (prop === 'usuario') {
      value = value.replace(/\s*/g, '');
    } else if (prop === 'senha') {
      value = value.toLowerCase();
    }
    this.setState({
      registro: {
        ...this.state.registro,
        [prop]: value,
      },
    });
  }

  /**
   * Retorna a mensagem de confirmação ao excluir.
   */
  getMsgExcluir() {
    return 'Tem certeza que deseja excluir ' + this.state.registro.nome_usuario + ' ?';
  }

  /**
   * Retorna um registro limpo.
   */
  getRegistroLimpo() {
    return {
      nome_usuario: '',
      email: '',
      tipo: '', 
      usuario: '',
      status_ativo: 'S',
      cod_empresa: 0,
    };
  }

  /**
   * Retorna as ações da tabela.
   */
  async getRegistros(filtro) {
    const ret = await Api.getUsuarios('da', 'ddd', 'dddccc');
    if (!ret.status) {
      return toastr.error('Erro!', ret.erro.error_message);
    }
    for (const r of ret.dados) {
      const style = {
        position: 'relative',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: '20px',
      };
      r.ativo = r.status_ativo === 'S' ? (
        <div style={{ ...style, color: 'rgb(2, 194, 152)' }}>Sim</div>
      ) : (
        <div style={{ ...style, color: 'red' }}>Não</div>
      );
    }
    return ret.dados;
  }

  /**
   * Retorna o registro.
   */
  getRegistro() {
    const copy = Object.assign({}, this.state.registro);
    delete copy.ativo;
    if (!copy.id) {
   //   copy.id_usuario_cadastro = this.props.usuario.id;
    }
    return copy;
  }
  /**
   * seta o registro com o item recebido da lista da tabela
   * @param {} item 
   */
  setRegistro(item) {
    this.setState({ registro: item });
  }

  /**
   * Limpa o registro atual.
   */
  limparRegistro() {
    this.setState({
      registro: this.getRegistroLimpo(),
    });
  }

  /**
   * Renderiza as colunas que aparecerão no grid da listagem.
   */
  renderColunas() {
    return [ 
      <Column style={{}} key={1} field="nome_usuario" header="Nome" />, 
      <Column style={{}} key={3} field="email" header="E-mail" />,
      <Column style={{}} key={3} field="nome_empresa" header="Empresa" />,
      <Column style={{ width: '140px', textAlign: 'center' }} key={6} field="ativo" header="Ativo?" />,
    ];
  }

  
  /**
   * Renderiza o formulário de inclusão/alteração.
   */
  renderForm() {
    return (
      <div>
        <div>
          <div className="row mt-5">
            <div className="col-sm-4">
              <LabeledInput label="Nome:"
                            uppercase='false'
                            value={this.state.registro.nome_usuario}
                            onChange={this.onChange.bind(this, 'nome_usuario')} />
            </div>
            <div className="col-sm-4">
              <LabeledInput label="Usuário:"                            
                            value={this.state.registro.usuario}
                            onChange={this.onChange.bind(this, 'usuario')} 
                            inputRef={e => this.inputUsuario = e} />
            </div>
            <div className="col-sm-4">
              <LabeledInput label="E-mail:"                            
                            value={this.state.registro.email}
                            onChange={this.onChange.bind(this, 'email')} />
            </div>
 
       
          <div className="col-sm-6">
            <ApiceComboEditPanel label="Empresa:"
              tabela="tab_empresa"
              chave="cod_empresa"
              desc="nome_empresa"
              // where={this.props.empresa.tipo_empresa != 1 ?
              //    'b.cod_empresa = ' + this.props.empresa.cod_empresa : null}
              colunas={[
                <Column style={{ width: '30px' }} key={0} field="cod_empresa" header="Código" />,
                <Column key={1} field="nome_empresa" header="Nome" />,
              ]}
              ref={e => this.comboEditPanelFunc = e}
              value={this.state.registro.cod_empresa}
              onChange={(e) => { 
                this.setState({
                  registro: {
                    ...this.state.registro,
                    cod_empresa: e.target.value,
                  },
               }); 
              }}
              api={Api} />
            </div>
            <div className="col-sm-6">

                <RadioGroup title="Função:">

                  <RadioButton text="Gerente" name="tipo"
                      checked={this.state.registro.tipo == 'G'}
                      onChange={() => this.setState({
                        registro:
                          { ...this.state.registro, tipo: 'G' },
                      })} /> 

                    <RadioButton text="Comum" name="tipo"
                      checked={this.state.registro.tipo == 'C'}
                      onChange={() => this.setState({
                        registro:
                          { ...this.state.registro, tipo: 'C' },
                      })} /> 
  
                </RadioGroup>
                </div>
          </div>
          <Checkbox text="Ativo?"
            checked={this.state.registro.status_ativo == 'S'}
            onChange={(e) => 
              this.setState({
                registro: {
                  ...this.state.registro,
                  status_ativo: e.target.checked ? 'S' : 'N',
                },
            })} 
            className="cb-empresa-acumulado" />
        </div> 
      </div>
    );
  }
  
  render() {
    return (
      <div>
        <Cadastro tabela="tab_usuario"
                  pk="id"
                  titulo="Cadastro de Usuarios"

                  renderForm={this.renderForm.bind(this)}
                  renderColunas={this.renderColunas.bind(this)}

                  getMsgExcluir={this.getMsgExcluir.bind(this)}
                  getRegistros={this.getRegistros.bind(this)}
                  getRegistro={this.getRegistro.bind(this)}
                  setRegistro={this.setRegistro.bind(this)}
                  naoMostrarExcluir
                  limparRegistro={this.limparRegistro.bind(this)}
                  ref={e => this.cadastro = e} />
      </div>
    );
  }

}

export default connect((state) => ({
  usuario: state.usuario,
  socket: state.socket,
}), (dispatch) => ({ dispatch }))(CadastroUsuario);
