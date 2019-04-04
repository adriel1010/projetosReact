import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Column } from '../lib_react_adminlte/componentes/Table.jsx';
import LabeledInput from '../lib_react_adminlte/componentes/LabeledInput.jsx';
import Cadastro from './Cadastro.jsx';
import Checkbox from '../lib_react_adminlte/componentes/Checkbox.jsx';
import Api from '../utils/Api.jsx';
import $ from 'jquery';
import ApiceComboEditPanel from '../lib_react_adminlte/componentes/ApiceComboEditPanel.jsx';

/**
 * Componente de cadastro de empresa.
 */
class CadastroEmpresa extends React.Component {

  state = {
    registro: this.getRegistroLimpo(),
  };

  onChange(prop, event) {
    const value = event.target ? event.target.value : event; 
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
    return 'Tem certeza que deseja excluir ' + this.state.registro.nome_empresa + ' ?';
  }

  /**
   * Retorna um registro limpo.
   */
  getRegistroLimpo() {
    return {
      cod_empresa: 0,
      nome_empresa: '',
      razao_social: '',
      doc_federal : '',
      status_ativo: 'S', 
    };
  }

  /**
   * Retorna as ações da tabela.
   */
  async getRegistros(filtro) {
    const ret = await Api.buscar('tab_empresa', this.props.usuario.id, filtro);
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
     // copy.id_usuario_cadastro = this.props.usuario.id;
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
      <Column style={{}} key={1} field="nome_empresa" header="Nome da Empresa" />,
      <Column style={{}} key={2} field="razao_social" header="Razão Social" />,
      <Column style={{}} key={3} field="doc_federal" header="Doc Federal" />, 
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
            <div className="col-sm-3">
              <LabeledInput label="Nome Empresa:"
                            uppercase='false'
                            value={this.state.registro.nome_empresa}
                            onChange={this.onChange.bind(this, 'nome_empresa')} />
            </div>
            <div className="col-sm-3">
              <LabeledInput label="Razao Social:"                            
                            value={this.state.registro.razao_social}
                            onChange={this.onChange.bind(this, 'razao_social')} 
                            inputRef={e => this.inputrazao_social = e} />
            </div>
            <div className="col-sm-3">
              <LabeledInput label="Doc Federal:"                            
                            value={this.state.registro.doc_federal}
                            onChange={this.onChange.bind(this, 'doc_federal')} />
            </div> 
            {/* <div className="col-sm-3">
            <ApiceComboEditPanel label="Responsável:"
              tabela="tab_usuario"
              chave="id"
              desc="nome_usuario"
              // where={this.props.usuario.tipo_usuario != 1 ?
              //    'b.cod_usuario = ' + this.props.usuario.cod_usuario : null}
              colunas={[
                <Column style={{ width: '30px' }} key={0} field="id" header="Código" />,
                <Column key={1} field="nome_usuario" header="Nome" />,
              ]}
              ref={e => this.comboEditPanelFunc = e}
              value={this.state.registro.cod_responsavel}
              onChange={(e) => { 
                this.setState({
                  registro: {
                    ...this.state.registro,
                    cod_responsavel: e.target.value,
                  },
               }); 
              }}
              api={Api} />
            </div> */}

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
        <Cadastro tabela="tab_empresa"
                  pk="cod_empresa"
                  titulo="Cadastro de Empresa"

                  renderForm={this.renderForm.bind(this)}
                  renderColunas={this.renderColunas.bind(this)}

                  getMsgExcluir={this.getMsgExcluir.bind(this)}
                  getRegistros={this.getRegistros.bind(this)}
                  getRegistro={this.getRegistro.bind(this)}
                  setRegistro={this.setRegistro.bind(this)}
                  // naoMostrarExcluir
                  limparRegistro={this.limparRegistro.bind(this)}
                  ref={e => this.cadastro = e} />
      </div>
    );
  }

}

export default connect((state) => ({
  usuario: state.usuario,
  socket: state.socket,
}), (dispatch) => ({ dispatch }))(CadastroEmpresa);
