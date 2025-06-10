// Carregar as variáveis de ambiente
require('dotenv').config();


// Importat as bibliotecas necessárias
const axios = require('axios');
const {Pool, ClientBase} = require('pg');

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
        const poll = new Pool({
            user:process.env.DATA_USER,
            host: process.env.DATA_HOST,
            database: process.env.DATABASE,
            port: process.env.DATA_PORT,
            password: process.env.PASSWORD
        });
        poll.connect((err, client, done)=>{
            if (err){
                console.error('Erro ao conectar com o SGBD: ', err.stack);
            }else{
                console.log('Você está conectado:');
                 client.release();
            }
        })
        
        console.log('Dados recebidos:', dadosRecebidos);
    }catch (error) {
        console.error('Erro ao buscar clima:', error.message);
    }
}
tracaArmazenaClima();