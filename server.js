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
    try{
    const nome  = req.query.nome;
    const ingredientes = req.query.ingredientes;

    if (!nome || !ingredientes) {
        return res.status(400).send('Nome e Ingredientes são obrigatórios.');
    };

    res.status(200).send(`
            <!DOCTYPE html>
            <html>
            <head><title>Obrigado!</title></head>
            <body>
                <h1>Obrigado, ${nome}!</h1>
                <p>Sua sugestão: ${ingredientes.replace(/\+/g, ' ')}</p>
                <a href="/">Voltar</a>
            </body>
            </html>
        `);
    
         
    }catch (error) {
        errorProcessarSugestao(error,res);
    }

    
   
});


app.get('/contato', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'views', 'contato.html'));
});

app.post('/contato', (req, res) => {
    const{ nome, email, assunto, mensagem } = req.body;
    
    res.status(200).send(`
            <!DOCTYPE html>
            <html>
            <head><title>Obrigado!</title></head>
            <body>
                <h1>Obrigado, ${nome}!</h1>
                <p>Recebemos seu email sobre ${assunto}</p>
                <p>Sua mensagem: ${mensagem}</p>
                <p>Entraremos em contato pelo email: ${email}</p>
                <a href="/">Voltar</a>
            </body>
            </html>
        `);


    res.status(200).send({
        "Nome": nome, 
        "Email": email, 
        "Assunto": assunto, 
        "Mensagem": mensagem}, 
        "Obrigado, sua mensagem foi enviada com sucesso!");
});

app.get('/api/lanches', async (req, res) => {
    try{
        const pathFile = path.join(__dirname, 'public', 'data', 'lanches.json');
        if (!fs.existsSync(pathFile)) {
            return res.status(404).json({
                "status": "error",
                "message": "Arquivo de lanches não encontrado."
            });
        }

        const data = await fs.promises.readFile(pathFile, 'utf8')
        const lanches = JSON.parse(data);



        res.status(200).json(
            {
                "status": "success",
                "data": lanches
            }

        );
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