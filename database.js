
//add conexão com o banco de dados
//importar a classe Sequelize
const Sequelize = require('sequelize');

//rotas, puxar as configurações/variaveis criadas no dotenv/heroku
require('dotenv').config();

//pegar URL no Heroku

//Criar a conexão com o banco de dados
//                                     URL no env
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
    ssl: true
    }
    });


module.exports = sequelize;
