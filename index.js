// Carregar as variáveis de ambiente
import dotenv from 'dotenv';
dotenv.config();

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
        console.log(`Clima atual em ${cidade}: ${clima.weather[0].description}`);
    }catch (error) {
        console.error('Erro ao buscar clima:', error.message);
    }
}
