'use strict';

const EntidadeSinc = require('../lib_umbler_backend/sincronizacao/EntidadeSinc');
const field = require('../lib_umbler_backend/sincronizacao/field');

module.exports = class Sample extends EntidadeSinc {

  constructor() {
    super('usuario');
  }

  getFields() {
    return [
      field('id').pk(),
      field('Sample').varchar(100).unique(),
    ];
  }

  getDefaults() {
    return [
      ' insert into sample set ' + 
      '   Sample  = "Exemplo" '
    ];
  }

};
