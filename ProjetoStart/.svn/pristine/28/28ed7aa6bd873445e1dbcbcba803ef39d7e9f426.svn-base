import * as Apice from './lib_react_adminlte/main/Apice';
import tabReducer from './lib_react_adminlte/template/tab/tabReducer';
import filiaisReducer from './utils/filialReducer';
import Api from './utils/Api.jsx';

const opcoes = new Apice.Options();

Apice.iniciarAplicacao({
    tab: tabReducer,
    filiais: filiaisReducer,
  }, (menuItem) => {

    let arr = []

    arr.push(menuItem('Exemplo', 'EXEMPLO', 'fa-edit' ))
    
    return arr;

  },   
  'fa-file-archive-o',
  'Apice Fechamento',
  'apice_fechamento_web',
  'localhost:3000',
  opcoes
);

  