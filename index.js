// Carregar as variáveis de ambiente
require("dotenv").config();

// Importat as bibliotecas necessárias
const axios = require("axios");
const { Pool, ClientBase } = require("pg");

async function tracaArmazenaClima() {
  try {
    const cidade = "Piranguinho";
    const apikey = process.env.API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${apikey}&lang=pt_br&units=metric`;
    console.log(`Buscando clima para a cidade: ${cidade}`);
    const response = await axios.get(url);
    const clima = response.data;
    const dadosRecebidos = {
      cidade: clima.name,
      temperatura: clima.main.temp,
      umidade: clima.main.humidity,
      sensacao_termica: clima.main.feels_like,
      data: new Date().toISOString(),
      id: clima.id,
    };
    const poll = new Pool({
      user: process.env.DATA_USER,
      host: process.env.DATA_HOST,
      database: process.env.DATABASE,
      port: process.env.DATA_PORT,
      password: process.env.PASSWORD,
    });
    poll.connect(async (err, client, done) => {
      if (err) {
        console.error("Erro ao conectar com o SGBD: ", err.stack);
      } else {
        console.log("Você está conectado:");
        try {
          await client.query(
            `INSERT INTO clima (cidade, temperatura, umidade, sensacao_termica, data, id_cidade)
         VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              dadosRecebidos.cidade,
              dadosRecebidos.temperatura,
              dadosRecebidos.umidade,
              dadosRecebidos.sensacao_termica,
              dadosRecebidos.data,
              dadosRecebidos.id,
            ]
          );

          let mostraBD = await client.query(`select * from clima;`);
          console.log(mostraBD);

          console.log("Dados inseridos com sucesso!");
        } catch (e) {
          console.error("Erro ao inserir dados:", e.message);
        } finally {
          client.release();
          poll.end();
        }
      }
    });
    console.log("Dados recebidos:", dadosRecebidos);
  } catch (error) {
    console.error("Erro ao buscar clima:", error.message);
  }
}
tracaArmazenaClima();
