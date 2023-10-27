const { Router } = require('express');
const router = Router();

const User = require('../models/User');

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

router.get('/private-tasks', (req, res) => {
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

module.exports = router;

//rutas privadas
function verifyToken(req, res, next) {
    if(!req.headers.authorization) {
        return res.status(401).send('No autorizado');
    }
    
}