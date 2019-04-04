import React from 'react';
import Button from '../../componentes/Button.jsx';
import { connect } from 'react-redux';

/**
 * Mostra informações do usuário na barra superior da aplicação, mostra foto dele
 * e o nome, ao clicar no componente um painel aparece pra realizar o logout.
 */
class Navbar extends React.Component {

	state = {
		open: false,
	}

	/**
	 * Abre o menu sobreposto.
	 */
	openMenu() {
		this.setState({ open: true });
	}

	/**
	 * Fecha o menu sobreposto.
	 */
	closeMenu() {
		this.setState({ open: false });
	}

	onClickModal(registro) {
		this.props.dispatch({
			type: 'mudar_senha',
		});
  }

	renderNavBarPadrao() {
    const { nome_usuario, options, usuario, email } = this.props.usuario;
		return (
			<ul className="dropdown-menu">
					{/* Painel principal: */}
				{nome_usuario ?
					<li className="user-header">
						<i className='fa fa-user-circle-o'
						style={{fontSize:60, color:"#fff"}} />
						<p>
							<b>{nome_usuario}</b>
							<br />
							{usuario ? <div>{usuario}<br /></div> : ''}
							{email ? <div>{email}<br /></div> : ''}
							{options}
						</p>
					</li>
				:null}

				{/* Rodapé do menu que aparece */}
				<li className="user-footer shadow-up-1">		
					{global.app.options && global.app.options.mudarSenha && <Button className="btn-default btn-block btn-flat"
									label="Alterar Senha"
									icon="fa-sign-out"
									onClick={this.onClickModal.bind(this)} />}
					{/* Botão de sair: */}
					<Button className="btn-default btn-block btn-flat"
									label="Sair"
									icon="fa-sign-out"
									onClick={this.props.onLogout} />
				</li>
			</ul>
		);
	}

	render() {

    const { nome_usuario } = this.props.usuario;
		return (
			<div className="navbar-custom-menu">
				<ul className="nav navbar-nav">

					<li onMouseEnter={this.openMenu.bind(this)}
							onMouseLeave={this.closeMenu.bind(this)}
							className={`dropdown user user-menu ${this.state.open ? 'open' : ''}`}>

						<a aria-expanded={this.state.open ? 'true' : 'false'}
							className="dropdown-toggle">
							<i className="fa fa-user-circle-o " />
							<span className="hidden-xs">{nome_usuario}</span>
						</a>

						{global.app.options && global.app.options.renderNavBar && global.app.options.renderNavBar()}
						{(!global.app.options || !global.app.options.renderNavBar) && this.renderNavBarPadrao()}
					</li>

				</ul>
			</div>
		);
	}

}

export default connect((state) => ({
	usuario: state.usuario,
}), (dispatch) => ({ dispatch }))(Navbar);
