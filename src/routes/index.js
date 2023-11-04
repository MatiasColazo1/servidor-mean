const { Router } = require('express');
const router = Router();

const User = require('../models/User');

const Tarjeta = require('../models/Tarjeta');

const jwt = require('jsonwebtoken');

router.get('/', (req, res) => res.send('Hola mundo'));

router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    const newUser = new User({email, password});
    await newUser.save();
    
    const token = jwt.sign({ _id: newUser._id }, 'secretKey')
    res.status(200).json({token})
})

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({email})
    if (!user) return res.status(401).send("el usuario no existe");
    if (user.password !== password) return res.status(401).send("Contraseña incorrecta");

    const token = jwt.sign({_id: user._id}, 'secretKey');
    return res.status(200).json({token});
})

router.get('/tasks', (req, res) => {
    res.json([
        {
            _id: 1,
            name: 'Task one',
            description: 'descripcion',
            date: "2023-10-27T19:23:33.456Z"
        },
        {
            _id: 2,
            name: 'Task two',
            description: 'descripcion',
            date: "2023-10-27T19:23:33.456Z"
        },
        {
            _id: 3,
            name: 'Task three',
            description: 'descripcion',
            date: "2023-10-27T19:23:33.456Z"
        }
    ])
})

router.get('/private-tasks', verifyToken, (req, res) => {
    res.json([
        {
            _id: 1,
            name: 'Task one',
            description: 'descripcion',
            date: "2023-10-27T19:23:33.456Z"
        },
        {
            _id: 2,
            name: 'Task two',
            description: 'descripcion',
            date: "2023-10-27T19:23:33.456Z"
        },
        {
            _id: 3,
            name: 'Task three',
            description: 'descripcion',
            date: "2023-10-27T19:23:33.456Z"
        }
    ])
})

//Saldo
// Agrega un saldo para un usuario
router.post('/add-tarjeta',  async (req, res) => {
    const { saldo, cardNumber, fecha } = req.body;
    const newTarjeta = new Tarjeta({
      saldo,
      cardNumber,
      fecha,
    });
    await newTarjeta.save();
    res.status(200).json(newTarjeta);
  });
  
  // Obtiene el saldo de un usuario
  router.get('/get-tarjeta', async (req, res) => {
    const userId = req.params.userId;
    const tarjeta = await Tarjeta.findOne({ user: userId });
    if (!tarjeta) {
      return res.status(404).json({ message: 'Saldo no encontrado' });
    }
    res.status(200).json(tarjeta);
  });

module.exports = router;

//rutas privadas

function verifyToken(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send('No autorizado');
    }

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token === 'null') {
        return res.status(401).send('No autorizado');
    }

    const payload = jwt.verify(token, 'secretKey')
    req.userUd = payload._id;
    next();
}
