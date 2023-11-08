const mongoose = require('mongoose');

const transaccionSchema = new mongoose.Schema({
  transaccionId: { type: Number, unique: true }, 
  nombre: String, 
  monto: Number, 
  fecha: String,
  horario: String, 
  estado: String, 
});

const Transaccion = mongoose.model('Transaccion', transaccionSchema);

module.exports = Transaccion;