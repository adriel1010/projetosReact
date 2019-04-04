'use strict';

const GenericController = require('../lib_umbler_backend/routes/GenericController');
const Errors = require('../Errors');
const dbUtils = require('../lib_umbler_backend/db_utils');
const apiceAuth = require('../lib_umbler_backend/apice_auth');

/**
 * Classe do controlador específico dessa aplicação.
 */
module.exports = (class Controller extends GenericController { 

  // ======================================

  /**
   * Realiza o login no sistema, sobe um erro se o login/senha está errado.
   * @param {string} login o login do usuário
   * @param {senha} senha a senha do usuário
   */
  async login(login, senha) {
    // Primeiro vamos validar o login e se ele existe:
    let ret = await dbUtils.query(`
      select * from usuario where nome_usuario = "${login}"
    `);

    if (!ret || !ret.length) {
      throw Errors.USUARIO_NAO_ENCONTRADO(login);
    }

    // =======
    // Agora vamos validar a senha:
    const id = ret[0].id;
    ret = await dbUtils.query(`select a.*, senha = md5("${senha}") as correto 
                               from usuario a where id = '${id}'`);

    if (!ret || !ret.length || !ret[0].correto) {
      throw Errors.SENHA_INCORRETA();
    }

    // Se chegamos até aqui é porque o usuário está com a senha e login correto,
    // então vamos gerar e mandar pra ele o token de autenticação:
    const token = apiceAuth.putToken(ret[0]);

    const usuario = ret[0];
    delete usuario.correto; // A validação

    return {
      token,
      usuario,
    };
  }
})