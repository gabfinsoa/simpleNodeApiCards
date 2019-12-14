
//add conexão com o banco de dados
//importar a classe Sequelize (obs.: ao importar uma classe, a mesma deve ser em maiusculo)
const Sequelize = require('sequelize');

//rotas, puxar as configurações/variaveis criadas na api e também no heroku
//usado para pegar as variaveis do arquivo de configuracao (.env)
require('dotenv').config();

//pegar URL no Heroku

//Criar a conexão com o banco de dados
//                                     URL no env
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    //especificar o tipo de banco a ser conectado
    dialect: 'postgres',
    dialectOptions: {
    //especificar que é uma conexao segura 
    ssl: true
    }
});

//exportar a classe
module.exports = sequelize;
