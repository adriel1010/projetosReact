import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Button from './Button.jsx';
import Input from './Input.jsx';

/**
 * Componente de tabela padrão do LTE.
 */
export class Table extends React.Component {

  static uniqueId = 0;

  // Os tipos de ação:
  static ACAO_CABECALHO = 1;
  static ACAO_TABELA    = 2;

  constructor() {
    super();
    this.id = 'table-' + Table.uniqueId++;
  }

  componentDidMount() {
    $('#' + this.id).dblclick(() => {
      if (this.props.onDoubleClick) {
        this.props.onDoubleClick();
      }
    });

    if (this.props.ajustarMargemHeader) {
      this.props.ajustarMargemHeader();
    }
  }

  componentWillReceiveProps() {
    if (this.props.ajustarMargemHeader) {
      this.ajustarMargemHeader();
    }
  }

  /**
   * Chamado quando o usuário clica em uma das ações.
   */
  onActionClick(nome, item) {
    if (this.props.onActionClick) {
      this.props.onActionClick(nome, item);
    }
  }

  onSelectItem(item, index) {
    if (this.props.onSelectItems) {
      this.props.onSelectItems(item, index);
    }
    else if (this.props.onSelectItem) {
      this.props.onSelectItem(item, index);
    }
  }

  getActions(tipo) {
    return (this.props.actions || []).filter(x => x.tipo === tipo);
  }

  getRowStyle(item, col) {
    const style = {};

    if (this.props.tableColor) {
      for (const c of this.props.tableColor) {
        const cond = c.condition;
        for (const key in cond) {
          if (cond.hasOwnProperty(key) && item[key] === cond[key]) {
            style.backgroundColor = c.backgroundColor;
            style.fontWeight = c.fontWeight || 'bold';
            style.color = c.color || 'white';
          }
        }
      }
    }

    if (this.props.selectedItems) {
      if (this.props.selectedItems.find(x => x === item)) {
        style.backgroundColor = 'rgba(60, 141, 188, .92)';
        style.fontWeight = 'bold';
        style.color = 'white';
      }
    } else if (this.props.selectedItem === item) {
      style.backgroundColor = 'rgba(60, 141, 188, .92)';
      style.fontWeight = 'bold';
      style.color = 'white';
    }
    if (col.props.style) {
      style.width = col.props.style.width;
    } else {
      style.width = '100px';
    }

    if (typeof item[col.props.field] === 'number' ||
     (col.props.style && col.props.style.textAlign == 'right')) {
      style.textAlign = 'right';
    }

    if (col.props.style && col.props.style.minWidth) {
      style.minWidth = col.props.style.minWidth;
    }

    if (item.selecionado) {
      style.backgroundColor = 'rgba(185,220,232,1)';
    }


    if (item.empatados && item.empatados.length > 0) {

        for (const itensEmpatados of item.empatados) {

         if (item.empatados.length > 1) {
          if (col.props.field == itensEmpatados.codUsuarioVencedor &&
             item[itensEmpatados.codUsuarioVencedor]) {
            style.backgroundColor = 'yellow';
          }
         } else if (col.props.field == itensEmpatados.codUsuarioVencedor &&
             item[itensEmpatados.codUsuarioVencedor]) {
            style.backgroundColor = 'rgba(30,225,45,0.7)';
         }
      }
    }

    if (item.empatadosVencedor && item.empatadosVencedor.length > 0) {

      for (const itensEmpatados of item.empatadosVencedor) {

        if (item.empatadosVencedor.length > 1) {
          if (col.props.field == itensEmpatados.codUsuarioVencedorEmpatado &&
             item[itensEmpatados.codUsuarioVencedorEmpatado]) {
            style.backgroundColor = 'yellow';
         }
        } else if (col.props.field == itensEmpatados.codUsuarioVencedorEmpatado &&
           item[itensEmpatados.codUsuarioVencedorEmpatado]) {
          style.backgroundColor = 'rgba(30,225,45,0.7)';
      }
      }
    }

    return style;
  }

  /**
   * Retorna as colunas passadas como filhas e uma coluna adicional de ações.
   */
  getColumns() {
    let children = [];
    if (this.props.children.length) {
      children = [...this.props.children];
    } else {
      children.push(this.props.children);
    }
    if (!this.props.hideActions) {
      // Só podemos mostrar se não temos que esconder a ação.
      children.push(<Column action key={-1} header="Ações"
      className='th-action' style={this.props.actionStyle} />);
    }
    return children;
  }

  ajustarMargemHeader() {
    setTimeout(() => {
      if (this.tbody) {
        // React DOM pega o DOM Node correspondente ao objeto da referência.
        // Uma referencia é um acesso ao objeto definido no render
        // eslint-disable-next-line
        const domNode = ReactDOM.findDOMNode(this.tbody);
        // eslint-disable-next-line
        const tHead = ReactDOM.findDOMNode(this.thead);
        const obj = $(domNode);
        const isScroll = domNode.scrollHeight > obj.height();
        tHead.style.width = `calc(100% - ${isScroll ? '18px' : '0px'})`;
      }
    }, 10);
  }

  /**
   * Renderiza o thead.
   */
  renderColumns() {
    const c = this.getColumns();
    const o = [];
    for (let i = 0; i < c.length; i++) {
      o.push(c[i].props.action ? (
        <th key={c[i].key}
            className={'text-center th-actxion'}
            style={c[i].props.style || { width: 100 + 'px' }}>
          {c[i].props.header}
        </th>
      ) : (
        <th key={c[i].key}
            aria-controls="example2"
            style={c[i].props.style || { width: 100 + 'px' }}
            rowSpan="1"
            colSpan="1"
            className={'sorting ' + c[i].props.className}>
          {c[i].props.header}
        </th>
      ));
    }
    return o;
  }

  /**
   * Renderiza o tbody.
   */
  renderRows() {
    return this.props.data.map((item, index) => (
      <tr key={index}>
        {this.getColumns().map((col, index2) => {
          let value = item[col.props.field];
          if (col.props.field && (col.props.field.toString()).indexOf('.') >= 0) {
            value = item[col.props.field.split('.')[0]];
            value = value[col.props.field.split('.')[1]];
          }
          return col.props.action ? (
            // Se for a coluna de ações, então vamos mandar as ações
            // padrões ao invés do conteúdo do item:
            <td key={col.key} style={col.props.style}
             className="text-center wx-100 mt-5 mb-5 th-actxion">
              {/* Renderiza as ações do cabeçalho: */}
              {this.getActions(Table.ACAO_TABELA).map(x => (
                <Button key={x.id}
                        className={x.className}
                        icon={x.icone}
                        disabled={x.disabled ? x.disabled(item) : false}
                        hidden={x.hidden ? x.hidden(item) : false}
                        onClick={this.onActionClick.bind(this, x.id, item)} />
              ))}
            </td>
          ) : (
            <td key={col.key}
                className={this.props.selectable ?
                  'selectable-td ' + col.props.className : '' + col.props.className}
                style={this.getRowStyle(item, col)}
                onClick={this.onSelectItem.bind(this, item, index)}>
                {col.props.editable ? (
                  <Input type={col.props.type || 'number'}
                    className={col.props.type != 'checkbox' ?
                     'form-control ' + col.props.inputClass : ''}
                    style={{ width: '100%', ...col.props.style }}
                    value={value}
                    checked={value}
                    uppercase='false'
                    ref={e => { item['input' + index2] = item.naoRef ? null : e; }}
                    onChange={(e) => col.props.onChange(e.target.value, item, index)}
                    onKeyEnter={col.props.onSubmit.bind(this, item, true, index)}
                    onBlur={col.props.onSubmit.bind(this, item, true)} />
                ) : value}
            </td>
          );
        })}
      </tr>

    ));
  }

  renderMsgVazio() {
    return (
      <div className="msg-table-vazio">
        Nenhum registro encontrado
      </div>
    );
  }

  render() {
    const actions = this.getActions(Table.ACAO_CABECALHO) || [];
    return (
      <div className={this.props.className + ' scatman'}>
        <div className="mt-10">

          {/* Título: */}
          {this.props.header && <legend className="table-legend">{this.props.header}</legend>}

          {/* Renderiza as ações do cabeçalho: */}
          {actions.length > 0 && <div className="inline-block mb-10">
            {actions.map(x => (
              <Button key={x.id}
                      className={x.className + ' mr-5'}
                      icon={x.icone}
                      label={x.label}
                      title={x.title}
                      disabled={x.disabled}
                      onClick={this.onActionClick.bind(this, x.id)} />
            ))}
          </div>}

          {this.props.inputPesquisa}
          {this.props.inputPesquisa}
          {/* Table: */}
          <table className={(this.props.tableClassName ? this.props.tableClassName : '')
                            + 'table table-border table-hover dataTable ' +
                            (this.props.scrollable ? ' scrollable ' : '')}
                id={this.id}
                role="grid">
            <thead ref={e => this.thead = e}>
              <tr role="row">
                {this.renderColumns()}
              </tr>
            </thead>
            {this.props.data && !this.props.data.length ? (
              this.renderMsgVazio()
            ) : (
              <tbody id={this.props.tbodyId}
                     ref={e => this.tbody = e}
                     style={{ maxHeight: this.props.maxHeight }}
                     className="tbody-print">
                {this.renderRows()}
              </tbody>
            )}
          </table>
        </div>
      </div>
    );
  }

}

export class Column extends React.Component {
  field  = '';
  header = '';
  action = false;
  icon   = '';
  key    = '';
  style  = {};
  className = ''; // Para usar quando action
}
