const { obterCodigoAdmin } = require("../utils/localAdminKey");

console.log("Código local para cadastro de administrador:");
console.log(obterCodigoAdmin());
console.log("\nGuarde esse código. O arquivo .admin-register-key fica apenas localmente e está no .gitignore.");
