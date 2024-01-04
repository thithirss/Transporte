const firebaseConfig = {
    apiKey: "AIzaSyDHsU4Srk41dX1SZlZDN6dDxcUT64oMdpo",
    authDomain: "teste-410118.firebaseapp.com",
    databaseURL: "https://teste-410118-default-rtdb.firebaseio.com",
    projectId: "teste-410118",
    storageBucket: "teste-410118.appspot.com",
    messagingSenderId: "614628768652",
    appId: "1:614628768652:web:c80d9a111a20aaf07d74a9",
    measurementId: "G-Q7X7Y9Q30S"
  };
  

  var configuracoesRef = firebase.database().ref('configuracoes');
  
  function carregarConfiguracoes() {


      configuracoesRef.once('value')
          .then(function(snapshot) {
              var configuracoes = snapshot.val();
  
              if (configuracoes) {

                  document.getElementById('kmporlitro').value = configuracoes.kmporlitro;
                  document.getElementById('precoGasolina').value = configuracoes.precoGasolina;
              } else {
                  alert('Configurações não encontradas no Firebase.');
              }
          })
          .catch(function(error) {
              alert('Erro ao carregar configurações: ' + error.message);
          });
  }
  

  document.addEventListener('DOMContentLoaded', carregarConfiguracoes);
  