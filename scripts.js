// ----- Formatação automática da pressão arterial -----
const pressaoInput = document.getElementById("pressao");

pressaoInput.addEventListener("input", function () {
    let digits = this.value.replace(/\D/g, "").slice(0, 6);
    let formatted = "";

    if (digits.length <= 2) {
        formatted = digits;
    } else if (digits.length === 3) {
        formatted = digits;
    } else if (digits.length === 4) {
        formatted = digits.slice(0, 2) + "/" + digits.slice(2);
    } else if (digits.length === 5) {
        if (Number(digits.slice(0, 3)) >= 100) {
            formatted = digits.slice(0, 3) + "/" + digits.slice(3);
        } else {
            formatted = digits.slice(0, 2) + "/" + digits.slice(2);
        }
    } else { // 6 dígitos
        formatted = digits.slice(0, 3) + "/" + digits.slice(3);
    }

    this.value = formatted;
});

// ----- Função principal -----
function calcularIMC() {
    const nome = document.getElementById("nome").value.trim();
    const idade = document.getElementById("idade").value.trim();
    const sexo = document.getElementById("sexo").value;
    const peso = parseFloat(document.getElementById("peso").value);   
    const alturaCm = parseFloat(document.getElementById("altura").value); 
    const pressao = document.getElementById("pressao").value.trim();
    const temperatura = parseFloat(document.getElementById("temperatura").value);

    if (!nome || !idade || !sexo || isNaN(peso) || isNaN(alturaCm) || !pressao || isNaN(temperatura)) {
        document.getElementById("resultado").innerText = "⚠️ Preencha todos os campos antes de submeter.";
        return;
    }

    const alturaM = alturaCm / 100;
    const imc = peso / (alturaM * alturaM);

    // ----- IMC -----
    let classificacao = "";
    let corIMC = "";

    if(imc < 18.5){ classificacao = "Abaixo do peso"; corIMC = "#00FFFF"; } 
    else if(imc < 25){ classificacao = "Eutrófico"; corIMC = "#00ff80"; } 
    else if(imc < 30){ classificacao = "Sobrepeso"; corIMC = "#fe8330"; } 
    else if(imc < 35){ classificacao = "Obesidade grau I"; corIMC = "#c00000"; } 
    else if(imc < 40){ classificacao = "Obesidade grau II"; corIMC = "#c00000"; } 
    else{ classificacao = "Obesidade grau III"; corIMC = "#c00000"; }

    // ----- Temperatura -----
    let classTemp = "";
    let corTemp = "";

    if(temperatura < 35.5){ classTemp = "Hipotermia"; corTemp = "#00FFFF"; } 
    else if(temperatura <= 36.9){ classTemp = "Normal"; corTemp = "#00ff80"; } 
    else if(temperatura <= 37.7){ classTemp = "Estado febril"; corTemp = "#fe8330"; } 
    else if(temperatura <= 38.9){ classTemp = "Febre Moderada"; corTemp = "#c00000"; } 
    else if(temperatura <= 39.9){ classTemp = "Febre Alta"; corTemp = "#c00000"; } 
    else{ classTemp = "Febre Muito Alta"; corTemp = "#c00000"; }

    // ----- Pressão Arterial -----
    let classPressao = "";
    let corPressao = "";
    const [sis, dia] = pressao.split("/").map(Number);

    if (!isNaN(sis) && !isNaN(dia)){
        if(sis <= 90 && dia <= 60){ classPressao = "Hipotensão"; corPressao = "#00FFFF"; }
        else if(sis < 120 && dia < 80){ classPressao = "Ótima"; corPressao = "#0096FF"; }
        else if((sis >= 120 && sis <= 129) || (dia >= 80 && dia <= 84)){ classPressao = "Normal"; corPressao = "#00ff80"; }
        else if((sis >= 130 && sis <= 139) || (dia >= 85 && dia <= 89)){ classPressao = "Pré-hipertensão"; corPressao = "#fe8330"; }
        else if((sis >= 140 && sis <= 159) || (dia >= 90 && dia <= 99)){ classPressao = "Hipertensão estágio I"; corPressao = "#c00000"; }
        else if((sis >= 160 && sis <= 179) || (dia >= 100 && dia <= 109)){ classPressao = "Hipertensão estágio II"; corPressao = "#c00000"; }
        else if((sis >= 180 || dia >= 110)){ classPressao = "Hipertensão estágio III"; corPressao = "#c00000"; }
    } else {
        classPressao = "Valor inválido";
        corPressao = "#dc3545";
    }

    // ----- Exibir resumo na tela -----
    document.getElementById("resultado").innerHTML = `
        <h4>Resumo dos Dados</h4>
        <table style="width:100%; border-collapse:collapse; text-align:center;">
            <tr>
                <th style="border:1px solid #ccc; padding:8px;">Parâmetro</th>
                <th style="border:1px solid #ccc; padding:8px;">Valor</th>
                <th style="border:1px solid #ccc; padding:8px;">Classificação</th>
            </tr>
            <tr>
                <td style="border:1px solid #ccc; padding:8px;">IMC</td>
                <td style="border:1px solid #ccc; padding:8px;">${imc.toFixed(2)}</td>
                <td style="border:1px solid #ccc; padding:8px; color:${corIMC};">${classificacao}</td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc; padding:8px;">Pressão</td>
                <td style="border:1px solid #ccc; padding:8px;">${pressao}</td>
                <td style="border:1px solid #ccc; padding:8px; color:${corPressao};">${classPressao}</td>
            </tr>
            <tr>
                <td style="border:1px solid #ccc; padding:8px;">Temperatura</td>
                <td style="border:1px solid #ccc; padding:8px;">${temperatura} °C</td>
                <td style="border:1px solid #ccc; padding:8px; color:${corTemp};">${classTemp}</td>
            </tr>
        </table>
    `;

    // ----- Enviar para WhatsApp -----
    let mensagem = `📋 *Resumo do Paciente*\n\n` +
                   `👤 Nome: ${nome}\n` +
                   `🎂 Idade: ${idade}\n` +
                   `⚧ Sexo: ${sexo}\n` +
                   `⚖️ Peso: ${peso} kg\n` +
                   `📏 Altura: ${alturaCm} cm\n\n` +
                   `🧮 IMC: ${imc.toFixed(2)} (${classificacao})\n` +
                   `💓 Pressão: ${pressao} (${classPressao})\n` +
                   `🌡️ Temperatura: ${temperatura} °C (${classTemp})`;

    // teu número fixo: +55 (92) 98278-1030
    let numero = "5592982781030";  
    let url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;

    window.open(url, "_blank");
}
