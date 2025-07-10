const express = require('express')
const path = require('path');
const app = express();
const PORT = 3000;
const fs = require('fs');

app.use(express.json())
app.use(express.urlencoded({ extended: true })); // Para formulários HTML

app.get('/', (req, res) => {
    try{
        res.status(200).sendFile(path.join(__dirname, 'views', 'index.html'));
    }catch (error) {
        errorProcessarSugestao(error,res);
    }
    
});

app.get('/sugestao', (req, res) => {
    const nome  = req.query.Nome;
    const ingredientes = req.query.Ingredientes;

    if (!nome || !ingredientes) {
        return res.status(400).send('Nome e Ingredientes são obrigatórios.');
    };
    try{
         res.status(200).send(`Obrigado, ${nome}! Seus ingredientes "${ingredientes}" foi recebida.`);;
    }catch (error) {
        errorProcessarSugestao(error,res);
    }

    
   
});


app.get('/contato', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'views', 'contato.html'));
});

app.post('/contato', (req, res) => {
    const{ nome, email, assunto, mensagem } = req.body;
    
    res.status(200).send({
        "Nome": nome, 
        "Email": email, 
        "Assunto": assunto, 
        "Mensagem": mensagem}, 
        "Obrigado, sua mensagem foi enviada com sucesso!");
});

app.get('/api/lanches', (req, res) => {
    try{
        const data = fs.readFileSync(path.join(__dirname,'public' , 'data', 'lanches.json'), 'utf8');
        const lanches = JSON.parse(data);
        res.status(200).json(lanches);
    }catch (error) {
        errorProcessarSugestao(error,res);
    }

});

app.listen(PORT, () => {
    console.log(`Servidor da DevBurger rodando em http://localhost:${PORT}`);
});


function errorProcessarSugestao(error,res) {
    console.error('Erro ao processar a sugestão:', error);
    res.status(500).send('Erro ao processar a sugestão.');
}