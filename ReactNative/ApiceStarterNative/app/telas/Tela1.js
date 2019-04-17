import React, { Component } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Actions } from 'react-native-router-flux';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({ name: 'teste.db', location: '~teste.db' });

export default class TelaMenu extends Component {

  state = {
    nome: '',
  }
  
  componentDidMount() {
    this.getNome();
  }

  async getNome() {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM tabNome', [],
      (tx, results) => {
        const len = results.rows.length;
        const ultimoNome = results.rows.item(len - 1).nome;
        this.setState({ nome: ultimoNome });
      });
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Você está na Tela 1!!</Text>
        <Text style={styles.text}>Olá,</Text>
        <Text style={styles.text}>{this.state.nome}</Text>
        <TouchableOpacity style={styles.botao}
                          onPress={() => Actions.tela2()}>
          <Text style={styles.txtBotao}>Ir para Tela 2</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 30,
    color: '#455da1',
    textAlign: 'center',
  },
  text: {
    fontSize: 25,
    padding: 5,
  },
  botao: {
    backgroundColor: '#7087c2',
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
  },
  txtBotao: {
    fontSize: 25,
    color: '#fff',
  },
});
