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


function calcularFrete() {

    var pontoPartida = document.getElementById("pontoPartida").value;
    var pontoDestino = document.getElementById("pontoDestino").value;

    if (pontoPartida === "" || pontoDestino === "") {
        alert('Por favor, preencha os pontos de partida e destino.');
        return;
    }

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

                var kmPorLitro = 10;
                var precoGasolina = 5.89;

                var custoFrete = (distanciaKm / kmPorLitro) * precoGasolina;


                document.getElementById("valorFrete").value = `Distância: ${distanciaKm.toFixed(2)} km | Valor do Frete: ${custoFrete.toFixed(2)}`;
            } else {
                alert('Erro ao calcular a distância: ' + status);
            }
        }
    );
}

function carregarConfiguracoes() {

    var kmPorLitro = document.getElementById('kmporlitro').value;
    var precoGasolina = document.getElementById('precoGasolina').value;

    document.getElementById('kmPorLitroPrincipal').value = kmPorLitro;
    document.getElementById('precoGasolinaPrincipal').value = precoGasolina;
}