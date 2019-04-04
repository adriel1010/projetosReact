import React from 'react';
import { Column } from '../componentes/Table.jsx';

export function getColunasProduto() {
  return [
    <Column key={0} field="cod_produto" header="Código" />,
    <Column key={1} field="nome_produto" header="Descrição" />,
  ];
}

export function getColunasSetor() {
  return [
    <Column key={0} field="cod_setor" header="Código" />,
    <Column key={1} field="nome_setor" header="Setor" />,
  ];
}

export function getColunasNivel() {
  return [
    <Column key={0} field="cod_nivel" header="Código" />,
    <Column key={1} field="nome_nivel" header="Nível" />,
  ];
}

export function getColunasTamanho() {
  return [
    <Column key={0} field="cod_tamanho" header="Código" />,
    <Column key={1} field="nome_tamanho" header="Descrição" />,
  ];
}

export function getColunasGrupoProd() {
  return [
    <Column key={0} field="cod_grupo_produto" header="Código" />,
    <Column key={1} field="nome_grupo_produto" header="Grupo de produto" />,
  ];
}

export function getColunasGrupoCFOP() {
  return [
    <Column key={0} field="cod_grupo_produto_cfop" header="Código" />,
    <Column key={1} field="nome_grupo_produto_cfop" header="Grupo de produto" />,
  ];
}

export function getColunasCEST() {
  return [
    <Column key={0} field="cest" header="Código" />,
    <Column key={1} field="descricao" header="Descrição" />,
  ];
}

export function getColunasNCM() {
  return [
    <Column key={0} field="cod_ncm" header="Código" />,
    <Column key={1} field="descricao" header="NCM" />,
  ];
}

export function getColunasFuncionario() {
  return [
    <Column key={0} field="cod_funcionario" header="Código" />,
    <Column key={1} field="nome_funcionario" header="Funcionário" />,
  ];
}
export function getColunasPerfilMobile() {
  return [
    <Column key={0} field="cod_perfil_mobile" header="Código" />,
    <Column key={1} field="nome_perfil_mobile" header="Perfil" />,
  ];
}

export function getColunasExtra() {
  return [
    <Column key={0} field="cod_extra" header="Código" />,
    <Column key={1} field="nome_extra" header="Descrição" />,
  ];
}

export function getColunasFilial() {
  return [
    <Column header="Código" field="cod_filial" />,
    <Column header="Razão social" field="razao_social" />,
  ];
}
export function getColunasConvenio() {
  return [
    <Column header="Código" field="cod_convenio" />,
    <Column header="Nome" field="nome_convenio" />,
  ];
}
export function getColunasTipoCliente() {
  return [
    <Column header="Código" field="cod_tipo_cliente" />,
    <Column header="Nome" field="nome_tipo_cliente" />,
  ];
}

export function getColunasCliente() {
  return [
    <Column header="Código" field="cod_cliente" />,
    <Column header="Nome" field="nome_cliente" />,
  ];
}

export function getColunasCidade() {
  return [
    <Column header="Código" field="cod_cidade" />,
    <Column header="Nome" field="nome_cidade" />,
  ];
}
export function getColunasCarga() {
  return [
    <Column header="Código" field="cod_carga" />,
    <Column header="Data" field="dt_carga" />,
  ];
}
export function getColunasOperadoraCartao() {
  return [
    <Column header="Código" field="cod_operadora_cartao" />,
    <Column header="Nome" field="nome_operadora_cartao" />,
  ];
}
export function getColunasFormaPagamento() {
  return [
    <Column header="Código" field="cod_forma_pagamento" />,
    <Column header="Nome" field="nome_forma_pagamento" />,
  ];
}
export function getColunasTipoDocumento() {
  return [
    <Column header="Código" field="cod_tipo_documento" />,
    <Column header="Nome" field="nome_tipo_documento" />,
  ];
}

export function getColunasInsumos() {
  return [
    <Column field="nome_insumo" header="Nome do Insumo" />,
    <Column field="un_insumo" header="Unidade de Medida" />,
    <Column field="descricao_insumo" header="Descrição" />,
  ];
}

export function getColunasFornecedores() {
  return [
    <Column field="razao_social" header="Razão social" />,
    <Column field="nome_fantasia" header="Nome Fantasia" />,
    <Column field="doc_federal" header="CNPJ/CPF" />,
  ];
}

export function getColunasTamanhoMultiSelect() {
  return [
    <Column style={{ width: '30px' }} key={0} field="cod_tamanho" header="Código" />,
    <Column key={1} field="nome_tamanho" header="Descrição" />,
  ];
}

export function getColunasCaixaMovimento() {
  return [
    <Column className="coluna-cod" key={1} field="cod_caixa_movimento" header="Código" />,
    <Column className="coluna-dt" key={2} field="dt_abertura" header="Dt. Abertura" />,
    <Column className="coluna-hr" key={3} field="hr_abertura" header="Hr." />,
    <Column className="coluna-dt" key={4} field="dt_fechamento" header="Dt. Fechamento" />,
    <Column className="coluna-hr" key={5} field="hr_fechamento" header="Hr." />,
    <Column style={{ width: '60px' }} key={6} field="nome_caixa" header="Caixa" />,
    <Column key={7} field="nome_funcionario" header="Funcionário" />,
  ];
}

export function getColunasCaixaMovimentoMultiSelect() {
  return [
    <Column style={{ width: '30px' }} key={1} field="cod_caixa_movimento" header="Código" />,
    <Column  key={2} field="descricao" header="Descrição" />,
  ];
}

export function getColunasProdutoRel() {
  return [
    <Column className="coluna-cod" key={1} field="cod_produto" header="Código" />,
    <Column  key={2} field="nome_produto" header="Descrição" />,
    <Column  key={3} field="nome_grupo_produto" header="Grupo de Produto" />,
    <Column  key={4} field="nome_setor" header="Setor" />,
    <Column  key={5} field="qtde_estoque" header="Qtde em Estoque" />,
    <Column  key={6} field="status_ativo" header="Status" />,
  ];
}
export function getColunasProdutoMultiSelect() {
  return [
    <Column style={{ width: '30px' }} key={0} field="cod_produto" header="Código" />,
    <Column key={1} field="nome_produto" header="Descrição" />,
  ];
}

export function getColunasExtraMultiSelect() {
  return [
    <Column style={{ width: '30px' }} key={0} field="cod_extra" header="Código" />,
    <Column key={1} field="nome_extra" header="Descrição" />,
  ];
}

export function getColunasGrupoProdutoRel() {
  return [
    <Column style={{ width: '10px' }} key={1} field="cod_grupo_produto" header="Cod. do Grupo" />,
    <Column style={{ width: '60px' }} key={2} field="nome_grupo_produto" header="Grupo de Produto" />,
    <Column style={{ width: '10px' }} key={3} field="status_exibe_frente_caixa" header="Exibe no FC" />,
  ];
}

export function getColunasRegiao() {
  return [
    <Column className="coluna-cod" key={1} field="cod_regiao" header="Cod. Região" />,
    <Column  key={2} field="nome_regiao" header="Região" />,
    <Column  key={3} field="cod_funcionario_disp_mov" header="Cod. Funcionario Disp. Mov." />,
    <Column  key={4} field="cor_poligono" header="Cor Poligono" />,
    <Column  key={5} field="vr_tx_entrega" header="Valor Tx Entrega" />,
    <Column  key={6} field="endereco_google" header="Endereço Google" />,
  ];
}

export function getColunasFuncionarioRel() {
  return [
    <Column style={{ width: '10px' }} key={1} field="cod_funcionario" header="Cod." />,
    <Column style={{ width: '60px' }} key={2} field="nome_funcionario" header="Funcionário" />,
    <Column style={{ width: '10px' }} key={3} field="status_ativo" header="Status" />,
  ];
}

export function getColunasComanda(order) {
  if (order === 'pv_nr') {
    return [
      <Column style={{ width: '10px' }} key={1} field="pv_nr" header="Nr. Cartão" />,
      <Column style={{ width: '60px' }} key={2} field="dt_hr_abertura" header="Dt. Hr. Abertura" />,
      <Column style={{ width: '10px' }} key={3} field="cod_comanda" header="Cod." />,
    ];
  } else {
    return [
      <Column style={{ width: '10px' }} key={1} field="cod_comanda" header="Cod." />,
      <Column style={{ width: '60px' }} key={2} field="dt_hr_abertura" header="Dt. Hr. Abertura" />,
      <Column style={{ width: '10px' }} key={3} field="pv_nr" header="Nr. Cartão" />,
    ];
  }
}

export function getColunasClienteRel() {
  return [
    <Column className="coluna-cod" key={1} field="cod_cliente" header="Cod. do Cliente" />,
    <Column  key={2} field="nome_razaoSocial" header="Nome/Razão Social" />,
    <Column  key={4} field="tipo_pessoa" header="Tipo de Pessoa" />,
    <Column  key={5} field="cpfCnpj" header="CPF/CNPJ" />,
    <Column  key={7} field="nome_cidade" header="Cidade" />,
    <Column  key={8} field="status_ativo" header="Status" />,
  ];
}
