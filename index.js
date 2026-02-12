const db = require("./db");
const weatherService = require("./weatherService");

async function testConnection(params) {
  try {
    console.log("A tentar conexão...");
    const results = await db.Query("select now() as hora_atual");
    console.log(
      "Conexão bem sucedida! Hora do servidor de dados: ",
      results.rows[0].hora_atual
    );
  } catch (error) {
    console.error("Erro ao se conectar: ", error);
  }
}

async function CreateTable(params) {
    const table =`
        create table if not exists clima(
            id serial primary key,
            cidade varchar(100) not null,
            temperatura decimal(2,1) not null,
            descricao varchar(255) not null,
            humidade numeric(3,1) not null,
            data_registro timestamp default current_timestamp
        );
    
    `;
  try {
    await db.Query(table);
    console.log('Tabela criada e verificada!\n');
  } catch (error) {
    console.error('Erro:', error.message);
    throw error;
  }
}
async function getClima(nameCity) {
  console.log("A procurar situação climática para : ", nameCity);
  try {
    const weather = await weatherService.getClima(nameCity);

    const insertQuery = `
        insert into clima(
            cidade, temperatura, descricao, humidade
        )values(
            $1, $2, $3, $4
        )returning id;
    `;
    const valores = [weather.cidade, weather.temperatura, weather.descricao, weather.humidade];
    const results = await db.Query(insertQuery, valores);
    console.log(`Dados inseridos, id do registro: ${results.rows[0].id}\n`);
  } catch (error) {
    console.error("Erro: ", error.message);
  }
}

async function itera_cidades(params) {
  const cidades = [
    "Santa Rita do Sapucaí",
    "Varginha",
    "Itajubá",
    "Pouso Alegre",
    "Maria da Fé",
  ];
  for (const cidade of cidades) {
    await getClima(cidade);
  }
}
(async ()=>{
    await testConnection();
    await CreateTable();
    await itera_cidades();
})();
