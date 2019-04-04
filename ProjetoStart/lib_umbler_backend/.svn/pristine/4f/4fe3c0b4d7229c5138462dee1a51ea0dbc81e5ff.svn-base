/**
 * ATENÇÃO
 * --------------------
 *  - a maioria das funções requerem algum tipo de elevação, como por exemplo a do
 *  administrador.
 * --------------------
 */

const files = require('./files');

/**
 * Verifica se o serviço existe e retorna true se sim, false se não.
 * @param {String} nomeServico O Nome do serviço 
 */
async function verificarServicoExiste(nomeServico) {
  const retorno = await files.executarConsole(`sc query ${nomeServico}`);
  return retorno.indexOf('1060') < 0;
}

/**
 * Para um serviço do windows.
 * @param {String} nomeServico O Nome do serviço. 
 */
async function pararServico(nomeServico) {
  try {
    const retorno = await files.executarConsole(`net stop ${nomeServico}`);
    return retorno;
  } catch (ex) {
    console.log('ERRO: ' + ex);
    return false;
  }
}

/**
 * Inicia um serviço do windows.
 * @param {String} nomeServico O Nome do serviço. 
 */
async function iniciarServico(nomeServico) {
  try {
    const retorno = await files.executarConsole(`net start ${nomeServico}`);
    return retorno;
  } catch (ex) {
    console.log(ex);
    return false;
  }
}

/**
 * Retorna o estado atual do serviço
 * @param {String} nomeServico O Nome do serviço. 
 * @return {String} 'STOPPED' ou 'RUNNING'
 */
async function getEstadoServico(nomeServico) {
  const retorno = await files.executarConsole(`sc query ${nomeServico}`);
  if (retorno.indexOf('STOPPED') >= 0) {
    return 'STOPPED';
  } else if (retorno.indexOf('RUNNING') >= 0) {
    return 'RUNNING';
  }
}


exports.verificarServicoExiste = verificarServicoExiste;
exports.getEstadoServico = getEstadoServico;
exports.iniciarServico = iniciarServico;
exports.pararServico = pararServico;
