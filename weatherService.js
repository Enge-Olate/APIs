const axios = require('axios');
require('dotenv').config();

async function getClima(cidade) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${process.env.API_KEY}&lang=pt_br&units=metric`;
        const response = await axios.get(url);
        const setDados ={
            cidade: response.data.name,
            temperatura: response.data.main.temp,
            descricao: response.data.weather[0].description,
            humidade: response.data.main.humidity,
        };
        return setDados;
    } catch (error) {
        if(error.response){
            if (error.response.status === 404) {
                throw new Error(`Cidade de ${cidade} não encontrada.`);
            }
            if (error.response.status === 401) {
                throw new Error('Erro de autorização, verifique sua chave API.');
            }
        }
        throw new Error('Provavelmente você está sem internet.');
    }
}
module.exports = {getClima};
