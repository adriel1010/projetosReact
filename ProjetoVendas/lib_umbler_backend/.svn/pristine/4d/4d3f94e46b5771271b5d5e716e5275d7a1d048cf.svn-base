const files = require('../files');
const path = require('path');

async function abrirDialogArquivo(filtro) {
  const caminho = await executarStr(['fileDialog', filtro || '']);
  return caminho.trim();
}

/**
 * Executa o apice console com os parâmetros.
 * @param {String[]} parametros Os parâmetros do executável. 
 */
async function executarStr(parametros) {
  const caminho = `${path.join(__dirname, 'ApiceConsoleCommands.exe')}`;
  let str = '';
  for (const p of parametros) {
    str += `"${p}" `;
  }
  return await files.executarConsole(`${caminho} ${str}`);
}

async function getVersaoWindows() {
  return await executarStr(['versaoOs']);
}

/**
 * Compacta uma pasta em um zip e coloca uma senha.
 * @param {String} pastaOrigem A Pasta de origem a ser compactada.
 * @param {String} caminhoDestino A Pasta que o zip será colocada. 
 * @param {String} senha A Senha do zip compactado. 
 */
async function compactarPasta(pastaOrigem, caminhoDestino, senha) {
  return await executarStr(['compress', pastaOrigem, caminhoDestino, senha]);
}

async function desligarComputador() {
  return await executarStr(['shutdown', 0]);
}

exports.abrirDialogArquivo = abrirDialogArquivo;
exports.compactarPasta = compactarPasta;
exports.executarStr = executarStr;
exports.desligarComputador = desligarComputador;
exports.getVersaoWindows = getVersaoWindows;
