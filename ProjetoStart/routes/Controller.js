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
      select * from tab_usuario where usuario = "${login}"
    `);

    if (!ret || !ret.length) {
      throw Errors.USUARIO_NAO_ENCONTRADO(login);
    }

    // =======
    // Agora vamos validar a senha:
    const id = ret[0].id;
    ret = await dbUtils.query(`select a.*, senha = md5("${senha}") as correto 
                               from tab_usuario a where id = '${id}'`);

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
  
  async getUsuarios(codigo, filtro, where) {
    return await dbUtils.query('select * from tab_usuario a inner join tab_empresa b on a.cod_empresa = b.cod_empresa ');
  }

  async buscar(tabela, filtro, where) {
    try {
      if (tabela == 'tab_empresa') {  
        if (filtro == 1) {
          return await dbUtils.query('select * from tab_empresa');  
        }        
    }
    
      return super.buscar(tabela, filtro, where); 
    } catch (error) {
      console.log('erro ao buscar os dados ', error);
      return error;
    }
  }

  async salvar(tabela, pk, entidade) { 
    try {  

      if (tabela == 'tab_usuario') {
       const inserir = await dbUtils.query(' insert into tab_usuario set ' + 
        '   nome_usuario  = ?, ' + 
         '  usuario  = ?, ' + 
         '  email  = ?, ' + 
        '   senha = md5(123), ' +  
        '   tipo  = ?, ' +
        '   cod_empresa  = ? ', [
        entidade.nome_usuario,
        entidade.usuario,
        entidade.email, 
        entidade.tipo,
        entidade.cod_empresa,
        ]); 
        return;
      }

      await super.salvar(tabela, pk, entidade); 
    } catch (error) {
      console.log(error);
    }
  }


})