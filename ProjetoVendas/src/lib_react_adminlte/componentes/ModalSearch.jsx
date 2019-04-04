import React from 'react';
import Modal from './Modal.jsx';
import InputGroup from './InputGroup.jsx';
import { Table } from './Table.jsx';
import GenericUtils from '../../lib_react_frontend/utils/GenericUtils';
import Button from './Button.jsx';

export default class ModalSearch extends React.Component {
  state = {
    pesquisa: '',
    itemSelecionado: null,
    registros: [],
    index:0,
  }
  /**
   * Chamado quando o usuário clicar em confirmar.
   */

  onConfirm() {
    if (!this.props.hide) {
     this.setState({ pesquisa: '' });
      if (this.props.onConfirm) {
        this.props.onConfirm(this.state.registros[this.state.index]);
      }
    this.hide();
    }
  }

  /**
   * Retorna os botões que ficarão no rodapé do modal:
   */
  getButtons() {
    return [
      {
        icon: 'fa-times',
        label: 'Cancelar',
        className: 'btn-default',
        onClick: () => this.hide(),
      },
      {
        icon: 'fa-check',
        label: 'Confirmar (F2)',
        className: 'btn-success',
        onClick: this.onConfirm.bind(this),
      },
    ];
  }
  /**
   * Retorna o objeto de Api para uso no backend.
   */
  getApi() {
    if (this.props.api) {
      return this.props.api;
    }
    throw new Error('API não especificada para o componente ModalSearch!');
  }

  hide() {
    if (this.modal) {
      this.modal.hide();
    }
      document.onkeydown = null;
      this.setState({ registros: [] });
  }

  /**
   * Executa a pesquisa, filtrando os registros de acordo.
   */
  async carregarRegistros(callback) {
 
    GenericUtils.setElementoCarregando(this.divTable, true);
    const Api = this.getApi();

    const where = this.props.getWhere ? this.props.getWhere(this.state.pesquisa) : '';
    const ret = await Api.buscar(this.props.tabela, this.state.pesquisa, where); 
    if (!ret.status) {
      // TO-DO error
      GenericUtils.setElementoCarregando(this.divTable, false);
      return;
    }
    this.setState({ registros: ret.dados, index:0 }, () => {
      GenericUtils.setElementoCarregando(this.divTable, false);
      if (typeof callback === 'function') {
        callback();
      }
    });
  }

  /**
   * Seleciona um registro através do campo.
   */
  selecionarRegistroByCampo(campo, valor) {
    for (const reg of this.state.registros) {
      if (reg[campo] === valor) {
        this.setState({ itemSelecionado: reg });
        return;
      }
    }
    this.setState({ itemSelecionado: null });
  }

  /**
   * Abre esse modal.
   * @param {function} callback Callback ativado depois que carregou os registros.
   */
  async show(callback) {
    await this.setState({ pesquisa: '' });
    document.onkeydown = (e) => {
      if (e.key === 'ArrowUp' && this.state.index - 1 != -1) {
        this.input.blur();
        this.setState({ index:this.state.index - 1, focado:false });
      }
      if (e.key === 'ArrowDown' && this.state.index + 1 != this.state.registros.length) {
        this.input.blur();
        this.setState({ index:this.state.index + 1, focado:false });
      }
      if (e.key === 'ArrowRight' && !this.state.focado) {
        this.onConfirm();
      }
      if (e.key === 'Enter' && !this.state.focado) {
        this.onConfirm();
      }
      if (e.key === 'F2' && !this.state.focado) {
        this.onConfirm();
      }
      if (e.key === 'Escape' && !this.state.focado) {
        this.hide();
      }
    };
    this.modal.show();
    this.carregarRegistros(callback);
    setTimeout(() => {
      this.input.focus();
    }, 500);
  }

  render() {

    return (
      <Modal title={this.props.titulo}
             buttons={this.getButtons()}
             ref={e => this.modal = e}
             onHide={this.props.onHide}
             closeOnEsc
             confirmOnF2={this.onConfirm.bind(this)}
             style={this.props.modalStyle}>

        {this.props.botoes && this.props.botoes.map((x,y) => (
          <Button icon={x.icone}
            label={x.label}
            className={'btn-primary ' + x.className}
            onClick={e => x.onClick(e)} />
        ) ) }


        <InputGroup placeholder="Digite seu filtro"
                    buttonIcon="fa-check"
                    buttonLabel="Pesquisar"
                    onClick={this.carregarRegistros.bind(this)}
                    onBlur={() => this.setState({ focado: false })}
                    onFocus={() => this.setState({ focado: true })}
                    value={this.state.pesquisa}
                    inputRef={e => this.input = e}
                    onChange={e => this.setState({ pesquisa: e.target.value },
                       () => this.carregarRegistros())}
                    onKeyEnter={() => {
                      this.input.blur();
                      this.carregarRegistros();
                    }} />

        <div className="relative"
             ref={e => this.divTable = e}>
          <Table hideActions
                 selectable
                 data={this.state.registros}
                 selectedItem={this.state.registros[this.state.index]}
                 onSelectItem={e => {
                  const index = this.state.registros.findIndex(x => x == e);
                  this.setState({ index  }); }}
                 onDoubleClick={() => {
                   this.onConfirm();
                   this.modal.hide();
                 }}>
            {this.props.renderColunas()}
          </Table>
        </div>
      </Modal>
    );
  }

}
