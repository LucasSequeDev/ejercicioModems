const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

// Ver las peticiones del cliente en la tarminal
app.use(morgan('dev'))

// Habilitar express.json
app.use(express.json({ extended: true}));

// Conectar con otros servidores
app.use(cors())

// Routes
app.use('/api/modems/',require('./Routes/Modems'))


module.exports = app