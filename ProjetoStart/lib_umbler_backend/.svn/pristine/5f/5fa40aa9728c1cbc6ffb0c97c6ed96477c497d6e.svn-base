const files = require('./files');
const ini     = require('ini');
const path    = require('path');


/**
 * Calcula o progresso de envio de um stream, ativando o callback para cada porcentagem
 * diferente que o stream já mandou.
 * @param {Stream} stream O Stream.
 * @param {Number} tamanhoArquivo O Tamanho total do stream em bytes.
 * @param {Function} callback A Função de callback para ativar.
 */
function getProgressoFromStream(stream, tamanhoArquivo, callback, range) {
  let tamanhoEnviado = 0;
  let ultimaPorcentagem = 0;
  stream.on('data', (buffer) => {
    tamanhoEnviado += buffer.length;
    const porcentagem = Number(((tamanhoEnviado / tamanhoArquivo) * 100).toFixed(2));
    if ((ultimaPorcentagem < (porcentagem - (range || 2))) || porcentagem >= 100) {
      callback(porcentagem);
      ultimaPorcentagem = porcentagem;
    }
  });
}

/**
 * Extrai um arquivo zip.
 * @param {String} caminhoZip O Caminho do zip a ser extraido.
 * @param {String} pastaDestino A Pasta de destino da extração.
 */
async function extrairZip(caminhoZip, pastaDestino) {
  return await files.extrairZip(caminhoZip, pastaDestino);
}

/**
 * @param {RegExp} rgx O Regex. 
 * @param {String} str A string. 
 * @return {Boolean} True se a string bate com o regex, false se não.
 */
function regexMatch(rgx, str) {
  const m = str.match(rgx);
  return m && m.length;
}

async function corrigeMysql(nomeServico) {
  let servMysql = nomeServico;

        // Primeiro Verificamos se o serviço do MYSQL esta instalado
        try {
          // Utilizando o state=all pegamos os serviços que estão ativos e parados
          const as = await files.executarConsole('sc.exe query state= all');

          // Verificamos se o MySQL existe
          if (as.indexOf('MySQL') > 0) {
            // Isolamos o nome do serviço MySQL(considernado o formato MySQL000)
            servMysql = as.slice(as.indexOf('MySQL'), as.indexOf('MySQL') + 8);
            // Retiramos aspas e quebras de linhas
            servMysql = String(servMysql).trim();
            // Comparamos com o nomeServico do config
            if (servMysql !== nomeServico) {
              // Modificamos o config.ini com o nome do serviço encontrado
              const config = ini.parse(files.lerArquivo(path.join(global.appDir, 'config.ini')));
              config.Backup.NomeServicoMysql = servMysql;
              files.criarArquivo(path.join(global.appDir, 'config.ini'), ini.stringify(config));
            }
            /*
              Com essa rotina não ira mais ocorrer o erro de nome do mysql errado
            */
          }
        } catch (ex) {
          console.log(ex);
        }
}


exports.regexMatch = regexMatch;
exports.extrairZip = extrairZip;
exports.corrigeSql = corrigeMysql;
exports.getProgressoFromStream = getProgressoFromStream;
