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

if (!firebase.apps.length) {

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

console.log("KmPorLitro:", KmPorLitro);
console.log("precoGasolina:", precoGasolina);

function calcularFrete() {
    var pontoPartida = document.getElementById("pontoPartida").value;
    var pontoDestino = document.getElementById("pontoDestino").value;
    var pesoCarga = parseFloat(document.getElementById("pesoCarga").value);

    if (pontoPartida === "" || pontoDestino === "" || isNaN(pesoCarga)) {
        alert('Por favor, preencha os pontos de partida, destino e peso da carga corretamente.');
        return;
    }

    var database = firebase.database();
    var configRef = database.ref('configuracoes');

    configRef.once('value')
        .then(function(snapshot) {
            if (snapshot && snapshot.exists()) {
                var configuracoes = snapshot.val();
                var kmPorLitro = parseFloat(configuracoes.KmPorLitro);
                var precoGasolina = parseFloat(configuracoes.PrecoGasolina);

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
                            

                            /// multiplicando sem os 30+ de peso

                                // if (status === 'OK') {
                                //     // Distância de ida e volta
                                //     var distanciaKmIdaVolta = 2 * (response.rows[0].elements[0].distance.value / 1000);
        
                                //     // Calcula o custo do frete sem adicionar os R$30 por peso
                                //     var custoFrete = (distanciaKmIdaVolta / kmPorLitro) * precoGasolina * 3.2;
        
                                //     // Adiciona R$30 se houver mais de 450 kg de peso
                                //     if (pesoCarga >0 && pesoCarga > 449) {
                                //         custoFrete += 30;
                                //     }
        
                                //     // Atualize o valorFrete com a distância de ida para exibição
                                //     var valorFreteTexto = `Distância: ${distanciaKmIdaVolta.toFixed(2)} km | Valor do Frete: R$ ${custoFrete.toFixed(2)}`;
                                //     document.getElementById("valorFrete").value = valorFreteTexto;






                            // calculo com os 30 do peso sendo multiplicado

                            if (status === 'OK') {
                                // Distância de ida e volta
                                var distanciaKmIdaVolta = 2 * (response.rows[0].elements[0].distance.value / 1000);

                                // Adiciona R$30 se houver mais de 450 kg de peso
                                var custoFrete = (distanciaKmIdaVolta / kmPorLitro) * precoGasolina;
                                if (pesoCarga > 0 && pesoCarga > 449) {
                                    custoFrete += 30;
                                }

                                // Multiplica o custo do frete por 3.2
                                custoFrete *= 3.2;

                                // Atualize o valorFrete com a distância de ida para exibição
                                var valorFreteTexto = `Valor do Frete: R$ ${custoFrete.toFixed(2)}`;
                                document.getElementById("valorFrete").value = valorFreteTexto;


                            } else {
                                alert('Erro: kmPorLitro é zero.');
                            }

                        } else {
                            alert('Erro ao calcular a distância: ' + status);
                        }
                    }
                );
            } else {
                alert('Dados de configuração não encontrados no Firebase.');
            }
        })
        .catch(function (error) {
            console.error('Erro ao recuperar dados do Firebase: ', error);
        });
}









// Adicione um ouvinte de evento para o botão de calcular
document.getElementById('calcularBotao').addEventListener('click', function() {
    calcularFrete();
});

// Adicione um ouvinte de evento para o botão de enviar via WhatsApp
document.getElementById('enviarWhatsappBotao').addEventListener('click', function() {
    var valorFreteTexto = document.getElementById("valorFrete").value;

    // Chame a função para enviar a mensagem via WhatsApp
    enviarMensagemWhatsappAPI(valorFreteTexto);
});

console.log("distanciaKm:", distanciaKm);

function atualizarValores() {
    var kmporlitro = document.getElementById("kmporlitro").value;
    var precoGasolina = document.getElementById("precoGasolina").value;

    var database = firebase.database();
    var configRef = database.ref('configuracoes');

    configRef.update({
        KmPorLitro: parseFloat(kmporlitro),
        PrecoGasolina: parseFloat(precoGasolina)
    })
    .then(function() {
        alert('Valores atualizados com sucesso!');
    })
    .catch(function(error) {
        console.error('Erro ao atualizar valores: ', error);
    });
}

var configuracoesRef = firebase.database().ref('configuracoes');

console.log(snapshot.val());





function enviarMensagemWhatsappAPI(nomeDestinatario, pesoCarga) {
    // Substitua 'PHONE_NUMBER' pelo número do destinatário no formato internacional (exemplo: +551234567890)
    const numeroDestinatario = '+5531996741550';

    // Mensagens alegres e informativas
    const mensagem1 = `Olá o valor do frete foi de: ${nomeDestinatario}! 😊\n` ;
    const mensagem2 = `O peso da carga foi de: ${pesoCarga} kg.\n`;
    const mensagem3 = `Espero que tenha gostado nos nossos serviços. 👑\n`;
    const mensagem4 = `Lembre-se: você é incrível e capaz de coisas maravilhosas. 💪\n`;

    // Concatena as mensagens em uma única string
    const textoMensagem = encodeURIComponent(`${mensagem1}\n${mensagem2}\n${mensagem3}${mensagem4}\n`);

    // Crie o link de envio para o WhatsApp
    const linkWhatsapp = `https://wa.me/${numeroDestinatario}?text=${textoMensagem}`;

    // Abra o link em uma nova aba
    window.open(linkWhatsapp, '_blank');
}

function enviarWhatsapp() {
    var valorFreteTexto = document.getElementById("valorFrete").value;
    var pesoCargaInput = document.getElementById("pesoCarga");

    // Verifica se o elemento com o ID "pesoCarga" foi encontrado
    if (pesoCargaInput) {
        var pesoCarga = parseFloat(pesoCargaInput.value);

        // Verifica se o valor é um número válido
        if (!isNaN(pesoCarga) && pesoCarga > 0) {
            // Chame a função para enviar a mensagem via WhatsApp
            enviarMensagemWhatsappAPI(valorFreteTexto, pesoCarga);
        } else {
            alert('Por favor, preencha o peso da carga corretamente.');
        }
    } else {
        alert('Elemento HTML com o ID "pesoCarga" não encontrado.');
    }
}

// Exemplo de uso
document.getElementById('enviarWhatsappBotao').addEventListener('click', function() {
    enviarWhatsapp();
});


        
// Exemplo de uso
enviarMensagemWhatsappAPI('João');
        