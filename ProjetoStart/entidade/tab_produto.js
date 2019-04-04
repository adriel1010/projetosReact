'use strict';

const EntidadeSinc = require('../lib_umbler_backend/sincronizacao/EntidadeSinc');
const field = require('../lib_umbler_backend/sincronizacao/field');

module.exports = class Usuario extends EntidadeSinc {

  constructor() {
    super('tab_produto');
  }

  getFields() {
    return [
      field('cod_produto').pk(),
      field('nome_produto').varchar(100),
      field('preco_compra').double('12,4'),
      field('preco_venda').double('12,4'),
      field('porcentagem').double('12,4'),
      field('lucro').double('12,4'),
      field('codigo_barra').double('12,4'),
      field('cod_empresa').int(11),


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
