'use strict';

const EntidadeSinc = require('../lib_umbler_backend/sincronizacao/EntidadeSinc');
const field = require('../lib_umbler_backend/sincronizacao/field');

module.exports = class tab_usuario extends EntidadeSinc {

  constructor() {
    super('tab_usuario');
  }

  getFields() {
    return [
      field('id').pk(),
      field('nome_usuario').varchar(100),
      field('usuario').varchar(200).unique(),
      field('email').varchar(200),
      field('senha').varchar(100), 
      field('status_ativo').enum('S', 'N').default('S'),
      field('tipo').enum('A', 'C', 'G').default('C'), // admin ou comum 
      field('cod_empresa').int(11),
    ];
  }

  getDefaults() {
    return [
      ' insert into tab_usuario set ' + 
      '   nome_usuario  = "Admin", ' + 
       '  usuario  = "Admin", ' + 
      '   senha = md5("123456"), ' + 
      '   tipo  = "A" ',
    ];
  }

  getReferences() {
    return [
      field('cod_empresa').references('tab_empresa(cod_empresa)', 'cod_empresa'), 
    ];
  }

  // indices necessarios
  /**
	PRIMARY KEY (`id`),
	UNIQUE INDEX `usuario` (`usuario`),
	INDEX `id_usuario_cadastro` (`id_usuario_cadastro`)
   */  

};
