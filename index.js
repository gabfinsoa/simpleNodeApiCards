
const express = require('express');

//importar o banco de dados
const database = require('./database');

// const dotenv = require('dotenv');
require('dotenv').config();

const server = express();

server.use(express.json());

//Middleware
server.use((req,res,next) => {
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    //console.log(process.env.TESTE);
    next();
});

//Middleware
function checkCard(req,res,next){
    const {id} = req.params;
    // Encontrando um CARD no array
    const card = cards.find(procuraCard => procuraCard.id == id);

    //Verifica se o card existe, caso contrario exibe mensagem e encerra
    if(!card){
        return res.json({error: "Card not found."});
    }

    next();
}

//Criar middleware para ver qual é o ultimo ID
function lastId(req,res,next){
database.query(`SELECT MAX(id) FROM cards`, {type: database.QueryTypes.SELECT})
    .then(results => {
        console.log("results");
        
    })
    next();
}

//criar 2 variaveis por não haver banco de dados
let nextId = 1;
let cards = [] //array de cards (objetos)

//ROUTES
server.get('/',(req,res) => {
    
    return res.json({result: "API-SCRAPBOOK"});
});

server.get("/cards", lastId, (req,res) => {
    //conectar a banco e fazer o select. E qual o tipo de resposta que quero ao executar o comando (select)
    database.query(`SELECT * FROM cards`, {type: database.QueryTypes.SELECT})
    .then(results => {
        console.log("results");
        cards = results;
        console.log(cards);
    })

    return res.json(cards);
});

//req pega as coisas que o cliente envia
server.post("/cards", (req, res) => {
    // A requisicao pega no <body> os campos TITLE e CONTENT
    const {title, content} = req.body;
    
    // Controlar o ID na aplicacao. CARD é um objeto
    const card = {
        id: nextId,
        title,
        content
    };

    // Adicionar cada card no array de CARDS
    cards.push(card);

    // Incrementar o ID
    nextId++;

    return res.json(card);
});

//Recebe o ID como 1 parâmetro e o MIDDLEWARE como 2 parametro
server.put("/cards/:id", checkCard, (req, res) => {
    //Pegar do REQ o ID
    const {id} = req.params; 

    //Pegar do BODY as variaveis TITLE e CONTENT para editar
    const {title, content} = req.body;

    // Encontrando um CARD no array
    const card = cards.find(procuraCard => procuraCard.id == id);

    
    //Verificar se contem valor no TITLE
    if(title){
        //Caso o valor exista, add o novo titulo (via postman)
        card.title = title;
    }
    //Verificar se contem valor no CONTENT
    if(content){
        //Caso o valor exista, add o novo conteudo (via postman)
        card.content = content;
    }

    return res.json(card);
});

//Recebe o ID por parâmetro
server.delete("/cards/:id", checkCard, (req, res) => {

    const{id} = req.params;

    const cardIndex = cards.findIndex(card => card.id == id);

    cards.splice(cardIndex,1);

    return res.json(cards);
});


//Porta utilizada
// server.listen(3333);
server.listen(process.env.PORT);


