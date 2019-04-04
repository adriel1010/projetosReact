const mysql = require('mysql');
const co    = require('co');

let pool = null;

function criarNovaConexao(dados) {
  return mysql.createConnection(dados);
}

/**
 * Troca o banco de dados da conexão especificada.
 * @param {Connection} connection A Conexão padrão do mysql.
 * @param {String} database O Banco de destino.
 */
function trocarBanco(connection, database) {
  return new Promise((resolve) => {
    connection.changeUser({ database }, (err) => {
      if (err) {
        return resolve(false);
      }
      return resolve(true);
    });
  });
}

/**
 * Retorna uma conexão do POOL de conexões padrão no pool.
 * @param {Number} tentativas O Numero de tentativas de pegar uma conexão, caso atinja
 *  3 o método rejeita a execução e levanta um erro.
 */
function getConnection(tentativas) {
  return new Promise((resolve, reject) => {
    if (!tentativas) {
      tentativas = 0;
    }
    try {
      pool.getConnection((err, conn) => {
        if (err) {
          if (tentativas === 3) {
            reject(err);
          }
          return getConnection(tentativas + 1);
        }
        resolve(conn);
      });
    } catch (error) {
      console.log('[DBUTILS] FALHA NA POOL');
      if (tentativas === 3) {
        reject(error);
      }
      return getConnection(tentativas + 1);

    }
    
  });
}

/**
 * Realiza uma query e retorna os resultados. Caso não seja especificado a conexão
 * no último parâmetro a query irá ser realizada com a variável pool.
 * @param {String} sql O Sql a ser executado.
 * @param {Object|Array} params Os parâmetros do sql.
 * @param {Connection} connection Conexão opcional do mysql.
 */
function query(sql, params, connection) {
  return new Promise((resolve, reject) => {
    co(function* () {
      let conn = connection;
      if (!conn) {
        conn = yield getConnection();
      }
      conn.query(sql, params, (err2, res) => {
        if (!connection) {
          // Só podemos liberar se foi criado agora a conexão
          conn.release();
        }
        if (err2) {
          reject(err2);
        } else {
          resolve(res);
        }
      });
    }).catch(console.log);
  });
}

function query2(sql, params, db) {

  return new Promise((resolve, reject) => {

    co(function* () {
        let conn = db;
        if (!conn) {
          conn = yield getConnection();
        }
    const result = {};
    conn.query(sql, params, (err, rows, fields) => {
        if (err) {
          result.err = err;
          result.length = 0;
          return reject(result);
        }
        result.rows = rows;
        result.length = rows.length;
        result.fields = fields;
        resolve(result);
      });
    }).catch(console.log)
  })
}

/**
 * Realiza uma query e retorna o primeiro registro.
 * @see query
 */
async function queryFindOne(sql, params, connection) {
  const ret = await query(sql, params, connection);
  return ret[0];
}

/**
 * Realiza uma query silenciosa, não levantando erro caso ocorra um.
 * @see query
 */
async function querySilent(sql, params, connection) {
  try {
    return await query(sql, params, connection);
  } catch (ex) {
    //
  }
}

/**
 * Cria um pool de conexões com o banco de dados mySQL.
 * O Pool já é salvo na variável pool.
 * @param {Object} dados O mesmo objeto passado para o mysql.createConnection();
 */
function criarConexao(dados) {
  try {
    const database = mysql.createPool({
      connectionLimit: 80,
      connectTimeout  : 60 * 60 * 1000,
      aquireTimeout   : 60 * 60 * 1000,
      timeout         : 60 * 60 * 1000,
      host     : process.env.DB_HOST || dados.host,
      port     : process.env.DB_PORT || dados.port,
      user     : process.env.DB_USER || dados.user,
      password : process.env.DB_PASSWORD || dados.password,
      database : process.env.DB_DATABASE || dados.database,
    });
    pool = database;
    pool.on('error', (err) => {
      console.log('ERRO NA POOL ', err);
    })
  } catch (error) {
    console.log('[WEB2] ERRO AO CONECTAR NO BANCO DE DADOS \n' + error);
  }

}

/**
 * @param {String} prefixo O Prefixo dos bancos.
 * @return {String[]} A lista de banco de dados da conexão.
 */
async function listarDatabases(prefixo, connection) {
  const ret = await query(`show databases like '${prefixo || ''}%'`, [], connection);
  return ret.map(x => x[Object.keys(x)[0]]);
}

/**
 * Retorna um array de string de todos os campos da tabela.
 * @param {String} dbName O Nome do banco de dados.
 * @param {String} tabela A Tabela.
 */
async function getCamposTabela(dbName, tabela, connection) {
  try {
    const fields = (await query(
                ` select group_concat(column_name) as colunas from
                information_schema.COLUMNS a where a.TABLE_NAME = '${tabela}'
                and a.TABLE_SCHEMA = '${dbName}'`, [], connection))[0].colunas;
    return (fields.split(','));
  } catch (ex) {
    console.log(ex);
    throw ex;
  }
}

/**
 * Checa se a tabela existe ou não, return true se sim e false se não.
 * @param {String} table O Nome da tabela.
 */
async function checarSeTabelaExiste(table, connection) {
  try {
    const cursor = await query('show tables like "' + table + '"', [], connection);
    return (cursor.length > 0);
  } catch (ex) {
    console.log(ex);
    throw ex;
  }
}

exports.query = query;
exports.query2 = query2;
exports.checarSeTabelaExiste = checarSeTabelaExiste;
exports.getCamposTabela = getCamposTabela;
exports.criarConexao = criarConexao;
exports.querySilent = querySilent;
exports.queryFindOne = queryFindOne;
exports.getConnection = getConnection;
exports.listarDatabases = listarDatabases;
exports.trocarBanco = trocarBanco;
exports.criarNovaConexao = criarNovaConexao;
