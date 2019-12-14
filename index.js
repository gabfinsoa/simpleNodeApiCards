//importando a biblioteca do express
const express = require('express');

//arquivo para importar/configurar o banco de dados
//importando a classe database.js
const database = require('./database');

// const dotenv = require('dotenv');
require('dotenv').config();

const server = express();

server.use(express.json());

//Middleware
server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    //console.log(process.env.TESTE);
    next();
});

//Middleware para verificar se o card existe
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

//Middleware para ver qual é o ultimo ID
async function getNextId(req, res, next){
    //Query para pegar o maior ID
    await database.query(`SELECT MAX(id) FROM cards`, { type: database.QueryTypes.SELECT })
    .then(id => {
        console.log(results);
        
        //Atribuir o resultado da query MAX para o NextID
        nextId = id[0].max;
        
    })
    // nextId++;
    //Ir para a próxima execucao/requisicao (funcao/classe)
    next();
}

//criar 2 variaveis por não haver banco de dados
let nextId = null;
let cards = [] //array de cards (objetos)

//ROUTES
server.get('/',(req,res) => {
    
    return res.json({result: "API-SCRAPBOOK"});
});

server.get("/cards",  async (req,res) => {
    //conectar ao banco e fazer o select. E qual o tipo de resposta que quero ao executar o comando (select)
    //utilizando a funcao QUERY do database: Select + Tipod e Query na resposta
   await database.query(`SELECT * FROM cards`, {type: database.QueryTypes.SELECT})
    .then(resultCards => {
        // console.log(results);
        cards = resultCards;
        console.log(cards);
    })

    return res.json(cards);
});

//req pega as coisas que o cliente envia
server.post("/cards", getNextId, (req, res) => {
    //Incrementar o ID
    nextId++;
    // A requisicao pega no <body> os campos TITLE e CONTENT
    const {title, content} = req.body;
    
    // Controlar o ID na aplicacao. CARD é um objeto
    const card = {
        id: nextId,
        title,
        content
    };

    //Realizando INSERT no banco
    database.query(`INSERT INTO cards ("id", "title", "content") VALUES (${nextId},'${title}','${content}')`,
        { type: database.QueryTypes.INSERT }
    )
    .then(resultInsert => {
        console.log(resultInsert);        
        
    });

    // Adicionar cada card no array de CARDS
    cards.push(card);

    // // Incrementar o ID
    // nextId++;

    return res.json(card);
});

//Recebe o ID como 1 parâmetro e o MIDDLEWARE como 2 parametro
server.put("/cards/:id", checkCard, (req, res) => {
    //Pegar do REQ o ID
    const {id} = req.params; 

    //Pegar do BODY as variaveis TITLE e CONTENT para editar
    const {title, content} = req.body;

    let updated = false;

    // Encontrando um CARD no array
    const card = cards.find(procuraCard => procuraCard.id == id);

    
    //Verificar se contem valor no TITLE
    if(title){
        //Caso o valor exista, add o novo titulo (via postman)
        card.title = title;
        updated = true;
    }
    //Verificar se contem valor no CONTENT
    if(content){
        //Caso o valor exista, add o novo conteudo (via postman)
        card.content = content;
        updated = true;
    }

    //Se algo foi atualizado...
    if(updated) {
        //Faz update no banco
        database.query(`UPDATE cards SET content = '${scrap.content}', title = '${scrap.title}' WHERE  id = ${id}`,
            { type: database.QueryTypes.UPDATE}
        )
        .then(update => {
            console.log(update);
        });
    };

    return res.json(card);
});

//Recebe o ID por parâmetro
server.delete("/cards/:id", checkCard, (req, res) => {

    const{id} = req.params;

    const cardIndex = cards.findIndex(card => card.id == id);

    database.query(`DELETE FROM cards WHERE id = ${id};`, { type: database.QueryTypes.DELETE})
    .then(del => {
        console.log(del);
    });

    cards.splice(cardIndex, 1);

    return res.json(cards);
});


//Porta utilizada
// server.listen(3333);
server.listen(process.env.PORT);


