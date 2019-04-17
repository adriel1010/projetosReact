import React, { Component } from 'react';
import { Text, View, Button } from 'react-native';


export default class TelaPrincipal extends Component {

    constructor(props){
        super(props);
        this.state = { escolhaUsuario: '', escolhaComputador: '', resultado: '' }

    }

    jokenpo(escolhaUsuario) {

        const numero = Math.floor(Math.random() * 3);

        let escolhaComputador = ''; 
        switch(numero) {
            case 0: escolhaComputador = 'Pedra'; break;
            case 1: escolhaComputador = 'Papel'; break;
            case 2: escolhaComputador = 'Tesoura'; break;
        } 


        let resultado = '';

        if (escolhaComputador == 'Pedra') {
            if (escolhaUsuario == 'Pedra') {
                resultado = 'Empate';
            }

            if (escolhaUsuario == 'Papel') {
                resultado = 'Usuario Ganhou';
            }

            if (escolhaUsuario == 'Tesoura') {
                resultado = 'Computador Ganhou';
            }
           
        }

        
        if (escolhaComputador == 'Papel') {
            if (escolhaUsuario == 'Papel') {
                resultado = 'Empate';
            }

            if (escolhaUsuario == 'Tesoura') {
                resultado = 'Usuario Ganhou';
            }

            if (escolhaUsuario == 'Pedra') {
                resultado = 'Computador Ganhou';
            }
           
        }

        if (escolhaComputador == 'Tesoura') {
            if (escolhaUsuario == 'Tesoura') {
                resultado = 'Empate';
            }

            if (escolhaUsuario == 'Pedra') {
                resultado = 'Usuario Ganhou';
            }

            if (escolhaUsuario == 'Papel') {
                resultado = 'Computador Ganhou';
            }
           
        }

        this.setState({ escolhaUsuario, escolhaComputador, resultado  });
        
    }

    render() {
        const { principal, topo, conteudo, rodape } = Estilo;
        return (
            <View style={ principal } > 

            <View></View>
                <Text> Escolha do Computador {this.state.escolhaComputador}</Text>

                <Text> Escolha do Usuário {this.state.escolhaUsuario}</Text>

                <Text> Resultado {this.state.resultado} </Text>
                <Button title="Pedra" onPress={ () => {
                    this.jokenpo('Pedra')
                }}/>
                <Button title="Papel" onPress={ () => {
                    this.jokenpo('Papel')
                }}/>
                <Button title="Tesoura" onPress={ () => {
                    this.jokenpo('Tesoura')
                }}/>
            </View>
        ); 
    }

}

const Estilo = {
    principal: {  
        flex: 1, 
    },
    topo: {
        flex: 2,
        backgroundColor: 'red',
        height: 300, 
    },
    conteudo: {
        flex: 8,
        backgroundColor: 'blue',
        height: 300, 
    },
    rodape: {
        flex: 1,
        backgroundColor: 'yellow',
        height: 300, 
    }
};