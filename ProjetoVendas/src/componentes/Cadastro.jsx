import React from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import Button from '../lib_react_adminlte/componentes/Button.jsx';
import InputGroup from '../lib_react_adminlte/componentes/InputGroup.jsx';
import { Table } from '../lib_react_adminlte/componentes/Table.jsx';
import Api from '../utils/Api.jsx';
import GenericUtils from '../lib_react_frontend/utils/GenericUtils';
import Tabs from '../lib_react_adminlte/template/tab/Tabs.jsx';
import TabHeader from '../lib_react_adminlte/template/tab/TabHeader.jsx';
import TabsHeader from '../lib_react_adminlte/template/tab/TabsHeader.jsx';
import TabsContent from '../lib_react_adminlte/template/tab/TabsContent.jsx';
import TabContent from '../lib_react_adminlte/template/tab/TabContent.jsx';
import ContentWrapper from '../lib_react_adminlte/componentes/ContentWrapper.jsx';
import { selectTab, showTabs } from '../lib_react_adminlte/template/tab/tabActions';

/**
 * Cadastro padrão do sistema, possui 4 abas:
 * - listar
 * - incluir
 * - alterar
 * - excluir
 */
class Cadastro extends React.Component {

  state = {
    filtro: '',
    filtroAplicado: false,
    tab:{ selected:'', visible:{} },

    qtderegistros: 25,
    range: {
      from: 0,
      to: 25,
    },
    registros: [],
    botoesDesabilitados: false,
  }

  componentWillMount() {
    this.resetarAbas();
  }

  componentDidMount() {
    this.binded = this.onResize.bind(this);
    this.carregarRegistros();
    window.addEventListener('resize', this.binded);
  }

  onResize() {
    const tbody = document.getElementById('tbodyPrincipal');
    if (tbody && tbody.style) {
      if (window.innerWidth <= 768) {
        tbody.style.height = 'calc(100vh - 405px)';
      } else {        
        tbody.style.height = 'calc(100vh - 340px)';
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.binded);
  }

  /**
   * Chamado quando for realizado um click em um dos botões de ação da tabela.
   * @param {any} actionId o Id da coluna clicada
   * @param {object} item O Registro clicado
   */
  async onTableActionClick(actionId, item) {
    if (actionId === 'excluir') {
      // Exclusão
      await this.props.setRegistro(item);
      this.props.dispatch(showTabs('tabDelete'));
      this.props.dispatch(selectTab('tabDelete'));
      return;
    } else if (actionId === 'editar') {
      // Edição
      await this.props.setRegistro(item);
      this.props.dispatch(showTabs('tabUpdate'));
      this.props.dispatch(selectTab('tabUpdate'));
      return;
    }

    if (this.props.onTableActionClick) {
      this.props.onTableActionClick(actionId, item);
    }
  }
  onClickPaginacao(id) {
    let from = this.state.range.from;
    let to = this.state.range.to;
    if (id === 'ant') {
      from -= this.state.qtderegistros;
      to -= this.state.qtderegistros;
      if (from <= 0) {
        from = 0;
        to = this.state.qtderegistros;
      }
    } else {
      from += this.state.qtderegistros;
      to += this.state.qtderegistros;
    }
    this.setState({
      range: {
        from,
        to,
      },
    }, this.carregarRegistros.bind(this));
  }
  getTableActions() {
    const dados = [
      {
        className: 'mr-5 btn-success',
        icone: 'fa-pencil',
        id: 'editar',
        tipo: Table.ACAO_TABELA,
      },
    ].concat(this.props.tableActions || []);
    if (!this.props.naoMostrarExcluir) {
      dados.push({
        className: 'btn-danger',
        icone: 'fa-trash-o',
        id: 'excluir',
        tipo: Table.ACAO_TABELA,
      });
    }
    return dados;
  }

  /**
   * Reseta as abas ao estado original, ou seja, a listagem e o incluir.
   */
  resetarAbas() {
    this.props.limparRegistro();
    this.props.dispatch(showTabs('tabList', this.props.naoMostrarIncluir ? '' : 'tabCreate'));
    this.props.dispatch(selectTab('tabList'));
    setTimeout(() => this.onResize(), 10);
  }

  /**
   * Carrega os registros da tabela
   */
  async carregarRegistros(mostrarProgresso = true) {
    GenericUtils.setElementoCarregando(this.table, mostrarProgresso);

    let ret;
    if (this.props.getRegistros) {
      // Estão fazendo a pesquisa por fora
      ret = await this.props.getRegistros(this.state.filtro, this.state.range);
    } else {
      ret = await Api.buscar(this.props.tabela, this.state.filtro, '');
    }

    this.setState({ registros: ret, filtroAplicado: this.state.filtro }, () => {
      this.onResize();
    });
    GenericUtils.setElementoCarregando(this.table, false);
  }

  mostrarCarregamento() {
    GenericUtils.setElementoCarregando(this.table, true);
  }

  /**
   * Salva o registro no banco de dados, caso ele já exista ele é atualizado.
   * Se ele não existir ele é cadastrado.
   */
  async salvar() {
    try {
      if (this.props.getValidacoes && !this.props.getValidacoes()) {
        return;
      }
      
      this.setState({ botoesDesabilitados: true });
      const ret = await Api.salvar(this.props.tabela, this.props.pk, this.props.getRegistro());
      if (!ret.status) {
        return toastr.error('Erro!', ret.erro.error_message || ret.erro.sqlMessage);
      }
      if (this.props.onSalvar) {
        const ret2 = this.props.onSalvar();
        Promise.resolve(ret2).then();
      }
      this.resetarAbas();
      this.props.limparRegistro();
      this.carregarRegistros();
    } finally {
      this.setState({ botoesDesabilitados: false });
    }
  }

  /**
   * Exclui o registro no banco de dados
   */
  async excluir() {
    try {
      this.setState({ botoesDesabilitados: true });
      const ret = await Api.excluir(this.props.tabela, this.props.pk, this.props.getRegistro());
      if (!ret.status) {
        return toastr.error('Erro!', ret.erro.error_message);
      }
      this.resetarAbas();
      this.carregarRegistros();
      this.props.limparRegistro();
    } finally {
      this.setState({ botoesDesabilitados: false });
    }
  }
  
  limparRegistros() {
    this.setState({ registros: [] });
  }

  /**
   * Renderiza a página de listagem do cadastro.
   * Deve ser mandado o prop 'renderColunas' para esse componente.
   */
  renderList() {
    return (
      <div>
        <div className="d-flex flex-row">
          {/* Input de filtro: */}
          <div className="flex mb-10">
            <InputGroup value={this.state.filtro}
                        onChange={e => this.setState({ filtro: e.target.value })}
                        placeholder="Digite seu filtro"
                        buttonLabel="Filtrar!"
                        buttonClassName={'btn-success'}
                        onKeyEnter={this.carregarRegistros.bind(this)}
                        onClick={this.carregarRegistros.bind(this)} />
          </div>
        </div>

        <div className="relative" style={{ overflow: 'auto' }}>
          {/* Tabela de registros: */}
          <Table data={this.state.registros || []}
                 ref={e => this.table = e}
                 styleColunaAction={this.props.tabela == 'player' ?  { width:'800px' } : ''}
                 tableColor={this.props.tableColor}

                 pagination
                 tbodyId="tbodyPrincipal"
                 maxHeight={'1000000px'}
                 selectable={this.props.tableSelecionavel}
                 selectedItem={this.props.itemSelecionadoTable}
                 onSelectItem={this.props.onSelecionarItemTable}

                 onActionClick={this.onTableActionClick.bind(this)}
                 actions={this.getTableActions()}>
            {this.props.renderColunas()}
          </Table>

          {this.props.paginavel && (
            <div>
              <Button label="Pág. Anterior"
                      icon="fa-arrow-left"
                      className="btn-primary btn-flatx mr-10"
                      onClick={this.onClickPaginacao.bind(this, 'ant')}
                      disabled={this.state.range.from <= 0 || this.state.filtroAplicado} />
              <Button label="Próx. Página"
                      icon="fa-arrow-right"
                      className="btn-primary btn-flatx"
                      onClick={this.onClickPaginacao.bind(this, 'prox')}
                      disabled={this.state.registros.length < this.state.qtderegistros || this.state.filtroAplicado} />
            </div>
          )}
        </div>
      </div>
    );
  }

  /**
   * Renderiza o formulário de inclusão/alteração.
   */
  renderForm() {
    return (
      <div className="">
        <div className="m-10">
          {this.props.renderForm()}
        </div>
        <div className="m-10 pt-10 light-upper-border">
          <Button className="mt-5 btn-danger"
                  disabled={this.state.botoesDesabilitados || this.props.botoesDesabilitados}
                  label="Cancelar"
                  onClick={() => {
                    this.resetarAbas();
                    this.carregarRegistros();
                  }}
                  icon="fa-times" />
          <Button className="mt-5 ml-5 btn-success"
                  disabled={this.state.botoesDesabilitados || this.props.botoesDesabilitados}
                  label="Confirmar"
                  onClick={this.salvar.bind(this)}
                  icon="fa-check" />
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="h-100">
        <ContentWrapper title={this.props.titulo} small={this.props.subTitulo} >
          <Tabs>
            {/* Cabeçalhos das abas: */}
            <TabsHeader>
              <TabHeader label='Listar' icon='bars' 
                target='tabList'onClick={this.carregarRegistros.bind(this)} />
              <TabHeader label='Incluir' icon='plus' 
                target='tabCreate' onClick={this.limparRegistros.bind(this)} />
              <TabHeader label='Alterar' icon='pencil' 
                target='tabUpdate' />
              <TabHeader label='Excluir' icon='trash-o' target='tabDelete' />
            </TabsHeader>

            {/* Conteúdo: */}
            <TabsContent>
              <TabContent id='tabList'>
                {/* Aba de lista */}
                {this.renderList()}
              </TabContent>

              <TabContent id='tabCreate'>
                {/* Aba de inclusão */}
                {this.renderForm()}
              </TabContent>

              <TabContent id='tabUpdate'>
                {/* Aba de alteração */}
                {this.renderForm()}
              </TabContent>

              <TabContent id='tabDelete'>
                {/* Aba de exclusão: */}
                <div className="col-sm-12">
                  {this.props.getMsgExcluir()}
                </div>

                <div className="m-10">
                  <Button className="mt-10 btn-default"
                          label="Cancelar"
                          disabled={this.state.botoesDesabilitados}
                          onClick={this.resetarAbas.bind(this)}
                          icon="fa-times" />
                  <Button className="mt-10 ml-5 btn-danger"
                          label="Confirmar"
                          disabled={this.state.botoesDesabilitados}
                          onClick={this.excluir.bind(this)}
                          icon="fa-trash" />
                </div>
              </TabContent>
            </TabsContent>

          </Tabs>
        </ContentWrapper>
      </div>
    );
  }

}

export default connect((state) => ({
  funcionario: state.funcionario,
}), (dispatch) => ({
  dispatch,
}), null, { withRef: true })(Cadastro);
