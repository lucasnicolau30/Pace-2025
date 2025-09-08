const pressaoInput = document.getElementById("pressao");

pressaoInput.addEventListener("input", function() {
    let valor = this.value.replace(/\D/g, ""); 

    if (valor.length > 2) {
        valor = valor.slice(0, 2) + "/" + valor.slice(2, 4); 
    }

    if (valor.length > 5) {
        valor = valor.slice(0,5); 
    }

    this.value = valor;
});

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

    let classificacao = "";
    let corIMC = "";

    if(imc < 18.5){
        classificacao = "Abaixo do peso";
        corIMC = "#00FFFF"; 
    } 
    else if(imc < 25){
        classificacao = "Eutrófico";
        corIMC = "#00ff80"; 
    } 
    else if(imc < 30){
        classificacao = "Sobrepeso";
        corIMC = "#fe8330"; 
    } 
    else if(imc < 35){
        classificacao = "Obesidade grau I";
        corIMC = "#c00000";
    } 
    else if(imc < 40){
        classificacao = "Obesidade grau II";
        corIMC = "#c00000";
    } 
    else{
        classificacao = "Obesidade grau III";
        corIMC = "#c00000";
    }

    let classTemp = "";
    let corTemp = "";

    if(temperatura < 35.5){
        classTemp = "Hipotermia";
        corTemp = "#c00000"; 
    } 
    else if(temperatura <= 36.9){
        classTemp = "Normal";
        corTemp = "#00ff80"; 
    } 
    else if(temperatura <= 37.7){
        classTemp = "Estado febril";
        corTemp = "#fe8330"; 
    } 
    else if(temperatura <= 38.9){
        classTemp = "Febre Moderada";
        corTemp = "#fe5f2f"; 
    } 
    else if(temperatura <= 39.9){
        classTemp = "Febre Alta";
        corTemp = "#c00000"; 
    } 
    else{
        classTemp = "Febre Muito Alta";
        corTemp = "#c00000";
    }

    let classPressao = "";
    let corPressao = "";
    const [sis, dia] = pressao.split("/").map(Number);

    if (!isNaN(sis) && !isNaN(dia)){
        if(sis < 90 && dia < 60){
            classPressao = "Hipotensão";
            corPressao = "#c00000"; 
        }
        else if(sis < 120 && dia < 80){
            classPressao = "Ótima";
            corPressao = "#00FFFF"; 
        }
        else if((sis >= 120 && sis <= 129) || (dia >= 80 && dia <= 84)){
            classPressao = "Normal";
            corPressao = "#00ff80"; 
        } 
        else if((sistolica >= 130 && sistolica <= 139) || (diastolica >= 85 && diastolica <= 89)){
            classPressao = "Pré-hipertensão";
            corPressao = "#fe5f2f"; 
        } 
        else if((sistolica >= 140 && sistolica <= 159) || (diastolica >= 90 && diastolica <= 99)){
            classPressao = "Hipertensão estágio 1";
            corPressao = "#c00000"; 
        }
        else if((sistolica >= 160 && sistolica <= 179) || (diastolica >= 100 && diastolica <= 109)){
            classPressao = "Hipertensão estágio 2";
            corPressao = "#c00000"; 
        }
        else if((sistolica >= 180 || diastolica >= 110)){
            classPressao = "Hipertensão estágio 3";
            corPressao = "#c00000"; 
        }
    } 
    else{
        classPressao = "Valor inválido";
        corPressao = "#dc3545";
    }

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
}