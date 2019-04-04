try {
  const env = require('./env');
  if (!env.production) {
    require('react-scripts/scripts/start');
  }

  global.appDir = __dirname;

  const expressUtils  = require('./lib_umbler_backend/express_utils');
  const socketUtils   = require('./lib_umbler_backend/socket_utils');
  const database      = require('./lib_umbler_backend/db_utils');
  const Routes        = require('./routes/Routes');
  const SocketEvents  = require('./routes/SocketEvents');
  const sincronizador = require('./lib_umbler_backend/sincronizacao/sincronizador');
  const path          = require('path');

  const server = expressUtils.criarServidor(3000, (serv, express) => {
    serv.use(express.static(path.join(__dirname, './build')));
    serv.use('/static', express.static(path.join(__dirname, 'build', 'static')));
    serv.get('/app/*', (req, res) => {
      res.sendFile(path.join(global.appDir, 'build', 'index.html'));
    });
    serv.get('/app', (req, res) => {
      res.sendFile(path.join(global.appDir, 'build', 'index.html'));
    });
    serv.get('/ping', (req, res) => {
      res.send('ok');
    });
  });

  // Cria a conexão com o banco de dados, o método já irá salvar o objeto da conexão
  // na variável global DATABASE_CONNECTION.
  database.criarConexao({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: 'san01xlz',
    database: 'sc',
  });

  const io = socketUtils.criarServidor(server);
  
  setTimeout(() => {
	  database.query('select 1');
  }, 1000 * 60 * 5);

  //sincronizador.sinc('apice_fechamento', 'entidade');
  new SocketEvents(io);
  new Routes(server); // Ativa as rotas
} catch (ex) {
  console.log(ex);
}
