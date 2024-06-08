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

    // Validações adicionais
    if (investimentoInicial <= 0) {
        alert('O investimento inicial deve ser maior que zero.');
        return;
    }
    if (aporteMensal < 0) {
        alert('O aporte mensal deve ser zero ou maior.');
        return;
    }
    if (meses <= 0) {
        alert('O tempo de investimento deve ser maior que zero.');
        return;
    }
    if (otherRate <= 0) {
        alert('A taxa de rendimento deve ser maior que zero.');
        return;
    }

    // Função para calcular o investimento
    function calcularInvestimento(investimentoInicial, aporteMensal, meses, taxaMensal) {
        let montante = investimentoInicial;
        for (let i = 0; i < meses; i++) {
            montante = montante * (1 + taxaMensal) + aporteMensal;
        }
        return montante;
    }

    let resultadoNoho = calcularInvestimento(investimentoInicial, aporteMensal, meses, 0.0153);
    let resultadoOther = calcularInvestimento(investimentoInicial, aporteMensal, meses, otherRate);

    document.getElementById('result').innerHTML = `
        <p>Investindo com a NOHO: R$ ${resultadoNoho.toFixed(2).replace('.', ',')}</p>
        <p>Investindo com a outra opção de rendimento: R$ ${resultadoOther.toFixed(2).replace('.', ',')}</p>
    `;

    // Função para gerar dados para o gráfico
    function gerarDados(investimentoInicial, aporteMensal, meses, taxaMensal) {
        let dados = [];
        let montante = investimentoInicial;
        for (let i = 0; i <= meses; i++) {
            dados.push(montante);
            montante = montante * (1 + taxaMensal) + aporteMensal;
        }
        return dados;
    }

    let dadosNoho = gerarDados(investimentoInicial, aporteMensal, meses, 0.0153);
    let dadosOther = gerarDados(investimentoInicial, aporteMensal, meses, otherRate);

    // Criar o gráfico
    let ctx = document.getElementById('investmentChart').getContext('2d');
    if (window.myChart) {
        window.myChart.destroy();
    }
    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({ length: meses + 1 }, (_, i) => i),
            datasets: [
                {
                    label: 'NOHO',
                    data: dadosNoho,
                    borderColor: '#050A30',
                    borderWidth: 2,
                    fill: false,
                    pointStyle: 'circle',
                    pointRadius: 3,
                    pointBackgroundColor: '#050A30'
                },
                {
                    label: 'Outra opção',
                    data: dadosOther,
                    borderColor: '#FFD700', // Amarelo claro
                    borderWidth: 2,
                    fill: false,
                    pointStyle: 'circle',
                    pointRadius: 3,
                    pointBackgroundColor: '#FFD700'
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        boxWidth: 10
                    }
                },
                title: {
                    display: true,
                    text: 'Crescimento do Investimento ao Longo do Tempo'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Meses'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Valor (R$)'
                    },
                    ticks: {
                        callback: function(value) {
                            return 'R$ ' + value.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
                        }
                    }
                }
            }
        }
    });
});

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
