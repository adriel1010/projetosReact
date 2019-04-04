const fs = require('fs');
const path = require('path');
const child_process = require('child_process');
const del = require('del');
const extractZip = require('extract-zip');
const apiceConsole = require('./console/apiceConsole');

/**
 * Executa um comando de console.
 * @param {String} comando O Comando a ser executado.
 */
function executarConsole(comando, cwd) {
  return new Promise(async (resolve, reject) => {
    child_process.exec(comando, { cwd }, (err, stdout) => {
      if (err) {
        reject(err);
      } else {
        resolve(stdout);
      }
    });
  });
}

/**
 * Executa um arquivo do sistema.
 * @param {String} caminho O Caminho do arquivo.
 */
function executarArquivo(caminho, parametros) {
  const cwd = path.parse(caminho).dir;
  return new Promise(async (resolve, reject) => {
    child_process.exec(caminho, parametros, { cwd }, (err, stdout) => {
      if (err) {
        reject(err);
      } else {
        resolve(stdout);
      }
    });
  });
}

/**
 * Lista todos as pastas dentro de uma pasta, só serão retornados
 * as pastas, arquivos serão ignorados.
 * @param {String} pasta O Caminho absoluto da pasta.
 * @return {String[]} Um array de caminhos absolutos de pastas.
 */
function listarPastas(pasta) {
  const newArr = [];
  const pastas = fs.readdirSync(pasta);
  for (const p of pastas) {
    if (!isArquivo(path.join(pasta, p))) {
      newArr.push(path.join(pasta, p));
    }
  }
  return newArr;
}

/**
 * Lista todos os arquivos dentro de uma pasta, só serão retornados
 * os arquivos, pastas serão ignoradas.
 * @param {String} pasta O Caminho absoluto da pasta.
 * @return {String[]} Um array de caminhos absolutos de arquivos na pasta.
 */
function listarArquivos(pasta) {
  const newArr = [];
  const arquivos = fs.readdirSync(pasta);
  for (const arquivo of arquivos) {
    if (isArquivo(path.join(pasta, arquivo))) {
      newArr.push(path.join(pasta, arquivo));
    }
  }
  return newArr;
}

/**
 * Compacta uma pasta em um zip e coloca uma senha.
 * @param {String} pastaOrigem A Pasta de origem a ser compactada.
 * @param {String} caminhoDestino A Pasta que o zip será colocada.
 * @param {String} senha A Senha do zip compactado.
 */
async function compactarPasta(pastaOrigem, caminhoDestino, senha) {
  return await executarConsole(`7zip\\7z.exe a "${caminhoDestino}" "${pastaOrigem}" -p${senha}`,
    global.appDir);
}

/**
 * Desliga o computador.
 */
async function desligarComputador() {
  return await apiceConsole.desligarComputador();
}

/**
 * Extrai um arquivo zip.
 * @param {String} caminhoZip O Caminho do zip a ser extraido.
 * @param {String} pastaDestino A Pasta de destino da extração.
 */
async function extrairZip(caminhoZip, pastaDestino) {

  let erro = false;
  function _extrair() {
    return new Promise(async (resolve) => {
      extractZip(caminhoZip, { dir: pastaDestino }, (err) => {
        erro = err;
        console.log(err);
        resolve();
      });
    });
  }

  await _extrair();
  if (erro) {
    console.log('[ZIP] Falha na extração do .zip, tentando novamente! 1/4');
    await _extrair();
  }
  if (erro) {
    console.log('[ZIP] Falha na extração do .zip, tentando novamente! 2/4');
    await _extrair();
  }
  if (erro) {
    console.log('[ZIP] Falha na extração do .zip, tentando novamente! 3/4');
    await _extrair();
  }
  if (erro) {
    console.log('[ZIP] Falha na extração do .zip, tentando novamente! 4/4');
    await _extrair();
  }
  if (erro) {
    console.log('[ZIP] FALHA CRITICA REINICIANDo O PROCESSO');
    console.log(erro);
    process.exit(1)
    throw erro;
  }
}

/**
 * Deleta uma pasta.
 * @param {String} pasta O Caminho da pasta.
 */
async function deletarPasta(pasta) {
  return await del([pasta], { force: true });
}

/**
 * @param {*} caminho
 */
function deletarArquivo(caminho) {
  return fs.unlinkSync(caminho);
}

/**
 * Copia um arquivo no caminho especificado para a pasta de destino.
 * @param {String} arquivoOrigem O Arquivo de origem.
 * @param {String} pastaDestino A Pasta de destino.
 */
async function copiarArquivo(arquivoOrigem, pastaDestino) {
  if (!arquivoExiste(arquivoOrigem)) {
    throw new Error('Arquivo para cópia não existe! ' + arquivoOrigem);
  }
  const comando = isArquivo(arquivoOrigem) ? 'copyFile' : 'copyDir';
  return await apiceConsole.executarStr(
    [comando, path.normalize(arquivoOrigem), path.normalize(pastaDestino)]
  );
}

/**
 * @param {String} nome O Caminho do arquivo.
 * @return O Tamanho do arquivo em bytes ou -1 se o arquivo não existe.
 */
function getTamanhoArquivo(nome) {
  try {
    return fs.statSync(nome).size;
  } catch (ex) {
    return 0;
  }
}

/**
 * Verifica se o documento no caminho é um arquivo ou uma pasta.
 * @param {String} caminho O Caminho absoluto do arquivo.
 */
function isArquivo(caminho) {
  try {
    const info = fs.statSync(caminho);
    return info.isFile();
  } catch (ex) {
    return false;
  }
}

/**
 * Escreve o conteúdo no caminho especificado.
 * @param {String} caminho O Caminho do arquivo.
 * @param {String} conteudo O Conteudo do arquivo.
 */
function criarArquivo(caminho, conteudo) {
  fs.writeFileSync(caminho, conteudo, 'utf-8');
}

/**
 * Lê o conteúdo de um arquivo no caminho especificado.
 * @param {String} caminho O Caminho do arquivo.
 */
function lerArquivo(caminho) {
  return fs.readFileSync(caminho, 'utf-8');
}

/**
 * Verifica e retorna informações do arquivo no caminho. Será retornado nulo
 * caso o arquivo não exista.
 * @return {Object} Informações do arquivo ou nulo se ele não existir.
 */
function getInfoArquivo(arquivo) {
  try {
    const stat = fs.statSync(arquivo);
    stat.fullPath = arquivo;
    return stat;
  } catch (ex) {
    return null;
  }
}

/**
 * Verifica se uma pasta ou arquivo existe.
 * @param {String} nome O Nome do arquivo/pasta
 * @return {Boolean} True se existe, false se não.
 */
function arquivoExiste(nome) {
  try {
    return fs.statSync(nome);
  } catch (ex) {
    return false;
  }
}

/**
 * Cria uma pasta no caminho especificado.
 * @param {String} nome O Caminho absoluto da pasta .
 */
function criarPasta(nome) {
  try {
    if (!arquivoExiste(nome)) {
      fs.mkdirSync(nome);
    }
  } catch (ex) {
    console.log('Não foi possível criar a pasta', nome, ex);
  }
}

function renomear(oldFilePath, newFilePath) {
  return fs.renameSync(oldFilePath, newFilePath);
}

exports.renomear = renomear;
exports.arquivoExiste = arquivoExiste;
exports.criarPasta = criarPasta;
exports.copiarArquivo = copiarArquivo;
exports.compactarPasta = compactarPasta;
exports.deletarPasta = deletarPasta;
exports.getTamanhoArquivo = getTamanhoArquivo;
exports.listarArquivos = listarArquivos;
exports.listarPastas = listarPastas;
exports.getInfoArquivo = getInfoArquivo;
exports.executarConsole = executarConsole;
exports.executarArquivo = executarArquivo;
exports.lerArquivo = lerArquivo;
exports.criarArquivo = criarArquivo;
exports.extrairZip = extrairZip;
exports.desligarComputador = desligarComputador;
exports.deletarArquivo = deletarArquivo;
