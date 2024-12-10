const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Conectar ao MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/art_rush', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Conectado ao MongoDB!'))
.catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Modelo de Usuário
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
});

// Antes de salvar, criptografe a senha
userSchema.pre('save', async function(next) {
    if (this.isModified('password') || this.isNew) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const User = mongoose.model('users', userSchema);

// Registro de Usuário
app.post('/signup', async (req, res) => {
    const { username, password, firstName, lastName } = req.body;

    if (!username || !password || !firstName || !lastName) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    try {
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ error: 'Usuário já existe.' });
        }

        const newUser = new User({ username, password, firstName, lastName });
        await newUser.save();
        res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao registrar usuário.' });
    }
});

// Login de Usuário
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username e password são obrigatórios.' });
    }

    try {
        const user = await User.findOne({ username });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        res.status(200).json({ 
            message: 'Login bem-sucedido!', 
            user: { username: user.username, firstName: user.firstName, lastName: user.lastName } 
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao fazer login.' });
    }
});





app.put('/updateProfile', async (req, res) => {
    const { username, password, firstName, lastName } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'Nome de usuário é obrigatório.' });
    }

    try {
        // Constrói o objeto de atualização apenas com os campos presentes
        const updates = {};
        if (password) updates.password = password; // Inclua hash da senha, se necessário
        if (firstName) updates.firstName = firstName;
        if (lastName) updates.lastName = lastName;

        // Encontra o usuário pelo nome de usuário e atualiza os campos
        const user = await User.findOneAndUpdate(
            { username },       // Critério de busca
            updates,            // Campos a serem atualizados
            { new: true }       // Retorna o documento atualizado
        );

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        res.status(200).json({ message: 'Perfil atualizado com sucesso!', user });
    } catch (error) {
        console.error('Erro no servidor:', error);
        res.status(500).json({ error: 'Erro ao atualizar perfil.' });
    }
});




// Excluir conta de usuário
app.delete('/deleteAccount', async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'O username é obrigatório.' });
    }

    try {
        // Encontre e remova o usuário pelo username
        const user = await User.findOneAndDelete({ username: username });

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        res.status(200).json({ message: 'Conta excluída com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao excluir conta.' });
    }
});



// Iniciar o servidor
app.listen(3000, () => {
    console.log('Servidor iniciado na porta 3000');
});
