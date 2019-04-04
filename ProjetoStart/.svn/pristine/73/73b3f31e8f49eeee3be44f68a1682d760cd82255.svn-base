'use strict';

const GenericErrors = require('./lib_umbler_backend/utils/GenericErrors');

module.exports = (class Errors extends GenericErrors {
  
  static SENHA_INCORRETA() {
    return {
      error_code: 1,
      error_message: 'A Senha informada está incorreta!',  
    };
  }

  static TOKEN_INVALIDO(token, url) {
    return {
      error_code: 2,
      error_message: 'Token inválido para a origem "' + url + '"!',  
    };
  }

  static TOKEN_INEXISTENTE(token) {
    return {
      error_code: 3,
      error_message: 'Token ' + token + ' inválido!',  
    };
  }

  static USUARIO_NAO_ENCONTRADO(login) {
    return {
      error_code: 4,
      error_message: 'Usuario com login "' + login + '" não foi encontrado!',  
    };
  }

});
