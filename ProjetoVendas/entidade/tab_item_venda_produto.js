'use strict';

const EntidadeSinc = require('../lib_umbler_backend/sincronizacao/EntidadeSinc');
const field = require('../lib_umbler_backend/sincronizacao/field');

module.exports = class tab_item_venda_produto extends EntidadeSinc {

  constructor() {
    super('tab_item_venda_produto');
  }

  getFields() {
    return [
      field('cod_itens_venda_produto').pk(),
      field('codigo_item').int(6),
      field('lucro_unitario').double('12,4'),
      field('quantidade').int(6),  
      field('sub_totalItens').double('12,4'),
      field('valor_unitario').double('12,4'),
      field('cod_produto').int(11),
      field('cod_venda').int(11),
      field('status_ativo').enum('S', 'N').default('S'),


    ];
  }

  getReferences() {
    return [
      field('cod_produto').references('tab_produto(cod_produto)', 'cod_produto_pk'), 
      field('cod_venda').references('tab_venda(cod_venda)', 'cod_venda_pk'), 

    ];
  }
  
  // indices necessarios
  /**
	PRIMARY KEY (`id`),
	UNIQUE INDEX `usuario` (`usuario`),
	INDEX `id_usuario_cadastro` (`id_usuario_cadastro`)
   */  

};
