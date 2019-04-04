import * as Apice from './lib_react_adminlte/main/Apice';
import tabReducer from './lib_react_adminlte/template/tab/tabReducer';
import filiaisReducer from './utils/filialReducer';
import Api from './utils/Api.jsx';
import CadastroUsuario from './componentes/CadastroUsuario';
import CadastroEmpresa from './componentes/CadastroEmpresa';

const opcoes = new Apice.Options();

Apice.iniciarAplicacao({
    tab: tabReducer,
    filiais: filiaisReducer,
  }, (redux, menuItem) => {
    const arr = [];

    arr.push(menuItem('empresa', 'Empresa', 'fa-building', CadastroEmpresa));
    arr.push(menuItem('usuario', 'Usuário', 'fa-users', CadastroUsuario));
     
    // if (redux.usuario.tipo_usuario == 1) {
    //   arr.push(menuItem('usuario', 'Usuário', 'fa-user', CadastroUsuario));
    // }
   
    return arr;
  }, 
  'fa-money',
  'Gerenciador De Vendas',
  'apice_fechamento_web',
  'http://192.168.1.4:3000',
  opcoes,
);