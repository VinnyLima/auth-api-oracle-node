const oracledb = require('oracledb');
const dbConfig = require('../ConfigData/database');
 
//Cria um pool de conexção no banco oracle
async function initialize() {
  const pool = await oracledb.createPool(dbConfig.hrPool);
}
module.exports.initialize = initialize;
 
//Realiza o fechamento da conexão com o banco de dados
async function close() {
    await oracledb.getPool().close();
  }
   
module.exports.close = close;

/**
 * 
 * @param {*} statement 
 * @param {*} binds 
 * @param {*} opts 
 * função que realiza todas as três operações com uma única chamada
 * três etapas: obtenha uma conexão, execute o código e libere a conexão
 */
function simpleExecute(statement, binds = [], opts = {}) {
    return new Promise(async (resolve, reject) => {
      let conn;
   
      opts.outFormat = oracledb.OBJECT;
      opts.autoCommit = true;
   
      try {
        conn = await oracledb.getConnection();
   
        const result = await conn.execute(statement, binds, opts);
   
        resolve(result);
      } catch (err) {
        reject(err);
      } finally {
        if (conn) { // conn assignment worked, need to close
          try {
            await conn.close();
          } catch (err) {
            console.log(err);
          }
        }
      }
    });
  }
   
  module.exports.simpleExecute = simpleExecute;