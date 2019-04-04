import React from 'react';
import ReactDOM from 'react-dom';

export default class Input extends React.Component {

  constructor() {
    super();

    this.posicao = null;
  }

  componentDidMount() {
    window.$(this.input).keyup((event) => {
      if (event.keyCode === 13 && this.onKeyEnter) {
        this.onKeyEnter(this.props.onChange ? this.props.value : this.input.value);
      }
    });

    if (this.props.disableSpaces) {
      window.$(this.input).keydown((e) => e.which !== 32);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.onChange && !this.props.onChange2 &&
        !nextProps.onChange && !nextProps.onChange2 &&
        nextProps.value2 && this.input) {
      const valor = String(nextProps.value2);
      ReactDOM.findDOMNode(this.input).value = valor;
    }
  }

  enable() {
    this.input.disabled = false;
  }

  setValue2(v) {
    ReactDOM.findDOMNode(this.input).value = String(v);
  }

  disable() {
    this.input.disabled = true;
  }

  /**
   * Chamado quando o componente de input perder o foco.
   */
  onBlur() {
    if (this.props.type === 'number') {
      // Se for número, vamos tratar o minimo e o máximo.
      const num = Number(this.props.value);
      if (this.props.min && num < Number(this.props.min)) {
        this.triggerChange(this.props.min);
      }
      else if (this.props.max && num > Number(this.props.max)) {
        this.triggerChange(this.props.max);
      }
    }

    if (this.props.onBlur) {
      this.props.onBlur(this.props.onChange ? this.props.value : this.input.value);
    }
  }

  onFocus() {
    if (this.props.onFocus) {
      this.props.onFocus();
    }
  }

  /**
   * Evento chamado quando o componente de input é mudado.
   */
  onChange(e) {
    if (this.props.uppercase === undefined || this.props.uppercase === true) {
      e.target.value = e.target.value.toUpperCase();
    }
    if (this.props.onChange) {
      this.props.onChange(e);
    }
    if (this.props.onChange2) {
      this.props.onChange2(e.target.value);
    }

    if (this.props.target) {
      if (this.props.type === 'checkbox') {
        this.props.target.setState({ [this.props.field]: e.target.checked });
      } else {
        this.props.target.setState({ [this.props.field]: e.target.value });
      }
    }

    if (this.input.type == 'text') {
      this.input.setSelectionRange(this.posicao, this.posicao);
    }
  }

  /**
   * Retorna o classname.
   */
  getClassName() {
    let classNames = '';
    const isFormControl = (
      !this.props.type ||
      this.props.type === 'input' ||
      this.props.type === 'password' ||
      this.props.type === 'number' ||
      this.props.type === 'time'
    );
    if (isFormControl) {
      classNames += ' form-control ';
    }
    if (this.props.uppercase === undefined || this.props.uppercase === true) {
      classNames += ' text-uppercase ';
    }
    classNames += this.props.className;
    return classNames;
  }

  /**
   * Ativa o onChange de quem está ouvindo.
   */
  triggerChange(value) {
    if (this.props.onChange) {
      this.props.onChange({ target: { value } });
    }
  }

  /**
   * Foca esse input.
   */
  focus() {
    this.input.focus();
    if (this.props.type !== 'number') {
      this.input.setSelectionRange(0, this.input.value.length);
    }
  }

  /**
   * Foca esse input.
   */
  blur() {
    this.input.blur();
  }

  getFocus() {
    return this.input.attributes;
  }

  onClick(e) {
    if (this.input.selectionStart == this.input.selectionEnd) {
      this.posicao = this.input.selectionStart;
    }
    if (this.props.onClick) this.props.onClick(e);
  }

  onKeyDown(e) {
    if (this.input.selectionStart == this.input.selectionEnd && e.key == 'Backspace') {
      this.posicao = this.input.selectionStart - 1;
    } else if (this.input.selectionStart == this.input.selectionEnd) {
      this.posicao = this.input.selectionStart + 1;
    } else if (this.input.selectionStart != this.input.selectionEnd && e.key != 'Backspace') {
      this.posicao = this.input.selectionStart + 1;
    } else if (this.input.selectionStart != this.input.selectionEnd) {
      this.posicao = this.input.selectionStart;
    }
    if (this.props.onKeyDown) this.props.onKeyDown(e);
  }

  render() {
    // eslint-disable-next-line
    const { onKeyEnter, disableSpaces, uppercase, onChange2, ...rest } = this.props;
    this.onKeyEnter = onKeyEnter;
    return (
      <input {...rest}
             style={this.props.style}
             ref={e => this.input = e} 
             onChange={this.onChange.bind(this)}
             onBlur={this.onBlur.bind(this)}
             onFocus={this.onFocus.bind(this)}
             className={this.getClassName()}
             onClick={e => this.onClick(e)}
             onKeyDown={e => this.onKeyDown(e)} />
    );
  }

}
