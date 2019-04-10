'use strict';

const EntidadeSinc = require('../lib_umbler_backend/sincronizacao/EntidadeSinc');
const field = require('../lib_umbler_backend/sincronizacao/field');

module.exports = class tab_venda extends EntidadeSinc {

  constructor() {
    super('tab_venda');
  }

  getFields() {
    return [
      field('cod_venda').pk(),
      field('descricao').varchar(100),
      field('vr_total').double('12,4'),
      field('lucro').double('12,4'),
      field('forma_pagamento').enum(1, 2, 3, 4, 5).default(1), // 1 dinehri - 2 cartão debito - 3 cartão credito - 4 notinha - 5 cheque. 
      field('data_venda').datetime(),
      field('status_ativo').enum('S', 'N').default('S'),
      field('vr_subTotal').double('12,4'),
      field('cod_funcionario').int(11), 


    ];
  }

  getReferences() {
    return [
      field('cod_funcionario').references('tab_usuario(cod_usuario)', 'cod_funcionario_pk'), 
    ];
  }
  
  // indices necessarios
  /**
	PRIMARY KEY (`id`),
	UNIQUE INDEX `usuario` (`usuario`),
	INDEX `id_usuario_cadastro` (`id_usuario_cadastro`)
   */  

};
