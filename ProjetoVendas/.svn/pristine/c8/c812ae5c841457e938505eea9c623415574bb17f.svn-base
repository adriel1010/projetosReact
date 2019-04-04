'use strict';

const Controller = require('./Controller');

/**
 */
module.exports = (class SocketEvents {

  constructor(io) {
    this.controller = new Controller();
    this.io = io;
    this.io.on('connect', (socket) => {
      console.log('Socket se conectou!', socket.id);
      this.ativarEventos(socket);
    });
  }

  /**
   */
  ativarEventosEnvioGPS(socket) {
    socket.on('log', (uuid, msg, dt_hr_log, appId) => {
      console.log('[Log de dispositivo]', msg, appId);
      this.controller.salvarLogDisp(uuid, msg, dt_hr_log, appId);
    });
  }

  ativarEventos(socket) {
    this.ativarEventosEnvioGPS(socket);
  }

});
