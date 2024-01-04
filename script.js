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

function calcularFrete() {
    // Obtendo os valores do ponto de partida e destino
    var pontoPartida = document.getElementById("pontoPartida").value;
    var pontoDestino = document.getElementById("pontoDestino").value;

    // Verificando se os pontos de partida e destino foram preenchidos
    if (pontoPartida === "" || pontoDestino === "") {
        alert('Por favor, preencha os pontos de partida e destino.');
        return;
    }

    // Chamando a API do Google Maps para obter a distância
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
                // Obtendo a distância real entre os pontos
                var distanciaKm = response.rows[0].elements[0].distance.value / 1000; // Convertendo de metros para quilômetros

                // Valores de referência
                var kmPorLitro = 10;
                var precoGasolina = 5.89;

                // Calculando o custo do frete
                var custoFrete = (distanciaKm / kmPorLitro) * precoGasolina;

                // Exibindo a distância e o valor do frete nos campos de input
                document.getElementById("valorFrete").value = `Distância: ${distanciaKm.toFixed(2)} km | Valor do Frete: ${custoFrete.toFixed(2)}`;
            } else {
                alert('Erro ao calcular a distância: ' + status);
            }
        }
    );
}

