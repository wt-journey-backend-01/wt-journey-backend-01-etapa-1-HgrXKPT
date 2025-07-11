const express = require('express')
const path = require('path');
const app = express();
const PORT = 3000;
const fs = require('fs');
const { type } = require('os');

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));




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
    try{
        res.status(200).sendFile(path.join(__dirname, 'views', 'contato.html'));
    }catch (error){
        res.status(500).send('Erro ao carregar a página de contato.');
    }
    
});

app.post('/contato', (req, res) => {
    const{ nome, email, assunto, mensagem } = req.body;

    if (!nome) console.log("O campo [nome] é obrigatório");
    if (!email) console.log("O campo [email] é obrigatório");
    if (!assunto) console.log("O campo [assunto] é obrigatório");
    if (!mensagem) console.log("O campo [mensagem] é obrigatório");

    if(nome && email && assunto && mensagem){
        res.status(200).send(`
            
            <head><title>Obrigado!</title></head>
            <body>
                <h1>Obrigado, ${nome}!</h1>
                <p>Recebemos seu email sobre ${assunto}</p>
                <p>Sua mensagem: ${mensagem}</p>
                <p>Entraremos em contato pelo email: ${email}</p>
                <a href="/">Voltar</a>
            </body>
            
        `);
    }
    

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
        let lanchesArray;

        try{
         lanchesArray = JSON.parse(data);
        } catch (parseError) {
            return res.status(400).json({
                status: "error",
                message: "Formato JSON inválido no arquivo de lanches"
            });

        }

        if (!Array.isArray(lanchesArray)) {
            return res.status(400).json({
                status: "error",
                message: "O arquivo não contém um array válido de lanches"
            });
        }

        
        if (lanchesArray.length < 3) {
            return res.status(400).json({
                status: "error",
                message: "O array deve conter pelo menos 3 lanches"
            });
        }

        
        
        const isvalid = lanchesArray.every(lanches =>
            lanches && 
            typeof lanches.id  === 'number' &&
            typeof lanches.nome === 'string' &&
            typeof lanches.ingredientes === 'string' &&
            lanches.nome.trim() !== '' &&
            lanches.ingredientes.trim() !== '' &&
            lanches.id > 0
        );

            if (!isvalid) {
            throw new Error('Estrutura de dados inválida em um ou mais lanches');
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(lanchesArray);

    }catch (error) {

        res.setHeader('Content-Type', 'application/json');

        res.status(500).json({
            "status": "error",
            "message": "Erro ao ler o arquivo de lanches.",
            "error": error.message
        });
    }

});


app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));

});

app.use((err, req, res, next) => {
    console.error('Erro não tratado:', err);
    res.status(500).json({
        status: "error",
        message: "Erro interno no servidor"
    });
});


app.listen(PORT, () => {
    console.log(`Servidor da DevBurger rodando em http://localhost:${PORT}`);
});


function errorProcessarSugestao(error,res) {
    console.error('Erro ao processar a sugestão:', error);
    res.status(500).send('Erro ao processar a sugestão.');
}
//

function validarLanches(lanches){
    return (
        lanches && typeof 
        lanches.id  === 'number' &&
        typeof lanches.nome === 'string' &&
        typeof lanches.ingredientes === 'string' &&
        lanches.trim() !== ''
    );
} 