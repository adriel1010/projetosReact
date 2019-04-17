import React, { Component } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Actions } from 'react-native-router-flux';

export default class TelaMenu extends Component {
  
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Você está na Tela 2!!</Text>
        <TouchableOpacity style={styles.botao}
                          onPress={() => Actions.telamenu()} >
          <Text style={styles.txtBotao}>Voltar para Tela Menu</Text>
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
    margin: 10,
  },
  txtBotao: {
    fontSize: 25,
    color: '#fff',
  },
});
