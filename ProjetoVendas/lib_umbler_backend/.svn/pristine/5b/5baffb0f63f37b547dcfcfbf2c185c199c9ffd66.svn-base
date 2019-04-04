

const EntidadeSinc = require('./EntidadeSinc');
const dbUtils = require('../db_utils');
const fs = require('fs');
const _ = require('lodash');
const path = require('path');

/**
 * Inicia a sincronização de tabelas, só serão sincronizadas as tabelas
 * que herdarem da EntidadeSinc.
 * @param {string} database o nome do banco de dados
 * @param {string} pasta a pasta que contém as entidades
 */
async function sinc(database, pasta) {
  try {
    console.log('[SINCRONIZADOR] INICIANDO NA DATABASE ' + database);
    const entidades = fs.readdirSync(path.join(global.appDir, pasta));
    for (let i = 0; i < entidades.length; i++) {
      // eslint-disable-next-line
      const Arquivo = require(path.join(global.appDir, pasta, entidades[i]));
      const instancia = new Arquivo();
      if (instancia instanceof EntidadeSinc) {
        await sincTabela(database, instancia);
      }
    }

    if (pasta !== 'lib_umbler_backend/entidade') {
      // Também iremos sincronizar as entidades padrão.
      await sinc(database, 'lib_umbler_backend/entidade');
    }
    console.log('[SINCRONIZADOR] FINALIZADO');
  } catch (ex) {
    console.log(ex);
  }
}

/**
 * Cria e retorna o sql da criação do campo.
 * @param {object} campo O Campo da entidade
 */
function _getSqlCriacaoCampo(campo) {
  let sql = '';
  if (campo.isPk) {
    sql = ('`' + campo.nome + '` int PRIMARY KEY AUTO_INCREMENT NOT NULL');
  } else if (campo.tipo === 'enum') {
    sql += '`' + campo.nome + '` ';
    sql += campo.tipo + '(' + campo.enumValues + ') ';
    if (campo.valorDefault) {
      sql += 'default "' + campo.valorDefault + '"';
    }
  } else {
    sql += '`' + campo.nome + '` ';
    if (campo.tamanhoCampo) {
      sql += campo.tipo + '(' + campo.tamanhoCampo + ') ';
    } else {
      sql += campo.tipo + ' ';
    }
    if (campo.notnull == true) {
      sql += ' not null ';
    } else {
      sql += ' null ';
    }
    if (campo.valorDefault) {
      sql += 'default "' + campo.valorDefault + '"';
    }
  }
  return sql;
}

/**
 * Associa as referências do campos às chaves primarias
 * de outras tabelas.
 * @param {object} entidade A entidade
 */
async function associarReferencias(entidade, conexao) {
  const refs = entidade.getReferences();
  if (refs) {
    for (let i = 0; i < refs.length; i++) {
      const nomeConstraint = refs[i].nomeReferencia;
      await dbUtils.querySilent(`
        alter table ${entidade.tabela}
          ADD CONSTRAINT ${nomeConstraint}
          FOREIGN KEY (${refs[i].nome})
          REFERENCES ${refs[i].referencia}
      `, [], conexao);
    }
  }
}

/**
 * Sincroniza uma tabela em específico.
 */
async function sincTabela(database, entidade, conexao) {
  const tabela = entidade.tabela;
  const campos = entidade.getFields();
  let camposDropados = 0;
  let camposAdicionados = 0;
  const tabelaExiste = await dbUtils.checarSeTabelaExiste(tabela, conexao);

  if (!tabelaExiste) {
    console.log('- Tabela ' + tabela + ' não existe, criando ela...');
    let sql = 'CREATE TABLE IF NOT EXISTS ' + tabela + ' ( ';

    for (let x = 0; x < campos.length; x++) {
      sql += _getSqlCriacaoCampo(campos[x]) + ', ';
    }

    sql = sql.substring(0, sql.length - 2) + ') ';
    await dbUtils.query(sql, [], conexao);

    // Agora colocamos os defaults:
    const defs = entidade.getDefaults();
    if (defs) {
      for (let i = 0; i < defs.length; i++) {
        await dbUtils.query(defs[i], [], conexao);
      }
    }

    // Agora que os campos estão todos certos, vamos colocar as referencias:
    await associarReferencias(entidade);
    for (let x = 0; x < campos.length; x++) {
      if (campos[x].uniqueValue) {
        await dbUtils.querySilent('DROP INDEX ' + campos[x].nome + ' ON ' + tabela, [], conexao);
        await dbUtils.query('ALTER IGNORE TABLE ' + tabela + ' ADD UNIQUE (' + campos[x].nome + ')', [], conexao);
      }
    }
    return; // Criamos a tabela já com a estrutura certa
  }

  // removendo campos que não existem no arquivo: ...
  const camposTabela = await dbUtils.getCamposTabela(database, tabela, conexao);
  for (let x = 0; x < camposTabela.length; x++) {
    const campoExiste = _.find(campos, (q) => { return q.nome === camposTabela[x]; });
    if (!campoExiste) {
      camposDropados += 1;
      await dbUtils.query('alter table ' + tabela + ' drop column ' + camposTabela[x], [], conexao);
    }
  }

  // adicionando campos que existem no arquivo: ...
  for (let x = 0; x < campos.length; x++) {
    const res = await dbUtils.query('show fields from ' + tabela + ' like "' +
                                    campos[x].nome + '"', [], conexao);
    if (res && res.length === 0) {
      // Campo não existe
      camposAdicionados += 1;

      const campo = campos[x];
      const sql = 'ALTER TABLE ' + tabela + ' ADD COLUMN ' + _getSqlCriacaoCampo(campo);

      await dbUtils.query(sql, [], conexao);
    }

    if (campos[x].uniqueValue) {
      await dbUtils.querySilent('DROP INDEX ' + campos[x].nome + ' ON ' + tabela, [], conexao);
      await dbUtils.query('ALTER IGNORE TABLE ' + tabela + ' ADD UNIQUE (' + campos[x].nome + ')', [], conexao);
    }
  }

  // Agora que os campos estão todos certos, vamos colocar as referencias:
  await associarReferencias(entidade, conexao);
  await entidade.onStart();

  // Log informativo:
  if (camposAdicionados === 0 && camposDropados === 0) {
    // console.log('- Sincronização da tabela ' + tabela + ' terminou, não foi necessário modificá-la!');
  } else {
    console.log('- Sincronização da tabela ' + tabela + ' terminou, foi necessário ' +
                'derrubar ' + camposDropados + ' campos e adicionar ' + camposAdicionados + ' campos!');
  }
}

exports.sinc = sinc;
exports.sincTabela = sincTabela;
