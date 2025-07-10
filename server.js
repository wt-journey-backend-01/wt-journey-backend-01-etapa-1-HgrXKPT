const express = require('express')
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json())
app.use(express.urlencoded({ extended: true })); // Para formulários HTML

app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/sugestao', (req, res) => {
    const nome  = req.query.Nome;
    const ingredientes = req.query.Ingredientes;
    res.status(200).send(`Obrigado, ${nome}! Seus ingredientes "${ingredientes}" foi recebida.`);;
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
});

app.listen(PORT, () => {
    console.log(`Servidor da DevBurger rodando em http://localhost:${PORT}`);
});