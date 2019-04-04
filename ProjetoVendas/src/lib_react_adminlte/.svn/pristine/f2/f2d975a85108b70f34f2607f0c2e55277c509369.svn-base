import React from 'react';
import Navbar from './Navbar';

export default (props) => (
	<header className='main-header'>

		<a href={props.rota} className='logo'>
			{/* O Logo pequeno: */}
			<span className='logo-mini'>
				{props.tituloPequeno}
			</span>

			{/* O Logo grande com ícone: */}
			<span className='logo-lg'>
				{props.icon && <i className={'fa rxzz ' + props.icon} />}
				<span style={{ marginLeft: '5px' }} />
				{props.tituloGrande}
			</span>
		</a>

		{/* A Barra: */}

		<nav className='navbar navbar-static-top'>
		{props.escondeSidebar?null:
			<a className='sidebar-toggle' data-toggle='offcanvas' />}
		{props.escondeUser?null:

	  			<Navbar options={props.options}

					    onLogout={props.onLogout} />
    }

    {global.exibiFantasia ?
    <div className="titulo-nome-fatansia" style={{ color: 'white',  textAlign: 'left', marginTop: '-7px' }}>
        <h3>{props.nomeFantasia}</h3>
    </div> : null }

		</nav>
	</header>
);
