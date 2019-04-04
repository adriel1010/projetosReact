

const EntidadeSinc = require('../sincronizacao/EntidadeSinc');
const field = require('../sincronizacao/field');

module.exports = (class CustomField extends EntidadeSinc {

  constructor() {
    super('custom_field');
  }

  getFields() {
    return [
      field('id').pk(),
      field('nome').varchar(255),
      field('valor').text(),
      field('aux').varchar(255),
      field('versao').int(6).default(1),
    ];
  }

  // getDefaults() {
  //   return [
  //     ` insert into custom_field set nome = 'cad_tipo_visu_pesq', valor = 'lista'`,
  //     ` insert into custom_field set nome = 'cad_tipo_abertura', valor = 'form'`,
  //     ` insert into custom_field set nome = 'cad_pre_filtrar_pesq', valor = 's'`,
  //   ];
  // }

});