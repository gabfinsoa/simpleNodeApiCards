
//chamar lib express
const express = require('express');

//servidor que vai ser aplicação express
const server = express();

//informar a utilização de arquivo Json
server.use(express.json());

//toda a rota ira ter um request, uma resposta
//midleware
server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin','*'); //só necessário por estar rodando local, senão não precisa
    next();  //seguir
});

function checkCard(req, res, next) {
    const {id} = req.params; //pegar do req
    const card = cards.find(card => card.id == id);  //buscar card
    if(!card){
        return res.json({error: "Card not found!"}); //caso não encontre o card a aplicação para aqui
    }
    next(); //seguir
};

//criar 2 variaveis por não haver banco de dados
let nextId = 1;
const cards = [] //array

//criando uma rota e retornando o GET com este objeto
server.get("/", (req, res) => {
    return res.json({result: "API-SCRAPBOOK"});
});

//rota get que devolve os cards
server.get("/cards", (req, res) =>{
    return res.json(cards);   // localhost:3333/cards
});

//rota POST para cadastrar os cards
server.post("/cards", (req, res) => {
    const {title, content} = req.body;

    //controlar o ID
    const card = {
        id: nextId,
        title,
        content
    };
    cards.push(card);

    //Incrementa o ID
    nextId++;

    return res.json(card);
});

//rota para update (atualizar)
server.put("/cards/:id", checkCard, (req, res) => {
    //mandar o ID que é para editar
    

    const {title, content} = req.body; //pegar e editar as variaveis
    const card = cards.find(card => card.id == id);  //buscar card
    

    

    if(title){
        card.title = title; //se o card existir add o title no card
    }

    if(content){
        card.content = content; //se o conteudo existir add o conteudo no card
    }

    return res.json(card); 
});

//deletar card - :id é o parametro (numero do card) que quero deletar
server.delete("/cards/:id", checkCard, (req, res) => {

    
    // return res.json("NADA");
    const {id} = req.body;
    const card = cards.find(card => card.id == id);  //buscar card
    // cards.splice(card, id);  // exclui o card numero X
    // cards.remove();
    return res.json(cards);


});

//ouvindo a rota do servidor
server.listen(3333);  //rodar YARN DEV e abrir o LOCALHOST:3333 para ver o resultado




