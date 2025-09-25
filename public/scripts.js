const pressaoInput = document.getElementById("pressao");

pressaoInput.addEventListener("input", function () {
    let digits = this.value.replace(/\D/g, "").slice(0, 6);
    let formatted = "";

    if(digits.length <= 2){
        formatted = digits;
    } 
    else if(digits.length === 3){
        formatted = digits;
    }
    else if(digits.length === 4){
        formatted = digits.slice(0, 2) + "/" + digits.slice(2);
    } 
    else if(digits.length === 5){
        if (Number(digits.slice(0, 3)) >= 100){
            formatted = digits.slice(0, 3) + "/" + digits.slice(3);
        } 
        else{
            formatted = digits.slice(0, 2) + "/" + digits.slice(2);
        }
    } 
    else{
        formatted = digits.slice(0, 3) + "/" + digits.slice(3);
    }

    this.value = formatted;
});

// Função auxiliar: cria ou atualiza inputs hidden no form
function setHidden(form, name, value) {
    let input = form.querySelector(`input[name="${name}"]`);
    if (!input) {
        input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        form.appendChild(input);
    }
    input.value = value;
}

function calcularDados() {
    const nome = document.getElementById("nome").value.trim();
    const idade = document.getElementById("idade").value.trim();
    const sexo = document.getElementById("sexo").value;
    const peso = parseFloat(document.getElementById("peso").value);
    const alturaCm = parseFloat(document.getElementById("altura").value);
    const pressao = document.getElementById("pressao").value.trim();
    const temperatura = parseFloat(document.getElementById("temperatura").value);
    const atendente = document.getElementById("atendente").value.trim();
    const data_atendimento = document.getElementById("data_atendimento").value;

    if (!nome || !idade || !sexo || isNaN(peso) || isNaN(alturaCm) || !pressao || isNaN(temperatura) || !atendente || !data_atendimento) {
        document.getElementById("resultado").innerText = "⚠️ Preencha todos os campos antes de gerar o resumo.";
        return;
    }

    const alturaM = alturaCm / 100;
    const imc = peso / (alturaM * alturaM);

    let classificacao = "";
    let corIMC = "";
    if (imc < 18.5){ 
        classificacao = "Abaixo do peso"; 
        corIMC = "#03c4ff"; 
    }
    else if(imc < 25){ 
        classificacao = "Eutrófico"; 
        corIMC = "#32a848"; 
    }
    else if(imc < 30){ 
        classificacao = "Sobrepeso"; 
        corIMC = "#f5931b";
    }
    else if(imc < 35){ 
        classificacao = "Obesidade grau I"; 
        corIMC = "#ff2003";
    }
    else if(imc < 40){ 
        classificacao = "Obesidade grau II"; 
        corIMC = "#ff2003";
    }
    else{ 
        classificacao = "Obesidade grau III"; 
        corIMC = "#ff2003"; 
    }

    let classTemp = "";
    let corTemp = "";
    if(temperatura < 35.5){ 
        classTemp = "Hipotermia"; 
        corTemp = "#03c4ff"; 
    }
    else if(temperatura <= 36.9){ 
        classTemp = "Normal"; 
        corTemp = "#32a848"; 
    }
    else if(temperatura <= 37.7){ 
        classTemp = "Estado febril"; 
        corTemp = "#f5931b"; 
    }
    else if(temperatura <= 38.9){ 
        classTemp = "Febre Moderada"; 
        corTemp = "#ff2003"; 
    }
    else if(temperatura <= 39.9){ 
        classTemp = "Febre Alta"; 
        corTemp = "#ff2003"; 
    }
    else{
        classTemp = "Febre Muito Alta"; 
        corTemp = "#ff2003"; 
    }

    let classPressao = "";
    let corPressao = "";
    const [sis, dia] = pressao.split("/").map(Number);

    if(!isNaN(sis) && !isNaN(dia)){
        if (sis < 120){ 
            classPressao = "Normal"; 
            corPressao = "#32a848"; 
        }
        else if(sis >= 120 && sis <= 139){ 
            classPressao = "Pré-hipertensão"; 
            corPressao = "#f5931b"; 
        }
        else if(sis >= 140 && sis <= 159){ 
            classPressao = "Hipertensão estágio I"; 
            corPressao = "#ff2003"; 
        }
        else if(sis >= 160 && sis <= 179){ 
            classPressao = "Hipertensão estágio II"; 
            corPressao = "#ff2003"; 
        }
        else if(sis >= 180){ 
            classPressao = "Hipertensão estágio III"; 
            corPressao = "#ff2003"; 
        }
    } 
    else{
        classPressao = "Valor inválido";
        corPressao = "#ff2003";
    }

document.getElementById("resultado").innerHTML = `
    <fieldset>
        <legend>Resumo dos Dados</legend>
        <p><strong>Paciente:</strong> ${nome} (${idade} anos, ${sexo})</p>
        <p><strong>Atendente:</strong> ${atendente} em ${data_atendimento}</p>
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
    </fieldset>
`;

    // Enviar para o backend junto com o form
    const form = document.querySelector("form");
    setHidden(form, "imc", imc.toFixed(2));
    setHidden(form, "classificacao", classificacao);
    setHidden(form, "classPressao", classPressao);
    setHidden(form, "classTemp", classTemp);
    setHidden(form, "atendente_nome", atendente);
    setHidden(form, "data_atendimento", data_atendimento);
}