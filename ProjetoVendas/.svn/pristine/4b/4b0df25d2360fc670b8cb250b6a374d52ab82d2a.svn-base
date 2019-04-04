'use strict';

const apiceAuth = require('../lib_umbler_backend/apice_auth');
const GenericRoutes = require('../lib_umbler_backend/routes/GenericRoutes');
const Controller = require('./Controller');

/**
 * Classe de rotas específicas da aplicação, herda da classe de rotas
 * genéricas para salvar e recuperar entidades do banco.
 */
module.exports = (class Routes extends GenericRoutes {

  constructor(server) {
    super(server);
    // Sobrescreve o controller para que possamos colocar métodos
    // mais específicos.
    this.controller = new Controller();
  }

  ativarRotas(server) {
    super.ativarRotas(server);

    // Rota de login:
    server.post('/login', async (req, res) => {
      try {
        const dados = await this.controller.login(req.body.login, req.body.senha);
        res.send({ status: true, dados });
      } catch (ex) {
        res.send({ status: false, erro: ex });
      }
    });
  }
});
