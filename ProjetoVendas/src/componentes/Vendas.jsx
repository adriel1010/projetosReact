import React from 'react'; 
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Column, Table } from '../lib_react_adminlte/componentes/Table.jsx';
import LabeledInput from '../lib_react_adminlte/componentes/LabeledInput.jsx';
import Cadastro from './Cadastro.jsx';
 import Checkbox from '../lib_react_adminlte/componentes/Checkbox.jsx';
import Api from '../utils/Api.jsx';
import $ from 'jquery';
import ComponentVenda from './ComponentVenda.jsx';
 
/**
 * Componente de cadastro de funcionário.
 */
class Vendas extends React.Component {

  state = {
    registro: this.getRegistroLimpo(),
    
  };
  

  onChange(prop, event) {
 
    const value = event.target ? event.target.value : event; 
    /*let valor = '';
    if (prop == 'porcentagem') {
      valor = (this.state.registro.preco_compra * value) / 100; 
   
    }   
    if (prop == 'preco_compra' && this.state.registro.porcentagem > 0) {
      valor = (this.state.registro.porcentagem * value) / 100; 
   
    }  
    
    if (prop == 'preco_venda' && this.state.registro.preco_compra > 0) {
      valor =  (value - this.state.registro.preco_compra) /  (this.state.registro.preco_compra * 100); 
   
      this.setState({
        registro: {
          ...this.state.registro,
          [prop]: value,
          porcentagem: valor,  
        },
      });
 
    }  */

    this.setState({
      registro: {
        ...this.state.registro,
        [prop]: value, 
      //  preco_venda: valor,
      },
    });
  }
 
  /**
   * Retorna a mensagem de confirmação ao excluir.
   */
  getMsgExcluir() {
    return 'Tem certeza que deseja excluir ' + this.state.registro.nome_produto + ' ?';
  }

  /**
   * Retorna um registro limpo.
   */
  getRegistroLimpo() {
    return {
      cod_produto: 0,
      nome_produto: '',
      preco_compra: '',
      preco_venda: '', 
      porcentagem: '',
      lucro: 0,
      codigo_barra: '',
      status_ativo: 'S',
      cod_empresa: this.props.usuario.id,
    };
  }

  /**
   * Retorna as ações da tabela.
   */
  async getRegistros(filtro) {
    const ret = await Api.getProduto(this.props.usuario.id, this.props.usuario.cod_empresa);
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
      <Column style={{}} key={1} field="nome_produto" header="Produto" />, 
      <Column style={{}} key={3} field="preco_compra" header="Preço Compra" />,
      <Column style={{}} key={3} field="preco_venda" header="Preço Venda" />,
      <Column style={{}} key={3} field="codigo_barra" header="Código Barra" />,
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
          <div className="col-sm-6">

           <div className="col-sm-12 estilo-venda-coluna-dados" > 
          </div>
        
            <div className="col-sm-6">
              <LabeledInput label="Consulta:"
                            className='input-arredondado'
                            uppercase='false' 
                            value={this.state.registro.nome_produto}
                            onChange={this.onChange.bind(this, 'nome_produto')} />
            </div>
            <div className="col-sm-6">
              <LabeledInput label="Código:"         
                  className='input-arredondado'                   
                            value={this.state.registro.preco_compra}
                            onChange={this.onChange.bind(this, 'preco_compra')} 
                            inputRef={e => this.inputpreco_compra = e} />
            </div>

            <div className="col-sm-6">
              <LabeledInput label="Quantidade:"     
                  className='input-arredondado'                       
                            value={this.state.registro.porcentagem}
                            onChange={this.onChange.bind(this, 'porcentagem')} />
            </div>

            <div className="col-sm-6">
              <LabeledInput label="Unidade:"     
                  className='input-arredondado'                       
                            value={this.state.registro.preco_venda}
                            onChange={this.onChange.bind(this, 'preco_venda')} />
            </div>
  
            <div className="col-sm-12">
              <LabeledInput label="Valor Unitário:"       
                  className='input-arredondado'                     
                            value={this.state.registro.codigo_barra}
                            onChange={this.onChange.bind(this, 'codigo_barra')} />
            </div>  
            
            <div className="col-sm-12">
              <LabeledInput label="Valor SubTotal:"  
                  className='input-arredondado'                          
                            value={this.state.registro.codigo_barra}
                            onChange={this.onChange.bind(this, 'codigo_barra')} />
            </div>  
            </div>

            <div className="col-sm-6"> 
              <div className="col-sm-12"> 
                   <div className="col-sm-4">
                      <LabeledInput label="Cliente:"  
                          className='input-arredondado-superior-tabela'                          
                                    value={this.state.registro.codigo_barra}
                                    readOnly
                                    onChange={this.onChange.bind(this, 'codigo_barra')} />
                    </div> 
                    <div className="col-sm-5">
                      <LabeledInput label="Vendedor:"  
                          className='input-arredondado-superior-tabela'                          
                                    value={this.state.registro.codigo_barra}
                                    readOnly
                                    onChange={this.onChange.bind(this, 'codigo_barra')} />
                    </div> 
                    <div className="col-sm-3">
                      <LabeledInput label="Horário:"  
                          className='input-arredondado-superior-tabela'                          
                                    value={this.state.registro.codigo_barra}
                                    readOnly
                                    onChange={this.onChange.bind(this, 'codigo_barra')} />
                    </div>

                     <div className="col-sm-12 estilo-venda-coluna-tabela" > 

                     <div className="col-sm-12">
                        <label className="letra-itens"> Gerenciador de vendas</label> 
                       
                      </div>
                       <div className="col-sm-12">
                        <label className="letra-itens"> Avenida Domingos Sanches, Número 818</label>
                        </div>

                       <div className="col-sm-12">
                        <label className="letra-itens"> Jardim Morumbi - Paranavaí PR</label>
                        </div>

                        <div className="col-sm-12"> 
                        <label className="letra-itens"> Contato: (44) 3423-0847 ou (44)99959-8661</label>
                        </div>

                        <div className="col-sm-12" style={{ textAlign:'center' }}>
                           <label className="letra-itens" >EXTRATO DE VENDA</label>
                        </div>

                        <div className="col-sm-12" style={{ marginLeft: '-15px' }}>
                          <div className="col-sm-2">
                            <label className="letra-itens">ITEM</label>
                          </div>

                          <div className="col-sm-3">
                            <label className="letra-itens">CÓDIGO</label>
                          </div>

                          <div className="col-sm-7">
                            <label className="letra-itens">DESCRIÇÃO </label>
                          </div>

                        </div>

                        <div className="col-sm-12"  style={{ marginTop: '-8px', marginLeft: '-15px'}}> 

                          <div className="col-sm-2"> 
                            <label className="letra-itens">DTD. </label>
                          </div>

                          <div className="col-sm-2"> 
                            <label className="letra-itens">UN. </label>
                          </div>
 
                          <div className="col-sm-5"> 
                           <label className="letra-itens">VL.UNITÁRIO(R$) </label>
                          </div>

                          <div className="col-sm-3"> 
                            <label className="letra-itens">VL.ITEM(R$) </label>
                          </div>
 
                     
                        </div>

                    </div>

              </div> 
            </div>
             

          </div>
           
        </div> 
      </div>
    );
  }
  
  render() {
    return (
      <div>
        <ComponentVenda tabela="tab_venda"
                  subTitulo="Realize suas vendas"
                  pk="cod_venda"
                  titulo="Vendas"

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
}), (dispatch) => ({ dispatch }))(Vendas);
