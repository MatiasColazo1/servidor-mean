const { Schema, model } = require('mongoose');

const tarjetaSchema = new Schema ({

    saldo: Number, 
    cardNumber: String, 
    fecha: String,
    nombre: String,
    ingresos: Number,
    ingresosPorcentaje: Number,
    egresos: Number,
    egresosPorcentaje: Number
  });

module.exports = model('Tarjeta', tarjetaSchema);