import React from 'react';
import QRCode from 'qrcode';
import Api from '../../utils/Api.jsx';

export default class GeraQRCode extends React.Component {
  state = {
    filial:[],
    opts:{
      errorCorrectionLevel: 'H',
      type: 'image/jpeg',
      rendererOpts: {
        quality: 1,
      },
    },
  };
  componentDidMount() {
    this.geraImagem();
  }

  async getLink() {
    const ret = await Api.buscar('tab_filial');  // no futuro trocar pelo apicedados.tab_config_ws
    return ret.dados[0].ip_servidor_webservice;
  }
  async geraImagem() {
    const l = await this.getLink();
    QRCode.toDataURL('http://' + l + ':9998/cardapio',
     this.state.opts,
     (err, urlBase64) => {
      const img = document.getElementById('qrcode');
        img.src = urlBase64;
      }
  );
  }

  render() {
    return (

     <img id='qrcode' width={this.props.width} alt='' />

    );
  }
}
