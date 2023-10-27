const express = require('express');
const app = express();

//base de datos
require('./database');

//json
app.use(express.json());

//rutas
app.use('/api', require('./routes/index'))

app.listen(3000);
console.log('Servidor en el puerto: ', 3000)