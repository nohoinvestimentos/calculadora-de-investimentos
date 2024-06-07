document.getElementById('investment-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Função para remover formatação e converter para número
    function parseCurrency(value) {
        return parseFloat(value.replace(/[^0-9,-]+/g, '').replace(',', '.'));
    }

    // Função para remover formatação e converter para número percentual
    function parsePercentage(value) {
        return parseFloat(value.replace(/[^0-9,-]+/g, '').replace(',', '.')) / 100;
    }

    let investimentoInicial = parseCurrency(document.getElementById('initial-investment').value);
    let aporteMensal = parseCurrency(document.getElementById('monthly-contribution').value);
    let meses = parseInt(document.getElementById('months').value);
    let otherRate = parsePercentage(document.getElementById('other-rate').value);

    let resultadoNoho = calcularInvestimento(investimentoInicial, aporteMensal, meses, 0.0153);
    let resultadoOther = calcularInvestimento(investimentoInicial, aporteMensal, meses, otherRate);

    document.getElementById('result').innerHTML = `
        <p>Investindo com a NOHO: R$ ${resultadoNoho.toFixed(2).replace('.', ',')}</p>
        <p>Investindo com a outra opção de rendimento: R$ ${resultadoOther.toFixed(2).replace('.', ',')}</p>
    `;
});

function calcularInvestimento(investimentoInicial, aporteMensal, meses, taxaMensal) {
    let montante = investimentoInicial;
    for (let i = 0; i < meses; i++) {
        montante = montante * (1 + taxaMensal) + aporteMensal;
    }
    return montante;
}

// Função para formatar valores monetários enquanto o usuário digita
function formatCurrency(input) {
    let value = input.value.replace(/\D/g, '');
    value = (value / 100).toFixed(2).replace('.', ',');
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    input.value = 'R$ ' + value;
}

// Função para formatar valores percentuais enquanto o usuário digita
function formatPercentage(input) {
    let value = input.value.replace(/\D/g, '');
    value = (value / 10).toFixed(1).replace('.', ',');
    input.value = value + '%';
}

document.getElementById('initial-investment').addEventListener('input', function() {
    formatCurrency(this);
});

document.getElementById('monthly-contribution').addEventListener('input', function() {
    formatCurrency(this);
});

document.getElementById('other-rate').addEventListener('input', function() {
    formatPercentage(this);
});
