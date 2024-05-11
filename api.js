import { GoogleGenerativeAI } from "@google/generative-ai";
import { gastos, limparGastos, remove, amount } from "./script.js";

const API_KEY = "COLE_AQUI_SUA_CHAVE_API";
const genAI = new GoogleGenerativeAI(API_KEY);

async function run(texto) {

    const textos = document.getElementById("textos");
    textos.classList.add('animacao');
    
const generationConfig = {
    temperature: 1
};

const model = genAI.getGenerativeModel({ model: "gemini-pro", generationConfig});

const prompt = "Faça um breve resumo sobre os seguintes gastos, levando em consideração seu número de ocorrências e valor total: " + texto + "Após isso, dê breves dicas de como reduzir os custos mais proeminentes.";
const result = await model.generateContent(prompt);
const response = await result.response;

const text = response.text();

const textodiv = document.getElementById('texto');
var regex = /\*\*(.*?)\*\*/g;
var newtext = text.replaceAll(regex, "<br><b>$1</b>");
newtext = newtext.replaceAll('*', '<br><br>');

var paragraph = document.createElement('p');
paragraph.innerHTML = newtext;
textodiv.appendChild(paragraph);


textos.classList.remove('animacao');
}

document.getElementById("new").onclick = function () {
    window.location.href = "newspend.html";
};

function imprimirGastos() {
    var gastosdiv = document.getElementById('gastos');
    gastosdiv.innerHTML = '';

    gastos.forEach((item) => {
    var paragraph = document.createElement('p');
    paragraph.innerHTML = "Nome: " + item.nome + "<br>Custo: R$" + item.custo + "<br>Tipo: " + item.tipo;
    paragraph.classList.add("cinza");
    paragraph.classList.add("teste");
    gastosdiv.appendChild(paragraph);

    var removebtn = document.createElement('button');
    removebtn.textContent = "❌";
    removebtn.onclick = function() {
        remove(item.id);
        imprimirGastos();
        imprimirTotal();
        if(gastos == 0){
            const textodiv = document.getElementById('texto');
            textodiv.innerHTML = '';
        }
        else {
            const textodiv = document.getElementById('texto');
            textodiv.innerHTML = '';
            run(JSON.stringify(gastos));
        }
    };
    paragraph.appendChild(removebtn);
});
}

function imprimirTotal(){
    var totaldiv = document.getElementById('totaltxt');
    totaldiv.innerHTML = '';
    var numtotal = gastos.length;
    var ptotal = document.createElement('p');
    ptotal.innerHTML = "Número total de gastos: " + numtotal;
    ptotal.classList.add("cinza");
    totaldiv.appendChild(ptotal);

    const tipos = ['Contas Domésticas', 'Aluguel', 'Mercado', 'Delivery', 'Transp. privado', 'Transp. Público', 'Combustível', 'Carro', 'Finanças', 'Medicamentos', 'Saúde', 'Educação', 'Entretenimento', 'Vestuário', 'Outros'];
    let valortotal = 0;
    for(var i = 0; i < tipos.length; i++){
        let tipo = tipos[i];
        let conta = amount(tipo);
        const ocorrencias = conta[0];
        const valor = conta[1];
        if (conta != 0){
            valortotal = conta[2];
            var ptotal = document.createElement('p');
            ptotal.innerHTML =  tipo + ": " + "Ocorrências: " + ocorrencias + "<br>Valor total: R$" + valor; 
            ptotal.classList.add("cinza");
            totaldiv.appendChild(ptotal);
        }
    }
    
    var ptotal = document.createElement('p');
    ptotal.innerHTML = "Total: R$" + valortotal;
    ptotal.classList.add("vermelho");
    totaldiv.appendChild(ptotal);
}

window.onload = function() {

    imprimirGastos();
    imprimirTotal()
    if(gastos.length > 0){
        run(JSON.stringify(gastos));
    }

}

document.getElementById("del").onclick = function () {
    limparGastos();
    location.reload();
};
