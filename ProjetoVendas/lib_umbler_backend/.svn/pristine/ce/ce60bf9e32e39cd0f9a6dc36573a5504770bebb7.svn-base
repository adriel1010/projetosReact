const google = require('googleapis');
const drive = google.drive('v3');
const fs = require('fs');
const path = require('path');
const requests = require('./requests');
const app = require('../../utils/app');
const files = require('./files');
const utils = require('./utils');

/**
 * Classe de manipulação de informações do google drive.
 */
module.exports = class GoogleDrive {

  constructor() {
    this.authGoogle = null; // Autenticação OAUTH do google.
    this.downloadCallback = () => {};
    this.uploadCallback = () => {};
  }

  async encontrarPastaArray(pastas, parentId, criarSeNaoExiste) {
    let lastParentId = parentId;
    for (const pasta of pastas) {
      const id = await this.encontrarPasta(pasta, lastParentId, criarSeNaoExiste);  
      if (!id && criarSeNaoExiste) {
        lastParentId = await this.criarPasta(pasta, lastParentId);
      } else {
        lastParentId = id;
      }
    }
    return lastParentId;
  }

  /**
   * Encontra uma pasta no drive. Caso não seja encontrada ela já é criada.
   * @param {String} nomePasta O Nome da pasta no drive separada por / 
   * @param {String} parentId O Parentid da pasta, é opcional.
   * @param {Boolean} criarSeNaoExiste Criar a pasta se não existe.
   */
  encontrarPasta(nomePasta, parentId, criarSeNaoExiste) {
    const self = this;
    return new Promise(async (resolve) => {
      if (nomePasta.indexOf('/') >= 0) {
        // Varias pastas, vamos centralizar em outro lugar.
        const p = nomePasta.split('/');
        return resolve(await this.encontrarPastaArray(p, parentId, criarSeNaoExiste));
      }

      let query = ` name = "${nomePasta}" `;
      if (parentId) {
        query += ` and "${parentId}" in parents`;
      }

      drive.files.list({
        auth: self.authGoogle,
        pageSize: 1,
        trashed: false,
        fields: 'files(id)',
        mimeType: 'application/vnd.google-apps.folder',
        q: query,
      }, async (error, response) => {
        if (error) {
          return resolve();
        }
        return resolve(response.files[0] ? response.files[0].id : null);
      });
    });
  }

  /**
   * Realiza a autenticação do drive através da conta da apice backups.apice@gmail.com.
   * Uma requisição é feita pra apice para pegar as informações da autenticação.
   */
  async autenticarViaApiceBackups() {
    let    teste = false;
    let    cont = 0;
    while (!teste) {
      try {
        const ret = await requests.post(`http://${app.ipApice}:8093/drive/request_drive_token`, {}, { timeout: 10000 });
        teste = true;
        if (ret.a && ret.r) {
          this.autenticar(ret.i, ret.s, ret.a, ret.r);
        }
      } catch (error) {
        cont++;
        if (cont > 10) {
          teste = true;
          console.log('[DRIVE] FALHA AO PEDIR DADOS PARA A APICE');
          return null;
        }
      }
    }
    
  }
  
  /**
   * Realiza a autenticação no drive, deve ser chamado antes de qualquer processo
   * de requisição no drive.
   * @param {String} clientId 
   * @param {String} clientSecret 
   * @param {String} accessToken 
   * @param {String} refreshToken 
   */
  autenticar(clientId, clientSecret, accessToken, refreshToken) {
    this.authGoogle = new google.auth.OAuth2(clientId, clientSecret);
    this.authGoogle.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  }

  /**
   * Encontra um arquivo no drive com base nos parâmetros passados.
   * @param {String} nome O Nome do arquivo no drive.
   * @param {String} parentId O Id da pasta pai no drive.
   * @return {Google.File} O Arquivo no google drive ou nulo se não foi encontrado.
   */
  encontrarArquivo(nome, parentId) {
    return new Promise(async (resolve, reject) => {
      let query = ` name = "${nome}" `;
      if (parentId) {
        query += ` and "${parentId}" in parents `;
      }

      drive.files.list({
        auth: this.authGoogle,
        pageSize: 1,
        trashed: false,
        fields: 'files(id, size)',
        q: query,
      }, (error, response) => {
        if (error || !response) {
          reject(error);
        }
        resolve(response.files[0]);
      });
    });
  }

  /**
   * Baixa um arquivo do google drive.
   * @param {Google.File} file Um arquivo do tipo Google.File.
   * @param {String} pastaDestino A Pasta de destino aonde o arquivo será colocado.
   * @param {String} nomeDestino O Nome com o qual o arquivo será baixado.
   */
  async baixarArquivo(file, pastaDestino, nomeDestino) {
    return new Promise(async (resolve, reject) => {
      files.criarPasta(pastaDestino);
      const stream = fs.createWriteStream(path.join(pastaDestino, nomeDestino));

      const tamanhoArquivo = Number(file.size);

      stream.on('finish', () => {
        stream.close();
        const infoArquivo = files.getInfoArquivo(path.join(pastaDestino, nomeDestino));
        console.log(infoArquivo.size, tamanhoArquivo);
        if (infoArquivo.size == tamanhoArquivo) {
          // Sucesso
          resolve();
        } else {
          reject(new Error('Tamanho dos arquivos diferem!'));
        }
      });
      const driveStream = drive.files.get({
        auth: this.authGoogle,
        fileId: file.id,
        alt: 'media',
      });
      utils.getProgressoFromStream(driveStream, tamanhoArquivo, (p) => {
        this.downloadCallback(p);
      });
      driveStream.pipe(stream);
    });
    
  }

  /**
   * Seta uma função de callback que será invocada para mostrar a porcentagem
   * de download de um arquivo do drive.
   * @param {Function} callback O Callback de download.
   */
  async onDownloadProgress(callback) {
    this.downloadCallback = callback;
  }

  /**
   * Seta uma função de callback que será invocada para mostrar a porcentagem
   * de upload de um arquivo do drive.
   * @param {Function} callback O Callback de upload.
   */
  async onUploadProgress(callback) {
    this.uploadCallback = callback;
  }

  /**
   * Baixa um arquivo do drive pelo nome e coloca ele na pasta de destino.
   * @param {String} nome O Nome do arquivo no Drive, caso existam vários arquivos 
   *                      com o mesmo nome será escolhido o primeiro.
   * @param {String} pastaDestino A Pasta onde o arquivo será colocado.
   */
  async baixarArquivoPeloNome(nome, pastaDestino) {
    const file = await this.encontrarArquivo(nome);
    if (file) {
      // Sucesso, encontramos o arquivo.
      await this.baixarArquivo(file, pastaDestino, nome);
    }
    return file;
  }

  /**
   * Cria um arquivo no drive.
   * @param {String} parentId O Id da pasta no drive.
   * @param {String} caminhoArquivo O Caminho do arquivo em disco.
   */
  criarArquivo(parentId, caminhoArquivo) {
    return new Promise((resolve) => {
      const nomeDrive = path.basename(caminhoArquivo);
      const resource = {
        parents: [parentId],
        name: nomeDrive,
        copyRequiresWriterPermission: false,
        viewersCanCopyContent:true,
      };
      
      const stream = fs.createReadStream(caminhoArquivo);
      utils.getProgressoFromStream(stream, files.getTamanhoArquivo(caminhoArquivo), (p) => {
        this.uploadCallback(p);
      });

      drive.files.create({
        auth: this.authGoogle,
        resource,
        media: { body: stream },
      }, (err, file) => {
        if (err) {
          console.log('Erro ao criar o arquivo no drive ', nomeDrive, ' erro -> ', err);
          return resolve();
        }
        if (!file || !file.id) {
          return resolve();
        }

        console.log('Arquivo criado com sucesso no drive ', nomeDrive);
        resolve(file.id);
      });
    });
  }

  /**
   * Atualiza um arquivo do drive.
   * @param {Google.File} file O Arquivo do drive a ser atualizado.
   * @param {String} caminhoArquivo O Arquivo de origem para atualizar.
   */
  atualizarArquivo(file, caminhoArquivo) {
    return new Promise((resolve) => {
      const stream = fs.createReadStream(caminhoArquivo);
      utils.getProgressoFromStream(stream, files.getTamanhoArquivo(caminhoArquivo), (p) => {
        this.uploadCallback(p);
      });

      drive.files.update({
        auth: this.authGoogle,
        fileId: file.id,
        resource: file.fileMetadata,
        media: { body: stream },
        fields: 'id, parents, modifiedTime, size',
      }, (err) => {
        if (err) {
          return resolve();
        }
        if (!file || !file.id) {
          return resolve();
        }

        resolve(file.id);
      });
    });
  }

  /**
   * Cria uma pasta no drive com o nome especificado dentro do parentId especificado.
   * @param {String} nome O Nome da pasta.
   * @param {String} parentId O Id da pasta pai.
   */
  async criarPasta(nome, parentId) {
    return new Promise((resolve) => {
      drive.files.create({
        auth: this.authGoogle,
        resource: {
          name: nome,
          mimeType : 'application/vnd.google-apps.folder',
          parents: [parentId],
        },
        fields: 'id',
      }, (err, file) => {
        if (err) {
          return resolve();
        }
        return resolve(file.id);
      });
    });
  }

  /**
   * Salva um arquivo no drive.
   * @param {String} pastaDrive A Pasta aonde será salva no drive no estilo A/B/C.
   * @param {String} caminhoArquivo O Caminho do arquivo no disco.
   * @param {String} nomeDrive O Nome do arquivo no qual será salvo no drive.
   * @return {String} O Id do arquivo no drive.
   */
  async salvarArquivo(pastaDrive, caminhoArquivo, nomeDrive) {
    const parentId = await this.encontrarPasta(pastaDrive, null, true);
    const arquivo = await this.encontrarArquivo(nomeDrive, parentId);
    if (!arquivo) {
      // Criaremos o arquivo
      return await this.criarArquivo(parentId, caminhoArquivo);
    } 
    // Atualizaremos o arquivo
    return await this.atualizarArquivo(arquivo, caminhoArquivo);
  }
};
