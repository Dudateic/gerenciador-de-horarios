require("dotenv").config();

const express = require("express");
const path = require("path");
const sequelize = require("./config/database");

require("./models/Aluno");
require("./models/Professor");
require("./models/Disciplina");
require("./models/Turma");
require("./models/Matricula");
require("./models/Horario");
require("./models/Progresso");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const alunoRoutes = require("./routes/alunoRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

app.use("/", authRoutes);
app.use("/admin", adminRoutes);
app.use("/aluno", alunoRoutes);

app.use((req, res) => {
  res.status(404).render("404", { title: "Página não encontrada" });
});

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("Banco conectado e sincronizado");
    app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
  } catch (err) {
    console.error("Erro ao conectar no banco:", err);
  }
}

start();
