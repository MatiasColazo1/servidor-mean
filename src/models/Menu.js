const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  monto: Number,
  coutas: String,
  fecha: String,
  mensual: Number,
  interes: Number, 
  estado: String, 
});

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;