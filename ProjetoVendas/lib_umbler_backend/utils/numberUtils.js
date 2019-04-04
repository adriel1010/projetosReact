const accounting = require('accounting');

const _ = require('lodash');

// const co = require('co');

function leftZeroPad(value, zeroes) {
  let sZeroes = '';
  for (let x = 0; x < zeroes; x++) {
    sZeroes += '0';
  }
  return (sZeroes + value).slice(-(sZeroes.length));
}

exports.leftZeroPad = leftZeroPad;

function round(value, decimalPlaces) {
  return _.round(value, decimalPlaces);
  //return Number(Number(value).toFixed(decimalPlaces));
}

exports.round = round;

function getValorProporcional(valor, perc) {
  if (Number(valor) > 0 && Number(perc) > 0) {
    return Number((Number(valor) * Number(perc)) / 100);
  }
  return 0;
}

exports.getValorProporcional = getValorProporcional;

function getPercentualProporcional(valorA, valorB) {
  if (Number(valorA) > 0 && Number(valorB) > 0) {
    return Number((Number(valorA) / Number(valorB)) * 100);
  }
  return 0;
}

exports.getPercentualProporcional = getPercentualProporcional;

/**
 * formatFloat(valor, casa_decimais)
 * Formata valores decimais ex: 100.00 para 100,00
 * @param {Float} valor é o valor a ser formatado
 * @param {Integer} casa_decimais é a quantidade de casas decimais a seram apresentada DEFAULT 2
 */
function formatFloat(valor, casa_decimais) {
  // ormatMoney(number: number | string, symbol?: string, precision?: number,
  //  thousand?: string, decimal?: string, format?: string): string;
  if (!valor) {
    return '0,00';
  }
  return accounting.formatNumber(valor, casa_decimais || 2, '.', ',');
}
exports.formatFloat = formatFloat;


function doRateioValores(dadosRateio) {
  const valorARatear = dadosRateio.valorARatear;
  const valorTotalGeral = dadosRateio.valorTotalGeral;
  const valorTotalItem = dadosRateio.valorTotalItem;
  return round(
    getValorProporcional(valorARatear,
      getPercentualProporcional(valorTotalItem, valorTotalGeral))
    , 2);
}

exports.doRateioValores = doRateioValores;

/**
 * doCorrecaoValoresTotais(dadosCorrecao)
 * @param {*} dadosCorrecao
 * arrayValores -> Recebe o array a ser validado o valor totalizado
 * valorTotalGeral -> Recebe o valor total a ser validada a equivalencia
 * campoArrayTotalizar -> nome do field a ser totalizado no array
 */
function doCorrecaoValoresTotais(dadosCorrecao) {
  const arrayValores = dadosCorrecao.arrayValores;
  const valorTotalGeral = dadosCorrecao.valorTotalGeral;
  const campoArrayTotalizar = dadosCorrecao.campoArrayTotalizar;

  const nVrTotalArray = _.sumBy(arrayValores, campoArrayTotalizar);
  if (Number(valorTotalGeral) > Number(nVrTotalArray)) {
    const item = arrayValores[arrayValores.length - 1];
    item[campoArrayTotalizar] = round(item[campoArrayTotalizar] +
      (Number(valorTotalGeral) - Number(nVrTotalArray)), 2);
  } else if (Number(valorTotalGeral) < Number(nVrTotalArray)) {
    const item = arrayValores[arrayValores.length - 1];
    item[campoArrayTotalizar] = round(item[campoArrayTotalizar] -
      (Number(nVrTotalArray) - Number(valorTotalGeral)), 2);
  }
}

exports.doCorrecaoValoresTotais = doCorrecaoValoresTotais;
