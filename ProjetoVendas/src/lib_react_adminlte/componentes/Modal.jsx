import React from 'react';
import Button from './Button.jsx';

export default class Modal extends React.Component {

  // Id sequencial para não repetir o ID no dom node:
  static seqId = 0;

  constructor() {
    super();
    this.uniqueId = 'modal-' + Modal.seqId++;
  }

  // Props closeOnEsc e confirmOnF2 foram implementadas por requisito da gerencia, onde
  // o modal deve ser fechado quando o usuário utilizar a tecla esc, e confirmado quando o mesmo
  // utilizar a tecla F2.
  onKeyDown(e) {
    if (e.key === 'Escape') {
      if (this.props.closeOnEsc) {
        this.hide();
      }
    } else if (e.key === 'F2') {
      if (this.props.confirmOnF2) {
        this.props.confirmOnF2();
      }
    }
  }

  /**
   * Mostra esse dialog na tela
   */
  show() {
    window.$('#' + this.uniqueId).modal('show');
  }

  /**
   * Esconde esse dialog da tela
   */
  hide() {
    window.$('#' + this.uniqueId).modal('hide');
    if (this.props.onHide) {
      this.props.onHide();
    }
  }

  render() {
    return (
      <div className="modal fade"
           id={this.uniqueId}
           tabIndex="-1"
           role="dialog"
           data-backdrop="static"
           data-keyboard="false"
           onKeyDown={this.onKeyDown.bind(this)}>

        <div className="modal-dialog" role="document" style={this.props.style}>
          <div className="modal-content" style={this.props.style}>

            {/* Cabeçalho */}
            <div className="modal-header">
              {this.props.semfecha ? null :
              <Button className="close"
                      data-dismiss="modal"
                      onClick={this.props.onHide}
                      icon='fa-times' />
              }
              <h4 className="modal-title" id="myModalLabel">
                {this.props.title || 'Sem título'}
              </h4>
            </div>

            {/* Corpo: */}
            <div className={"modal-body " + this.props.bodyClass}>
              {this.props.children}
            </div>

            {/* Rodapé: */}
            <div className="modal-footer">
              {this.props.buttons.map(x => (
                <Button className={x.className}
                        key={x.label}
                        icon={x.icon}
                        disabled={x.disabled}
                        onClick={() => {
                          if (x.onClick) x.onClick();
                          if (x.dismiss) this.hide();
                        }}
                        label={x.label} />
              ))}
            </div>

          </div>
        </div>

      </div>
    );
  }

}
