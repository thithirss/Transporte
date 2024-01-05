function inicializarAutocomplete() {
    var pontoPartidaInput = document.getElementById('pontoPartida');
    var pontoDestinoInput = document.getElementById('pontoDestino');

    if (pontoPartidaInput && pontoDestinoInput) {
        var pontoPartidaAutocomplete = new google.maps.places.Autocomplete(pontoPartidaInput);
        var pontoDestinoAutocomplete = new google.maps.places.Autocomplete(pontoDestinoInput);
    }
}

function calcularDistancia() {
    var pontoPartidaInput = document.getElementById('pontoPartida');
    var pontoDestinoInput = document.getElementById('pontoDestino');

    if (pontoPartidaInput && pontoDestinoInput) {
        var pontoPartida = pontoPartidaInput.value;
        var pontoDestino = pontoDestinoInput.value;

        if (pontoPartida !== "" && pontoDestino !== "") {
            var service = new google.maps.DistanceMatrixService();
            service.getDistanceMatrix(
                {
                    origins: [pontoPartida],
                    destinations: [pontoDestino],
                    travelMode: 'DRIVING',
                    unitSystem: google.maps.UnitSystem.METRIC,
                },
                function (response, status) {
                    if (status === 'OK') {
                        var distancia = response.rows[0].elements[0].distance.text;
                        document.getElementById('distancia').value = distancia;
                    } else {
                        alert('Erro ao calcular a distância: ' + status);
                    }
                }
            );
        } else {
            alert('Por favor, preencha os pontos de partida e destino.');
        }
    }
}


function atualizarValores() {
    var kmporlitro = document.getElementById("kmporlitro").value;
    var precoGasolina = document.getElementById("precoGasolina").value;


    window.opener.atualizarValoresConfiguracao(kmporlitro, precoGasolina);

    alert('Valores atualizados com sucesso!');
}


// function calcularFrete() {

//     var pontoPartida = document.getElementById("pontoPartida").value;
//     var pontoDestino = document.getElementById("pontoDestino").value;

//     if (pontoPartida === "" || pontoDestino === "") {
//         alert('Por favor, preencha os pontos de partida e destino.');
//         return;
//     }

//     var service = new google.maps.DistanceMatrixService();
//     service.getDistanceMatrix(
//         {
//             origins: [pontoPartida],
//             destinations: [pontoDestino],
//             travelMode: 'DRIVING',
//             unitSystem: google.maps.UnitSystem.METRIC,
//         },
//         function (response, status) {
//             if (status === 'OK') {

//                 var distanciaKm = response.rows[0].elements[0].distance.value / 1000;

//                 var kmPorLitro = 10;
//                 var precoGasolina = 5.89;

//                 var custoFrete = (distanciaKm / kmPorLitro) * precoGasolina;


//                 document.getElementById("valorFrete").value = `Distância: ${distanciaKm.toFixed(2)} km | Valor do Frete: ${custoFrete.toFixed(2)}`;
//             } else {
//                 alert('Erro ao calcular a distância: ' + status);
//             }
//         }
//     );
// }


// Verifique se o aplicativo Firebase já foi inicializado
if (!firebase.apps.length) {
    // Se não foi inicializado, inicialize o Firebase com sua configuração
    var firebaseConfig = { 
        apiKey: "AIzaSyDHsU4Srk41dX1SZlZDN6dDxcUT64oMdpo",
        authDomain: "teste-410118.firebaseapp.com",
        databaseURL: "https://teste-410118-default-rtdb.firebaseio.com",
        projectId: "teste-410118",
        storageBucket: "teste-410118.appspot.com",
        messagingSenderId: "614628768652",
        appId: "1:614628768652:web:c80d9a111a20aaf07d74a9",
        measurementId: "G-Q7X7Y9Q30S"

};

    firebase.initializeApp(firebaseConfig);
}

function calcularFrete() {
    var pontoPartida = document.getElementById("pontoPartida").value;
    var pontoDestino = document.getElementById("pontoDestino").value;

    if (pontoPartida === "" || pontoDestino === "") {
        alert('Por favor, preencha os pontos de partida e destino.');
        return;
    }

    // Recupere os valores do banco de dados Firebase
    var database = firebase.database();
    var configRef = database.ref('configuracoes');

    configRef.once('value')
        .then(function(snapshot) {
            // Verifique se o snapshot não é nulo ou indefinido
            if (snapshot && snapshot.exists()) {
                var configuracoes = snapshot.val();
                var kmPorLitro = configuracoes.KmPorLitro;
                var precoGasolina = configuracoes.PrecoGasolina;

                var service = new google.maps.DistanceMatrixService();
                service.getDistanceMatrix(
                    {
                        origins: [pontoPartida],
                        destinations: [pontoDestino],
                        travelMode: 'DRIVING',
                        unitSystem: google.maps.UnitSystem.METRIC,
                    },
                    function (response, status) {
                        if (status === 'OK') {
                            var distanciaKm = response.rows[0].elements[0].distance.value / 1000;
                            var custoFrete = (distanciaKm / kmPorLitro) * precoGasolina;

                            document.getElementById("valorFrete").value = `Distância: ${distanciaKm.toFixed(2)} km | Valor do Frete: ${custoFrete.toFixed(2)}`;
                        } else {
                            alert('Erro ao calcular a distância: ' + status);
                        }
                    }
                );
            } else {
                alert('Dados de configuração não encontrados no Firebase.');
            }
        })
        .catch(function(error) {
            console.error('Erro ao recuperar dados do Firebase: ', error);
        });
}
