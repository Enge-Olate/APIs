// Carregar as variáveis de ambiente
require('dotenv').config();


// Importat as bibliotecas necessárias
const axios = require('axios');
const {Poll} = require('pg');

async function tracaArmazenaClima() {
    try{
        const cidade = 'Santa Rita do Sapucaí';
        const apikey = process.env.API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${apikey}&lang=pt_br&units=metric`;
        console.log(`Buscando clima para a cidade: ${cidade}`);
        const response = await axios.get(url);
        const clima = response.data;
        const dadosRecebidos={
            cidade: clima.name,
            temperatura: clima.main.temp,
            umidade: clima.main.humidity,
            sensacao_termica: clima.main.feels_like,
            data: new Date().toISOString(),
            id: clima.id  
        }
        console.log('Dados recebidos:', dadosRecebidos);
    }catch (error) {
        console.error('Erro ao buscar clima:', error.message);
    }
}
tracaArmazenaClima();