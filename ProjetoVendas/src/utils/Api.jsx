import GenericApi from '../lib_react_frontend/utils/GenericApi.jsx';

export default (class Api extends GenericApi {

  /**
   * Realiza o login no sistema
   * @param {string} login O usuário.
   * @param {string} senha A Senha.
   */
  static async login(login, senha) { 
    return await super.post('/login', { login, senha });
  }
  
  static async getDadosEmpresaFechamento(cnpj) {
    return await super.get(`/dados_empresa_fechamento?cnpj=${cnpj}`);
  }

  static async getEmpresaUsuario(usuario, filtro) {
    return await super.post('/get_empresa_usuario', { usuario, filtro });
  }
  static async getUsuarios(codigo, filtro, where) {
    return await super.post('/get_usuarios', { codigo, filtro, where });
  }

  static async getProduto(usuario, empresa) {
    return await super.post('/get_produto', { usuario, empresa });
  }

  static async getEmpresasNaoAdicionadas(empresasAdicionadas) {
    return await super.post('/get_empresas_nao_adicionadas', { empresasAdicionadas });
  }

});
