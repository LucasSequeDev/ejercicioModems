const mysql = require('mysql')

const conexion = mysql.createConnection({
    host: process.env.HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'stechs',
    port: process.env.DB_PORT || '3306'})

 //Funcion que me conecta a la base de datos
 conexion.connect(function(error){
    if(error){
         console.log('[-] Base de datos: ERROR - '+error)
    }else{
         console.log('[+] Base de datos: CONECTADA')
    }
 })

module.exports = conexion
