const nodemailer = require('nodemailer');

/**
 * Classe de envio de e-mail genérica.
 */
module.exports = class Email {

  constructor() {
    this.nodemailer = null;
    this.options = {
      attachments: [],
    };
    this.HOST_GMAIL = 'smtp.gmail.com';
    this.HOST_HOTMAIL = 'smtp.live.com';
    this.HOST_HOTMAIL = 'smtp.mail.yahoo.com';
    this.HOST_WHM = 'apollo.serverbr13.com';
  }

  /**
   * Realiza a autenticação no email.
   * @param {String} host O Host do email (smtp.google.com, smtp.live.com, etc).
   * @param {String} port A Porta de conexão.
   * @param {String} email O Email.
   * @param {String} usuario O Usuário, geralmente é a mesma coisa que o email.
   * @param {String} senha A Senha.
   */
  autenticar(host, port, email, usuario, senha) {
    this.options.from = email;
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user: usuario,
        pass: senha,
      },
      tls:{
        rejectUnauthorized: false
      }
    });
  }

  /**
   * Realiza a autenticação via gmail.
   */
  autenticarGmail(email, usuario, senha) {
    this.autenticar(this.HOST_GMAIL, 465, email, usuario, senha);
  }

  /**
   * Realiza a autenticação via hotmail.
   */
  autenticarHotmail(email, usuario, senha) {
    this.autenticar(this.HOST_HOTMAIL, 587, email, usuario, senha);
  }

  /**
   * Realiza a autenticação via yahoo.
   */
  autenticarYahoo(email, usuario, senha) {
    this.autenticar(this.HOST_YAHOO, 465, email, usuario, senha);
  }


  autenticarWHM(email, usuario, senha){
    this.autenticar(this.HOST_WHM, 465, email, usuario, senha)
  }
  /**
   * Adiciona um anexo de base64.
   * @param {String} nomeArquivo O nome do arquivo. 
   * @param {String} conteudo A Base64. 
   * @param {String|Number} cid O Id do attachment, deve ser único no e-mail. 
   */
  adicionarAnexoBase64(nomeArquivo, conteudo, cid) {
    this.options.attachments.push({
      fileName: nomeArquivo,
      content: conteudo,
      encoding: 'base64',
      contentType: 'image/jpeg',
      cid,
    });
  }

  setCorpo(mensagem, isHtml) {
    if (isHtml) {
      this.options.html = mensagem;
    } else {
      this.options.text = mensagem;
    }
  }

  async enviar(assunto, emailsDestino) {
      this.options.subject = assunto;
      this.options.to = emailsDestino;
      try {
      const ret = await this.transporter.sendMail(this.options);
      return ret;
      } catch (error) {
        console.log(error);
        return error;
      }
      
  }

};
