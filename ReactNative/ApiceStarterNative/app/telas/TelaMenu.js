import React, { Component } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, TextInput, Dimensions } from 'react-native';
import { Actions } from 'react-native-router-flux';
import SQLite from 'react-native-sqlite-storage';

const screenWidth = Dimensions.get('window').width;
const db = SQLite.openDatabase({ name: 'teste.db', location: '~teste.db '});

export default class TelaMenu extends Component {
  state={
    nome: '',
  }

  componentDidMount() {
    this.criarTabela();
  }

  async salvarNome() {
    console.log('salvando nome');
    const { nome } = this.state;
    await db.transaction(tx => {
      tx.executeSql('INSERT INTO tabNome(nome) VALUES (?)', [nome]);
    });
  }

  async criarTabela() {
    console.log('criando tabela');
    await db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS tabNome(' +
                    'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                    'nome VARCHAR(100))');
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Você está na Tela Menu!!</Text>
        <Text style={styles.text}>Digite seu nome:</Text>
        <TextInput onChangeText={(text) => this.setState({ nome: text })}
                   style={styles.textInput} />
        <TouchableOpacity style={styles.botao}
                          onPress={async() => {
                            await this.salvarNome();
                            await Actions.tela1();
                            }}>
          <Text style={styles.txtBotao}>Ir para Tela 1</Text>
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
  textInput: {
    fontSize: 25,
    textAlign: 'center',
    padding: 5,
    margin: 5,
    borderWidth: 1,
    borderColor: '#b3b3b3',
    width: screenWidth - 20,
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
