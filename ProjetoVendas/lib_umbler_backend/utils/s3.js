

const co        = require('co');
const AWS       = require('aws-sdk');

let s3Client = null;

function configurar(accessKey, secretKeyId) {
  s3Client = new AWS.S3({
    accessKeyId: accessKey,
    secretAccessKey: secretKeyId,
    signatureVersion: 'v2'
  });
}

// Cria o client:
/**
 * Insere um objeto no S3.
 * @param {*} key O Caminho e nome do objeto no S3 (Ex: D10/3nbcqwueiphnp.jpg)
 * @param {*} base64 A Base64
 */
function putObject(key, base64) {
  return new Promise((resolve, reject) => {
    co(function* () {
      const buf = new Buffer(base64.replace(/^data:image\/\w+;base64,/, ""),'base64')
  
      const options = {
        Bucket: 'suaprefeitura-homologacao-1',
        Key: key,
        ACL: 'public-read',
        Body: buf,
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg'
      };

      s3Client.putObject(options, (err, data) => {
        if (err)
          return reject(err);
        return resolve(data);
      });

    }).catch(reject);
  });
}

/**
 * Recupera um objeto do S3
 */
function getObject(key) {
  return new Promise((resolve, reject) => {
    co(function* () {

      const options = {
        Bucket: constants.AMAZON_BUCKET_1,
        Key: key,
      };

      s3Client.getObject(options, (err, data) => {
        if (err)
          return reject(err);
        return resolve(data.Body);
      });

    }).catch(reject);
  });
}

/**
 * Lista todos os objetos dentro de uma pasta específica do
 * s3. Pode ser um caminho de pastas (Ex: pasta1/pasta2/pasta3/abc)
 */
function listObjects(folder) {
  return new Promise((resolve, reject) => {
    co(function* () {

      const options = {
        Bucket: constants.AMAZON_BUCKET_1,
        Prefix: folder + '',
      };

      s3Client.listObjects(options, (err, data) => {
        if (err)
          return reject(err);
        return resolve(data.Contents);
      });

    }).catch(reject);
  });
}

/**
 * Retorna o primeiro objeto de uma pasta no s3.
 */
function getFirstObjectFromFolder(folder) {
  return new Promise((resolve, reject) => {
    co(function* () {

      const objects = yield listObjects(folder);
      if (objects.length > 0) {
        const firstKey = objects[0].Key;
        const result = yield getObject(firstKey);
        return resolve(result);
      } else {
        return resolve(null);
      }

    }).catch(reject);
  });
}

/**
 * Retorna o primeiro objeto de uma pasta no s3.
 */
function getAllObjectsFromFolder(folder) {
  return new Promise((resolve, reject) => {
    co(function* () {

      const objects = yield listObjects(folder);
      if (objects.length > 0) {
        const arr = [];
        for (let i = 0; i < objects.length; i++) {
          const result = yield getObject(objects[i].Key);
          arr.push(result);
        }
        return resolve(arr);
      } else {
        return resolve(null);
      }

    }).catch(reject);
  });
}

// Exports ===

exports.putObject = putObject;
exports.getObject = getObject;
exports.listObjects = listObjects;
exports.getFirstObjectFromFolder = getFirstObjectFromFolder;
exports.getAllObjectsFromFolder = getAllObjectsFromFolder;
exports.configurar = configurar;
