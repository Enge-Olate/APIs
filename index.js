// Carregar as variáveis de ambiente
require("dotenv").config();
const bd = require("./bd_connection");
const getClima = require("./weatherService");
const weather = require("./weatherService");

async function testConnection(params) {
  try {
    console.log("Testando conexão...");
    const results = await bd.Query("select now() as now");
    console.log("Conectado!");
    console.log("Hora: \n", results.rows[0].now);
  } catch (error) {
    return error;
  }
}

async function tablePostgres(params) {
  try {
    const getTableUsers = `select * from pg_catalog.pg_tables where schemaname = 'public';`;
    const results = await bd.Query(getTableUsers);
    const quantity = results.rowCount;
    console.log("Carregando tableas...");
    for (let i = 0; i <= quantity; i++) {
      console.log(results.rows[i].tablename);
    }
  } catch (error) {
    return error;
  }
}

async function createTable(params) {
    const table =`
        create table if not exists clima(
            id serial primary key,
            cidade varchar(100) not null,
            temperatura decimal(3,1) not null,
            descricao varchar(255) not null,
            data_registro timestamp default current_timestamp
        );
    
    `;
  try {
    await bd.Query(table);
    console.log('Tabela criada e verificada!\n');
  } catch (error) {
    console.error('Erro:', error.message);
    throw error;
  }
}

async function insertData(cidade) {
  try {
    const weather = await getClima(cidade);
    const insertQuery = `insert into clima(
            cidade, temperatura, descricao
        )values(
            $1, $2, $3
        )returning id;
    `;
  const data = [weather.cidade, weather.temperatura, weather.descricao];
  const results = await bd.Query(insertQuery, data);
  console.log(`Dados climáticos inseridos com sucesso; ID: ${results.rows[0].id}`)
  } catch (error) {
    throw error;
  }
}

async function clima_regiao(params) {
  const cidades = [
    "Varginha",
    "Itajubá",
    "Santa Rita do Sapucaí",
    "Pouso Alegre",
    "São Paulo",
  ];
  for (const cidade of cidades) {
    await insertData(cidade);
  }
}

(async (params) => {
  await testConnection();
  await tablePostgres();
  await createTable();
  await clima_regiao();
})();
