const { Schema, model } = require('mongoose');

const balanceSchema = new Schema ({

    saldo: Number, // El saldo del usuario
    cardNumber: String, // Número de tarjeta
    fecha: String, // Fecha de validez de la tarjeta
  });

module.exports = model('Balance', balanceSchema);