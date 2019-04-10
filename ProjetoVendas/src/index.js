import * as Apice from './lib_react_adminlte/main/Apice';
import tabReducer from './lib_react_adminlte/template/tab/tabReducer';
import filiaisReducer from './utils/filialReducer';
import Api from './utils/Api.jsx';
import CadastroUsuario from './componentes/CadastroUsuario';
import CadastroEmpresa from './componentes/CadastroEmpresa';
import CadastroProduto from './componentes/CadastroProduto';
import Vendas from './componentes/Vendas';

const opcoes = new Apice.Options();

Apice.iniciarAplicacao({
    tab: tabReducer,
    filiais: filiaisReducer,
  }, (redux, menuItem) => {
    const arr = [];

    if (redux.usuario.tipo == 'A') {
      arr.push(menuItem('empresa', 'Empresa', 'fa-building', CadastroEmpresa));
    } 
    if (redux.usuario.tipo == 'A' || redux.usuario.tipo == 'G') {
    arr.push(menuItem('usuario', 'Usuário', 'fa-users', CadastroUsuario));
    }
    if (redux.usuario.tipo == 'A' || redux.usuario.tipo == 'G') {
      arr.push(menuItem('produto', 'Produto', 'fa-product-hunt ', CadastroProduto));
      }

      arr.push(menuItem('vendas', 'Vendas', 'fa fa-money', Vendas));
    return arr;
  }, 
  'fa-money',
  'Gerenciador De Vendas',
  'apice_fechamento_web',
  'http://localhost:3000',
  opcoes,
);