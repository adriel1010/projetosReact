/* eslint-disable no-caller */
const path = require('path');
const util = require('util');
const fs = require('fs');
const moment = require('moment');
const pjson = require('../../package.json');


const PRODUCAO = 1;
const HOMOLOGACAO = 0;

/**
 * Representa o objeto de dados que é passado por parâmetro
 * para o iniciarAplicacao.
 */
class Dados {
  constructor() {
    this.ambiente = 0;
    this.porta = 3000;
    this.portaReactDev = 8999;
    this.banco = {
      host: 'localhost',
      port: 3307,
      user: 'root',
      password: 'san01xlz',
      database: 'apicedados',
    };
    this.ioServer = {
      porta: 0,
      opcoes: {},
      onInicio: () => { },
    };
    this.rotas = '';
    this.sincronizador = {
      banco: '',
      pasta: '',
    };
    this.listeners = {
      onLog: () => { },
    }; // Listeners de eventos gerais.
  }

  /**
   * Chamado uma vez que a aplicação já foi iniciada e processos
   * externos podem ser executados, específicos da aplicação.
   */
  onInicio() {
    
  }
}

/**
 * Transfere todos os logs da aplicação para o arquivo de texto na raíz
 * do programa.
 */
function transferirLogParaArquivo() {
  const oldLog = console.log;
  
  if (!fs.existsSync(path.join(global.appDir, 'LOGS'))) {
    fs.mkdir(path.join(global.appDir, 'LOGS'));
  }
  let dt  = moment(new Date()).format('YYYYMMDD');
  let arquivoTexto = path.join(global.appDir, 'LOGS', 'log_' + dt + '.txt');
  
  let logFile = fs.createWriteStream(arquivoTexto, { flags: 'a' });
  console.log = function () {
    const breakline = '\r\n';
    const text = util.format.apply(null, arguments);
    const dtHr = moment(new Date()).format('DD/MM HH:mm:ss') + ' ';
    logFile.write(dtHr + text + ' |CALLER|=> ' + (arguments.callee && arguments.callee.caller && arguments.callee.caller.name) + breakline);
    oldLog(dtHr + text + (arguments.callee && arguments.callee.caller && arguments.callee.caller.name ? ' |CALLER|=> ' + arguments.callee.caller.name  : ''));
    
    if (global.dadosInicioApice.listeners && global.dadosInicioApice.listeners.onLog) {
      global.dadosInicioApice.listeners.onLog(dtHr + text);
    }
  };
  console.error = console.log;
  

  process.on('exit', () => {
    console.log(' |♦| PROCESSO FINALIZADO |♦|');
  })
  process.on('rejectionHandled', (e) => {
    if (e && e.code == 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
      process.exit(1)
    }
  })
  process.on('unhandledRejection', (e) => {
    console.log('REJEIÇÃO NÃO TRATADA ', e);
    if (e && e.code == 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
      process.exit(1)
    }
    if (e && e.fatal == true) {
      process.exit(1)
    }
  })
  process.on('uncaughtException', (e) => {
    console.log('ERRO NÃO TRATADO ', e);
    if (e.fatal == false) {
      return;
    }
    process.exit(1)
  })


  setInterval(() => {

    if (!fs.existsSync(path.join(global.appDir, 'LOGS'))) {
      fs.mkdir(path.join(global.appDir, 'LOGS'));
    }
    dt  = moment(new Date()).format('YYYYMMDD');
    arquivoTexto = path.join(global.appDir, 'LOGS', 'log_' + dt + '.txt');
    
    logFile = fs.createWriteStream(arquivoTexto, { flags: 'a' });

    console.log = function () {
      const breakline = '\r\n';
      const text = util.format.apply(null, arguments);
      const dtHr = moment(new Date()).format('DD/MM HH:mm:ss') + ' ';
      logFile.write(dtHr + text + ' |CALLER|=> ' + (arguments.callee && arguments.callee.caller && arguments.callee.caller.name) + breakline);
      oldLog(dtHr + text + (arguments.callee && arguments.callee.caller && arguments.callee.caller.name ? ' |CALLER|=> ' + arguments.callee.caller.name  : ''));
      
      if (global.dadosInicioApice.listeners && global.dadosInicioApice.listeners.onLog) {
        global.dadosInicioApice.listeners.onLog(dtHr + text);
      }
    };
    console.error = console.log;
  }, 10000)
}

/**
 * Inicia a aplicação com os dados especificados.
 * @param {Dados} dados Os dados da aplicação.
 * @param {Number} dados.porta A Porta de requisição do backend.
 * @param {Number} dados.portaReactDev A Porta de desenvolvimento do react.
 * @param {Number} dados.ambiente O Ambiente do sistema (PRODUCAO/HOMOLOGACAO).
 * @param {Object} dados.banco Os dados da conexão com o banco de dados.
 * @param {String} dados.rotas O Caminho relative das rotas de requisição.
 * @param {Object} dados.ioServer Informações sobre o servidor de socket.
 * @param {Object} dado.sincronizador O Sincronizador do banco da aplicação.
 */
async function iniciarAplicacao(dados) {
  try {


    global.appDir = path.join(__dirname, '..', '..');
    global.dadosInicioApice = dados;

    console.log(' ************************************************'); 
    console.log(' *                ÁPICE SISTEMAS                *');
    console.log(' *             Início da aplicação!             *');
    console.log(' ************************************************');

    if (dados.ambiente == HOMOLOGACAO) {
      // Vamos alterar a porta das variáveis de ambiente apenas para iniciar
      // o servidor de desenvolvimento de react (para que seja iniciado na porta especificada)
      const p = process.env.PORT;
      process.env.PORT = dados.portaReactDev;
      require('react-scripts/scripts/start');
      // depois voltamos ao normal para não afetar nada externamente:
      process.env.PORT = p;
    }

    const expressUtils  = require('../express_utils');
    const sincronizador = require('../sincronizacao/sincronizador');
    const dbUtils       = require('../db_utils');
    const socketUtils   = require('../socket_utils');

    /**
     * Inicia o servidor do express para realizar requisições para
     * o backend da interface.
     */
    const server = expressUtils.criarServidor(dados.porta, (serv, express) => {
      serv.use(express.static(path.join(__dirname, '..', '..', './build')));
      serv.use('/static', express.static(path.join(__dirname, '..', '..', 'build', 'static')));
      serv.use('/app/*', (req, res) => {
        res.sendFile(path.join(__dirname, '..', '..', 'build', 'index.html'));
      });
      serv.use('/app', (req, res) => {
        res.sendFile(path.join(__dirname, '..', '..', 'build', 'index.html'));
      });
      serv.get('/ping', (req, res) => {
        res.send({
          status: true,
          revisao: pjson.revision,
        });
      });
    });

    /**
     * Cria a conexão padrão com o mysql.
     */
    dbUtils.criarConexao(dados.banco);

    if (global.dadosInicioApice.listeners && global.dadosInicioApice.listeners.onAfterConnection) {
      await global.dadosInicioApice.listeners.onAfterConnection(dados.banco);
    }

    /**
     * Configura o servidor de socket.io.
     */
    if (dados.ioServer) {
      if (dados.ioServer.porta === dados.porta) {
        dados.ioServer.server = socketUtils.criarServidor(server, dados.ioServer.opcoes);
        dados.ioServer.onInicio(dados.ioServer.server);
      } else {
        const ioServ = socketUtils.criarServidorNaPorta(
            dados.ioServer.porta, 
            dados.ioServer.opcoes);
        dados.ioServer.onInicio(ioServ);
        dados.ioServer.server = ioServ;
      }
    }

    /**
     * Realiza a sincronização do aplicativo com o seu banco de dados
     * se o objeto de sincronizador foi especificado.
     */
    if (dados.sincronizador && dados.sincronizador) {
      await sincronizador.sinc(dados.sincronizador.banco, dados.sincronizador.pasta);
    }

    const Routes = require(path.join(__dirname, '..', '..', dados.rotas));
    // eslint-disable-next-line
    new Routes(server);

    // Chama a inicialização externa do aplicativo se ela foi especificada:
    if (dados.onInicio) {
      dados.onInicio(dados);
    }
  } catch (ex) {
    console.log(ex);
  }
}

exports.iniciarAplicacao = iniciarAplicacao;
exports.PRODUCAO = PRODUCAO;
exports.HOMOLOGACAO = HOMOLOGACAO;
exports.Dados = Dados;
exports.iniciarLog = transferirLogParaArquivo;
