require('dotenv').config();

const express = require('express');
const path = require('path');
const sequelize = require('./config/database');

require('./models/Aluno');
require('./models/Professor');
require('./models/Turma');
require('./models/Disciplina');
require('./models/Matricula');
require('./models/Horario');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const alunoRoutes = require('./routes/alunoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', authRoutes);
app.use('/admin', adminRoutes);
app.use('/aluno', alunoRoutes);

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Banco conectado e sincronizado');
    app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
  })
  .catch((err) => console.log('Erro ao conectar no banco:', err));
