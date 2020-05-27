require('dotenv').config();

const app = require('./app');


async function main() {
    try {
        // Conexion servidor
        await app.listen(process.env.PORT || 5000)
        console.log('[+] Servidor: CONECTADO - Port ',process.env.PORT || 5000)
    } catch (error) {
        console.log('[-] Servidor: ERROR - '+error)
    }
}

main()