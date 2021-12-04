const express = require('express')
const usersController = require('../controllers/users')

const router = express.Router()

router.get('/', usersController.getAllUsers)

router.get('/:id', usersController.getUserById)

router.post('/', usersController.createUser)

router.post('/login', usersController.loginUser)

// router.put('/:id', usersController.updateUserById)


module.exports = router