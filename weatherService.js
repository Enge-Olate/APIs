require("dotenv").config();

const axios = require("axios");

async function getClima(cidade) {
  const api_key = process.env.API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${api_key}&lang=pt_br&units=metric`;

  try {
    const response = await axios.get(url);
    const getDados = {
      cidade: response.data.name,
      temperatura: response.data.main.temp,
      descricao: response.data.weather[0].description,
    };
    return getDados;
  } catch (error) {
    console.log(error);
  }
}
module.exports = getClima;