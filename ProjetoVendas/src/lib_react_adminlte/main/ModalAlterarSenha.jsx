import React from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import Modal from '../componentes/Modal.jsx';
import Api from '../../utils/Api.jsx';
import LabeledInput from '../componentes/LabeledInput';

class ModalAlterarSenha extends React.Component {
  
  state = {    
    senha_usuario: '',
  }

  async show() {
    this.modal.show();  
    setTimeout(() => {
      if (this.inputSenha) {
        this.inputSenha.focus();
      }
    }, 500);   
  }

 async confirmar() { 
   if (this.state.senha_usuario) {
    const r = await Api.setAlterarSenha(this.props.usuario.id ||
      this.props.usuario.cod_usuario, this.state.senha_usuario);
   
    if (!r.status) {
      toastr.error('Erro', r.erro);
      return;
    }
    this.modal.hide();
    this.setState({
      senha_usuario: '',
    });
    toastr.success('Senha alterada com sucesso');
   } else {
    toastr.error('Erro', 'Por favor, informe uma nova senha.');
   }
  } 

   
  render() {
    const botoes = [{
      icon: 'fa-check',
      label: 'Confirmar (F2)',
      onClick: this.confirmar.bind(this),
    }];
    return (
      <Modal buttons={botoes}
             ref={e => this.modal = e}
             title="Alterar Senha"
             closeOnEsc
             confirmOnF2={() => this.confirmar()}> 

         
         <LabeledInput label="Nova Senha: " 
                        value={this.state.senha_usuario}
                        type="password"
                        uppercase="false"
                        onChange={(e) => this.setState({ senha_usuario:e.target.value })}
                        onKeyEnter={() => this.confirmar()}
                        inputRef={e => this.inputSenha = e} />
 
      </Modal>
    );
  }

}

export default connect((state) => ({
  usuario: state.usuario,
}), (dispatch) => ({ dispatch }), null, { withRef: true })(ModalAlterarSenha);
