'use strict';

const EntidadeSinc = require('../lib_umbler_backend/sincronizacao/EntidadeSinc');
const field = require('../lib_umbler_backend/sincronizacao/field');

module.exports = class Usuario extends EntidadeSinc {

  constructor() {
    super('tab_empresa');
  }

  getFields() {
    return [
      field('cod_empresa').pk(),
      field('nome_empresa').varchar(100),
      field('razao_social').varchar(200),
      field('doc_federal').varchar(200), 
      field('status_ativo').enum('S', 'N').default('S'), 
    ];
  }
 
 
  // indices necessarios
  /**
	PRIMARY KEY (`id`),
	UNIQUE INDEX `usuario` (`usuario`),
	INDEX `id_usuario_cadastro` (`id_usuario_cadastro`)
   */  

};
