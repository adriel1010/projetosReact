const network = require('network');
const requests = require('./requests');

let networkData;

/**
 * Recupera as informações da camada da interface da rede.
 */
function getNetworkData() {
  return new Promise(async (resolve, reject) => {
    if (networkData) {
      return resolve(networkData);
    }
    network.get_active_interface((err, obj) => {
      if (err) {
        reject(err);
      }
      networkData = obj;
      networkData.mac_address = String(networkData.mac_address).replace(/:/g, '-');
      return resolve(networkData);
    });
  });
}

/**
 * @return {String} O Ip da internet desse computador.
 */
function getIpInternet() {
  return new Promise((resolve) => {
    network.get_public_ip((err, ip) => resolve(ip || null));
  });
}

/**
 * @return {String} O Ip padrão da apice, seja local ou externo.
 */
async function getIpApice() {

  // Realiza o get e retorna se a url deu certo:
  async function get(url) {
    try {
      await requests.get(`http://${url}:8093/ping`, {
        timeout: 1000,
      });
      return url;
    } catch (ex) {
      return false;
    }
  }

  let retorno = '';
  if (!retorno) {
    retorno = await get('127.0.0.1'); // PC local - Renato 123 Luiz 13
  }
  if (!retorno) {
    retorno = await get('192.168.1.252'); // Servidor da Apice
  }
  if (!retorno) {
    retorno = await get('apicesistemas.dyndns.orgw'); // Servidor da Apice DYNDNS
  }
  if (!retorno) {
    console.log('[NETWORK] FALHA AO REALIZAR O PING NAS URLS DA APICE');
  }
  if (retorno) {
    console.log('[NETWORK] CONSEGUIU REALIZAR O PING PELA URL: ' + retorno)
  }
  return retorno || 'apicesistemas.dyndns.orgw';
}

exports.getNetworkData = getNetworkData;
exports.getIpApice = getIpApice;
exports.getIpInternet = getIpInternet;