import React from 'react';

/**
 * Classe de seleção de opções em um combo.
 */
export default class Combo extends React.Component {

  static uniqueId = 0;

  constructor() {
    super();
    this.id = 'combo-' + Combo.uniqueId++;
  }

  onChange(e) {
    if (this.props.onChange) {
      this.props.onChange(e.target.value);
    }
    if (this.props.target) {
      this.props.target.setState({ [this.props.field]: e.target.value });
    }
  }

  render() {
    const value = this.props.target ? this.props.target.state[this.props.field] : this.props.value;
    return (
      <div style={this.props.style}>
        {this.props.label && <label htmlFor={this.id}>{this.props.label}</label>}
        <select id={this.id} 
                className='combo-1 form-control'
                onChange={this.onChange.bind(this)}
                value={value}>
          {!this.props.noDefault && 
            <option defaultValue value="">{this.props.placeholder || 'Selecione uma opção'}
            </option>}
          {this.props.children}
        </select>
      </div>
    );
  } 
}
