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

module.exports = router;