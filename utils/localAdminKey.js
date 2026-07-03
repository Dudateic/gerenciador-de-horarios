const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const keyPath = path.join(__dirname, "..", ".admin-register-key");

function gerarCodigo() {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
}

function obterCodigoAdmin() {
  if (!fs.existsSync(keyPath)) {
    const codigo = gerarCodigo();
    fs.writeFileSync(keyPath, codigo, { encoding: "utf8", mode: 0o600 });
    return codigo;
  }

  return fs.readFileSync(keyPath, "utf8").trim();
}

function validarCodigoAdmin(codigoDigitado) {
  const codigoSalvo = obterCodigoAdmin();
  return String(codigoDigitado || "").trim() === codigoSalvo;
}

module.exports = { obterCodigoAdmin, validarCodigoAdmin };
