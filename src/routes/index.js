const { Router } = require('express');
const router = Router();

const User = require('../models/User');

const Tarjeta = require('../models/Tarjeta');

const Transaccion = require('../models/Transaccion')

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
    const { saldo, cardNumber, fecha,  nombre , ingresos, ingresosPorcentaje, egresos, egresosPorcentaje } = req.body;
    const newTarjeta = new Tarjeta({
      saldo,
      cardNumber,
      fecha,
      nombre,
      ingresos,
      ingresosPorcentaje,
      egresos,
      egresosPorcentaje
    });
    await newTarjeta.save();
    res.status(200).json(newTarjeta);
  });
  
  // Obtiene el saldo de un usuario
  router.get('/get-tarjeta', async (req, res) => {
    try {
        // Realiza una búsqueda para obtener la tarjeta (puedes cambiar el criterio según tu implementación)
        const tarjeta = await Tarjeta.findOne({});

        if (!tarjeta) {
            return res.status(404).json({ message: 'Tarjeta no encontrada' });
        }

        res.status(200).json(tarjeta);
    } catch (error) {
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Actualiza una tarjeta
router.patch('/update-tarjeta', async (req, res) => {
    try {
        // Realiza una búsqueda para obtener la tarjeta (puedes cambiar el criterio según tu implementación)
        const tarjeta = await Tarjeta.findOne({});

        if (!tarjeta) {
            return res.status(404).json({ message: 'Tarjeta no encontrada' });
        }

        // Actualiza los valores de la tarjeta según lo que venga en la solicitud
        if (req.body.saldo) {
            tarjeta.saldo = req.body.saldo;
        }
        if (req.body.nombre) {
            tarjeta.nombre = req.body.nombre;
        }
        if (req.body.ingresos) {
            tarjeta.ingresos = req.body.ingresos;
        }
        if (req.body.egresos) {
            tarjeta.egresos = req.body.egresos;
        }
        if (req.body.ingresosPorcentaje) {
            tarjeta.ingresosPorcentaje = req.body.ingresosPorcentaje;
        }
        if (req.body.egresosPorcentaje) {
            tarjeta.egresosPorcentaje = req.body.egresosPorcentaje;
        }
        // Agrega aquí más campos que quieras actualizar

        // Guarda los cambios en la tarjeta
        await tarjeta.save();

        res.status(200).json(tarjeta);
    } catch (error) {
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
});

router.post('/transaccion', async (req, res) => {
    try {
      const newTransaction = new Transaccion(req.body);
      await newTransaction.save();
      res.json(newTransaction);
    } catch (error) {
      res.status(500).json({ error: 'No se pudo crear la transacción' });
    }
  });

  router.get('/transaccion', async (req, res) => {
    try {
      const transactions = await Transaccion.find();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: 'No se pudieron obtener las transacciones' });
    }
  });

  // Actualizar la única transacción existente
router.put('/update-transaccion', async (req, res) => {
    try {
      const { nombre, monto, fecha, horario, estado } = req.body;
  
      // Buscar la única transacción (siempre es la misma)
      const transaccion = await Transaccion.findOne();
  
      if (!transaccion) {
        return res.status(404).json({ message: 'Transacción no encontrada' });
      }
  
      // Actualizar los campos de la transacción
      transaccion.nombre = nombre;
      transaccion.monto = monto;
      transaccion.fecha = fecha;
      transaccion.horario = horario;
      transaccion.estado = estado;
  
      // Guardar la transacción actualizada
      await transaccion.save();
  
      res.status(200).json(transaccion);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar la transacción' });
    }
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
